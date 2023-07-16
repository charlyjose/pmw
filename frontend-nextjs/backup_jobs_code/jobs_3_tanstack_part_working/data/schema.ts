import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const jobSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  salary: z.string(),
  company: z.string(),
  placement: z.string(),
  location: z.array(z.string()),
  label: z.string(),
  deadline: z.string(),
  link: z.string(),
})

export type Job = z.infer<typeof jobSchema>
