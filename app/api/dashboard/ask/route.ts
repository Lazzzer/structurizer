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
import { log, stringifyWithBigInt } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) {
    log.warn("Ask", req.method, "Access denied");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const schema = z.object({
    question: z.string().min(1).max(4096),
  });

  const body = (await req.json()) as z.infer<typeof schema>;
  if (!validateBody(body, schema)) {
    log.warn("Ask", req.method, "Failed request, invalid body");
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  log.debug("Ask", req.method, "Question: ", body.question);

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
    log.warn("Ask", req.method, "Failed to create SQL query from question");
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
    log.debug("Ask", req.method, "SQL Query: ", query);
    log.debug("Ask", req.method, "SQL Result: ", result);
  } catch (e) {
    log.warn("Ask", req.method, "Failed to execute SQL query");
    log.debug("Ask", req.method, "Failed to execute SQL query", e);
    return NextResponse.json(
      { error: "Failed to execute SQL query" },
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
    log.warn("Ask", "Failed to create natural language answer");
    return NextResponse.json(
      { error: "Failed to create natural language answer" },
      { status: 422 }
    );
  }

  const { output } = await res.json();
  log.debug("Ask", req.method, "Successfully answered question");
  log.debug("Ask", req.method, "Answer: ", output);
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
      log.warn(
        "Ask",
        "POST",
        `Unauthorized SQL statement used in query: ${statement}`
      );
      throw new Error(`Unauthorized SQL statement used in query: ${statement}`);
    }
  }

  if (!lowerCaseQuery.includes(id)) {
    log.warn("Ask", "POST", "The query does not include the correct userId");
    throw new Error("The query should include the correct userId");
  }
  return query;
}
