import fs from "fs"
import path from "path"
import { faker } from "@faker-js/faker"

import { labels, placements, deadlines } from "./data"

const jobs = Array.from({ length: 100 }, () => ({
  id: `JOB-${faker.datatype.number({ min: 1000, max: 9999 })}`,
  title: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
  placement: faker.helpers.arrayElement(placements).value,
  label: faker.helpers.arrayElement(labels).value,
  deadline: faker.helpers.arrayElement(deadlines).value,
}))

fs.writeFileSync(
  path.join(__dirname, "jobs.json"),
  JSON.stringify(jobs, null, 2)
)

console.log("✅ Jobs data generated.")
