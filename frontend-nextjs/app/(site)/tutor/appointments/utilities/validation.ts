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
    invitees: z
        .array(
            z.object({
                value: z.string().email({ message: "Please enter a valid email" }),
            })
        ).nonempty({
            message: "At least one location is required"
        }).min(1, {
            message: "At least one location is required"
        }),
    description: z.string({
        required_error: "Description must be at least 4 characters",
    }).min(4).max(160),
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
    duration: z.string({
        required_error: "Please select meeting duration",
    }),
});
