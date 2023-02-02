import { StatusCodes } from "http-status-codes";
import { createUser } from "./user.service";
import { Request, Response } from "express";
import { mongoose } from "@typegoose/typegoose";
import { RegisterUserBody } from "./user.schema";
import logger from "../../utils/logger";
import { MongooseError } from "mongoose";

export async function registerUserHandler(req: Request<{}, {}, RegisterUserBody>, res: Response) {
    const { username, email, password } = req.body;
    try {
        // Create User
        await createUser({ username, email, password });
        return res.status(StatusCodes.CREATED).send("User Created")
    } catch (error) {
        if (error.code == 11000) {
            return res.status(StatusCodes.CONFLICT).send("User Exists",)
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error)
    }
}