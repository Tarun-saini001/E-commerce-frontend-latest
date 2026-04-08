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

// change pssword
export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .trim()
            .nonempty("Current password is required"),

        newPassword: z
            .string()
            .trim()
            .nonempty("New password is required")
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
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
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



export const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .nonempty("Name is required")
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(20,"Too long category name")
        .regex(/^[A-Z]/, "Name must start with a capital letter")
        .regex(/^[A-Za-z\s]*$/, "Name must contain only letters"),

    image: z
        .any()
        .refine((file) => file instanceof File || typeof file === "string",
            "Please upload an image")
        .refine(
            (file) => {
                if (typeof file === "string") return true;
                if (file instanceof File) {
                    return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type);
                }
                return false;
            },
            "Only images are allowed"
        )
});

export const productSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .min(2, "Title must be at least 2 characters")
        .max(20, "Name is Too Long..."),

    description: z
        .string()
        .trim()
        .min(1, "Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(150, "Too Long Description.."),

    price: z
        .coerce.number()
        .refine((val) => val !== 0, {
            message: "Price cannot be zero",
        })
        .refine((val) => val > 0, {
            message: "Price cannot be negative",
        }),

    stock: z
        .coerce.number()
        .refine((val) => Number.isFinite(val), {
            message: "Stock must be a valid number",
        })
        .min(0, {
            message: "Stock cannot be negative",
        }),


    category: z
        .string()
        .trim(),

    thumbnail: z
        .any()
        .refine(
            (file) => file instanceof File || typeof file === "string",
            "Please upload an image"
        )
        .refine(
            (file) => {
                if (typeof file === "string") return true;
                if (file instanceof File) {
                    return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
                }
                return false;
            },
            "Only images are allowed"
        ),
});