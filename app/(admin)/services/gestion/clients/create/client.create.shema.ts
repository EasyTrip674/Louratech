import { z } from "zod";

export const createClientSchema = z.object({
    firstName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().optional(),
    passport: z.string().optional(),
    address: z.string().optional(),
    birthDate: z.string().optional(),
    fatherLastName: z.string().optional(),
    fatherFirstName: z.string().optional(),
    motherLastName: z.string().optional(),
    motherFirstName: z.string().optional(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Confirm Password must be at least 8 characters" }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
