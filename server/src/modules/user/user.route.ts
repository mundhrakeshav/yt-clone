import express, { Request, Response } from "express";
import { registerUserHandler } from "./user.controller";
import { processRequestBody } from "zod-express-middleware";
import { registerUserSchema } from "./user.schema";
import requireUser from "../../middleware/requireUser";

const router = express.Router()

router.get("/", requireUser, async (req: Request, res: Response) => {
    return res.send(res.locals.user)
})

router.post("/", processRequestBody(registerUserSchema.body) ,registerUserHandler)


export default router