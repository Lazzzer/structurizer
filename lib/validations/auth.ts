import * as z from "zod";

export const authSchema = z.object({
  username: z.string().min(3).max(64),
  password: z.string().min(8).max(64),
});
