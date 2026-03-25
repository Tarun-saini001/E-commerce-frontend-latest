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
            .regex(/^[A-Z]/, "Name must start with a capital letter")
            .regex(/^[A-Za-z\s]*$/, "Name must contain only letters"),

        email: z
            .string()
            .trim()
            .nonempty("Email is required")
            .regex(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/,
                "Invalid email format"
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
        .trim()
        .nonempty("Email is required")
        .email("Invalid email format"), // only validate format
    password: z.string().nonempty("Password is required"), // only required
});

// forgot password schema
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .nonempty("Email is required")
        .email("Invalid email format"),
});

// reset password schema
export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .trim()
            .nonempty("Password is required")
            .min(6, "Password must be at least 6 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                "Password must contain uppercase, lowercase, number & special character"
            ),
        confirmPassword: z
            .string()
            .trim()
            .nonempty("Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });



// Checkout form schema
export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("Name is required")
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Z]/, "Name must start with a capital letter")
    .regex(/^[A-Za-z\s]*$/, "Name must contain only letters"),

  email: z
    .string()
    .trim()
    .nonempty("Email is required")
    .email("Invalid email format"),

  postalCode: z
    .string()
    .trim()
    .nonempty("Postal code is required")
    .regex(/^\d{6}$/, "Postal code must be exactly 6 digits"),

  streetAddress: z
    .string()
    .trim()
    
    .nonempty("Street address is required"),

  phone: z
    .string()
    .trim()
    .nonempty("Phone number is required")
    .regex(/^\+?\d{10,14}$/, "Invalid phone number"),
});