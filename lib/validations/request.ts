import { z } from "zod";

export function validateBody(
  body: any,
  schema: z.ZodType
): body is z.infer<typeof schema> {
  const { success } = schema.safeParse(body);
  return success;
}

export function validateRequiredOrEmptyFields(jsonObj: any, fields: string[]) {
  return fields.every((field) => {
    if (!jsonObj[field] || jsonObj[field].trim() === "") {
      throw new Error(`Field ${field} is required`);
    }
  });
}
