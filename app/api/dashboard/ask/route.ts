import { NextRequest, NextResponse } from "next/server";

import * as z from "zod";
import { validateBody } from "@/lib/validations/request";
import { getUser } from "@/lib/session";
import { fetchFromService } from "@/lib/server-requests";
import {
  getNaturalLanguageAnswerPrompt,
  getSqlQuestionAnsweringPrompt,
} from "@/lib/prompts";
import prisma from "@/lib/prisma";
import { stringifyWithBigInt } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    question: z.string().min(1).max(4096),
  });

  const body = (await req.json()) as z.infer<typeof schema>;
  if (!validateBody(body, schema)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  let prompt = getSqlQuestionAnsweringPrompt(body.question, user.id);
  let data = {
    model: {
      apiKey: process.env.OPENAI_API_KEY as string,
      name: "gpt-4",
    },
    prompt,
  };

  let res = await fetchFromService("generic-output", data);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to create SQL query from question" },
      { status: 422 }
    );
  }
  const json = await res.json();

  let query;
  let result;
  try {
    query = mitigateVulnerabilities(JSON.parse(json.output).sqlQuery, user.id);
    result = stringifyWithBigInt(await prisma.$queryRawUnsafe(query));
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create SQL query from question" },
      { status: 422 }
    );
  }

  prompt = getNaturalLanguageAnswerPrompt(body.question, query, result);
  data = {
    model: {
      apiKey: process.env.OPENAI_API_KEY as string,
      name: "gpt-3.5-turbo-16k",
    },
    prompt,
  };

  res = await fetchFromService("generic-output", data);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to create natural langage answer" },
      { status: 422 }
    );
  }

  const { output } = await res.json();
  return NextResponse.json(
    {
      question: body.question,
      answer: output,
    },
    { status: 200 }
  );
}

function mitigateVulnerabilities(query: string, id: string) {
  if (query === "") {
    return query;
  }

  const lowerCaseQuery = query.toLowerCase();
  const unauthorizedStatements = ["insert", "update", "delete"];

  for (let statement of unauthorizedStatements) {
    if (lowerCaseQuery.includes(statement)) {
      throw new Error(`Unauthorized SQL statement used in query: ${statement}`);
    }
  }

  if (!lowerCaseQuery.includes(id)) {
    throw new Error("The query should include the correct userId");
  }
  return query;
}
