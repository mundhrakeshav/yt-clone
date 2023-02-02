import express from "express";
import requireUser from "../../middleware/requireUser";
import { findVideoHandler, streamVideoHandler, updateVideoHandler, uploadVideoHandler } from "./video.controller";
import { findVideos } from "./video.service";


const router = express.Router()

router.post("/", requireUser, uploadVideoHandler)
router.patch("/:videoID", requireUser, updateVideoHandler)
router.get("/:videoID", streamVideoHandler)
router.get("/", findVideoHandler)

export default router

