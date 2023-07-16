import * as z from "zod";

export const signinFormSchema = z.object({
  email: z
    .string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(2, {
      message: "Password must be at least 2 characters.",
    })
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    }),
});