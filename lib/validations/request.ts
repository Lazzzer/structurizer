import * as z from "zod";

export function validateBody(
  body: any,
  schema: z.ZodType
): body is z.infer<typeof schema> {
  const { success } = schema.safeParse(body);
  return success;
}

export function validateRequiredOrEmptyFields(data: any, fields: string[]) {
  return fields.every((field) => {
    if (
      data[field] === null ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      throw new Error(`Field ${field} is required`);
    }
    return true;
  });
}
