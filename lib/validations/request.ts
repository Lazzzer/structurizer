import { z } from "zod";

export function validateBody(
  body: any,
  schema: z.ZodType
): body is z.infer<typeof schema> {
  const { success } = schema.safeParse(body);
  return success;
}
