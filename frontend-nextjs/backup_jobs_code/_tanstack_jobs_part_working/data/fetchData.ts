import { jobSchema } from "./schema";
import { z } from "zod";


export async function makeData() {



  // const makeDataLevel = (depth = 0): Person[] => {
  //   const len = lens[depth]!
  //   return range(len).map((d): Person => {
  //     return {
  //       ...newPerson(),
  //       subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
  //     }
  //   })
  // }

  // return makeDataLevel()

  // console.log("getNextJobs() called");
  // const API_URI = "http://localhost:8000";
  // const res = await fetch(`${API_URI}/api/jobs/next`);
  // const json = await res.json();
  // const new_jobs = z.array(jobSchema).parse(json);
  // return new_jobs;

  // const API_URI = "http://localhost:8000";
  // axios.get(`${API_URI}/api/jobs/next`)
  //   .then((res) => {
  //     const new_jobs = z.array(jobSchema).parse(res.data);
  //     return new_jobs;
  //   }).catch((err) => {
  //     console.log(err);
  //   })

  const API_URI = "http://localhost:8000";
  const new_data = await fetch(`${API_URI}/api/jobs/next`);
  const json = await new_data.json();
  const new_jobs = z.array(jobSchema).parse(json);
  console.log("ZOD VERIFIED DATA", new_jobs);
  return new_jobs;
}


// const data = makeData()

export async function fetchData(options: {
  pageIndex: number
  pageSize: number
}) {
  // Simulate some network latency
  // await new Promise(r => setTimeout(r, 500))

  // Get our data
  const data = await makeData()
  console.log("REQUEST FOR NEW data", data);

  return {
    rows: data.slice(
      options.pageIndex * options.pageSize,
      (options.pageIndex + 1) * options.pageSize
    ),
    pageCount: Math.ceil(data.length / options.pageSize),
  }
}
