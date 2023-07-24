import * as z from "zod";

export const meetingFormSchema = z.object({
    agenda: z.string({
        required_error: "Please select meeting agenda",
    }),
    mode: z.string({
        required_error: "Please select meeting mode",
    }),
    team: z.string({
        required_error: "Please select your meeting party",
    }),
    description: z.string({
        required_error: "Description must be at least 4 characters",
    }).min(4, {
        message: "Description must be at least 4 characters",
    }).max(300,
        {
            message: "Description must be less than 300 characters",
        }),
    date: z.date({
        required_error: "Meeting date is required",
    }).refine((data) => {
        const today = new Date();
        const selectedDate = new Date(data);
        return selectedDate >= today;
    }, {
        message: "Meeting date must be in the future",
    }),
    time: z.string({
        required_error: "Please select meeting time",
    }),
});
