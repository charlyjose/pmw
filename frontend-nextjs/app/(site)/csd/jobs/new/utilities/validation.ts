import * as z from "zod";

export const jobFormSchema = z.object({
    role: z.string({
        required_error: "Job role title is required",
    }),
    company: z.string({
        required_error: "Company name is required",
    }),
    description: z.string({
        required_error: "Please write a job description",
    }),
    salary: z.string({
        required_error: "Salary is required",
    }),
    mode: z.string({
        required_error: "Working mode is required",
    }),
    // location: z
    //     .array(
    //         z.object({
    //             value: z.string().min(2, {
    //                 message: "Location must be at least 2 character long",
    //             }),
    //         })
    //     ).nonempty({
    //         message: "At least one location is required"
    //     }).min(1, {
    //         message: "At least one location is required"
    //     }),
    location: z
        .array(
            z.object({
                value: z.string().refine((data) => {
                    // Trim whitespace from the beginning and end of the string
                    const trimmedData = data.trim();
                    // Check if the trimmed string is empty
                    return trimmedData.length > 0;
                }, {
                    message: "Location must not be empty",
                })
            })
        ).nonempty({
            message: "At least one location is required"
        }).min(1, {
            message: "At least one location is required"
        }),
    deadline: z.date({
        required_error: "Application deadline is required",
    }).refine((data) => {
        const today = new Date();
        const selectedDate = new Date(data);
        return selectedDate >= today;
    }, {
        message: "Application deadline must be in the future",
    }),
    link: z.string({
        required_error: "Job link is required",
    }).url(),
});
