import { z } from "zod";

export const editEmployeeSheme = z.object({
    id: z.string().nonempty(),
    firstName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().optional(),
    address: z.string().optional(),
});
