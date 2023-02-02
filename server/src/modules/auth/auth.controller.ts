import { Request, Response } from "express";
import { findUserByEmail } from "../user/user.service";
import { StatusCodes } from "http-status-codes";
import { signJWT } from "./auth.utils";
import omit from "../../helper/omit";
import { LoginUserBody } from "./auth.schema";
import { User } from "../user/user.model";

export async function loginHandler(req: Request<{}, {}, LoginUserBody>, res: Response) {
    const { email, password } = req.body
    const user = await findUserByEmail(email)
    if (!user || !(await user.comparePassword(password))) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Invalid email or passord");
    }
    console.log(user);
    
    const payload = omit(user.toJSON(), ["password", "__v"])
    const jwt = signJWT(payload);
    res.cookie("accessToken", jwt, {
        maxAge: 3.154e10,
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false
    })

    return res.status(StatusCodes.OK).send(jwt);
    //Find user email
    //Compare user password
    // Sign a JWT
    // Add a cookie to reponse
}