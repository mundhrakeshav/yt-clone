import express, { Request, Response } from "express";
import { processRequestBody } from "zod-express-middleware";
import { loginHandler } from "./auth.controller";
import { loginUserSchema } from "./auth.schema";
import requireUser from "../../middleware/requireUser";

const router = express.Router()

router.post("/", processRequestBody(loginUserSchema.body), loginHandler)


export default router