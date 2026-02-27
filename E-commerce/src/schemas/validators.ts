// export const isRequired = (name: string, value: string): string =>
//     !value.trim() ? `${name} is required` : ""

// export const isValidEmail = (value: string): string =>
//     /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/.test(value)
//         ? ""
//         : "Invalid email address"


// export const isStrongPassword = (value: string): string => {
//     if (value.length < 6)
//         return "Password must be at least 6 characters"
//     if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/.test(value))
//         return "Password must contain uppercase, lowercase, number & special character";

//     return ""
// }

// export const  isMatch = (value:string , compare:string): string=>
//     value !== compare?"Password do not match":"";

// export const isValidName = (value:string): string=>{
//     if(!/^[A-Z][a-zA-Z\s]+$/.test(value))
//         return "Name must start with a capital letter"
//     if(value.length<3)
//         return "Name is to short"

//     return ""
// }


import { z } from "zod";

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .nonempty("Name is required")
            .min(2, "Name must be at least 2 characters")
            .regex(
                /^[A-Z][a-zA-Z\s]*$/,
                "Name must start with a capital letter and contain only letters"
            ),

        email: z
            .string()
            .trim()
            .nonempty("Email is required")
            .regex(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/,
                "Invalid email address"
            ),

        password: z
            .string()
            .trim()
            .nonempty("Password is required")
            .min(6, "Password must be at least 6 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            ),

        confirmPassword: z.string().trim().nonempty("Confirm password is required"),
    })
    .refine((data) => {
        if (!data.password) return true; // handled above
        return data.confirmPassword === data.password;
    }, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });


// login schema 
export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email format")
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});