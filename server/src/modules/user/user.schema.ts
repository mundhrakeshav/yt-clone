import { object, string, TypeOf } from "zod";

export const registerUserSchema = {
    body: object({
        username: string({
            required_error: "Username Required"
        }),
        email: string({
            required_error: "Email Required"
        }).email("Invalid Email"),
        password: string({
            required_error: "Password Required"
        }).min(6, "Password too short. Min 6 characters").max(64, "Password to long"),
        confirm_password: string({
            required_error: "Confirm Password Required"
        })
    }).refine(data => data.password == data.confirm_password, {
        message: "Password != Confirm Password",
        path: ["confirm_password"]
    })
}

export type RegisterUserBody = TypeOf<typeof registerUserSchema.body>;
