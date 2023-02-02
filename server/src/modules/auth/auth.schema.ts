import { object, string, TypeOf } from "zod";
export const loginUserSchema = {
    body: object({
        email: string({
            required_error: "Email Required"
        }).email("Not a valid email"),
        password: string({
            required_error: "Password Required"
        }).min(6, "Password too short. Min 6 characters").max(64, "Password to long")
    })
}

export type LoginUserBody = TypeOf<typeof loginUserSchema.body>;
