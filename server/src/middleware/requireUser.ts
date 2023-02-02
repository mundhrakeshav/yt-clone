import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../modules/auth/auth.utils";
import { StatusCodes } from "http-status-codes";


export default function requireUser(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user;
    console.log(user);
    
    if (!user) {
        return res.status(StatusCodes.FORBIDDEN)
    }

    return next()
}