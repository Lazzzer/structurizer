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

  let sqlQuery;
  let sqlResult;
  try {
    const { sqlQuery: query } = JSON.parse(json.output);
    sqlQuery = query;

    console.log(">>>>>>>>>>> SQL QUERY >>>>>>>>>");
    console.log(sqlQuery);

    sqlResult = await prisma.$queryRawUnsafe(sqlQuery); // yup...

    console.log(">>>>>>>>>>> SQL RESULT >>>>>>>>>");
    console.log(sqlResult);
  } catch (e) {
    console.log("ERROR", e);
    return NextResponse.json(
      { error: "Failed to create SQL query from question" },
      { status: 422 }
    );
  }

  prompt = getNaturalLanguageAnswerPrompt(body.question, sqlQuery, sqlResult);

  console.log(">>>>>>>>>>> PROMPT >>>>>>>>>");
  console.log(prompt);

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

  console.log(">>>>>>>>>>> OUTPUT >>>>>>>>>");
  console.log(output);

  return NextResponse.json(
    {
      question: body.question,
      answer: output,
    },
    { status: 200 }
  );
}
