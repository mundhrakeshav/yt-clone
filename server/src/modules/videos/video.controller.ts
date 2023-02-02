import { Request, Response, json } from "express";
import busBoy from "busboy";
import { createVideo, findVideo, findVideos } from "./video.service";
import { StatusCodes } from "http-status-codes";
import { Video } from "./video.model";
import fs from "fs";
import { UpdateVideoBody, UpdateVideoParams } from "./video.schema";
const MIME_TYPES = ["video/mp4"]
const CHUNK_SIZE_IN_BYTES = 1000000; // 1mb

function getPath(videoID:Video["videoID"], ext: Video["extension"]) {
    return `${process.cwd()}/videos/${videoID}.${ext}`
}

export async function uploadVideoHandler(req: Request, res: Response) {
    const bb = busBoy({ headers: req.headers })
    const user = res.locals.user;
    const video = await createVideo({ owner: user._id })
    
    bb.on("file", async (_, file, info) => {
        if (!MIME_TYPES.includes(info.mimeType)) {
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid File")
        }
        const ext = info.mimeType.split("/")[1]
        const filePath = getPath(video.videoID, ext)
        video.extension = ext
        video.save()
        const stream = fs.createWriteStream(filePath);
        file.pipe(stream)
    })

    bb.on("close", () => {
        res.writeHead(StatusCodes.CREATED, {
            Connection: "close",
            "Content-Type": "application/json"
        })
        res.write(JSON.stringify(video));
        res.end()
    })
    return req.pipe(bb)
}


export async function updateVideoHandler(req: Request<UpdateVideoParams, {}, UpdateVideoBody>, res: Response) {
    const { videoID } = req.params
    const { title, description, published } = req.body
    const { _id: userID } = res.locals.user
    const video = await findVideo(videoID)
    if (!video) {
        return res.status(StatusCodes.NOT_FOUND).send("Video not found")
    }
    if ( String(video.owner) != String(userID)) {
        return res.status(StatusCodes.UNAUTHORIZED).send("UNAUTHORIZED")
    }
    video.title = title
    video.description = description
    video.published = published

    await video.save()
    return res.status(StatusCodes.OK).send(video)

}
export async function findVideoHandler(_: Request, res: Response) {
    const videos = await findVideos()
    return res.status(StatusCodes.OK).send(videos)
}


export async function streamVideoHandler(req: Request, res: Response) {
    const { videoID } = req.params;
    const range = req.headers.range;
    if (!range) {
        return res.status(StatusCodes.BAD_REQUEST).send("Send Range")
    }
    const video = await findVideo(videoID);
    
    if (!video) {
        return res.status(StatusCodes.NOT_FOUND).send("Video not found")
        
    }
    const filePath = getPath(video.videoID, video.extension)
    const fileSizeInBytes = fs.statSync(filePath).size
    const chunkStart = Number(range.replace(/\D/g, ""))
    const chunkEnd = Math.min(
        chunkStart + CHUNK_SIZE_IN_BYTES,
        fileSizeInBytes - 1
    );

    const contentLength = chunkEnd - chunkStart + 1;

    const headers = {
        "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
        "Accept-Ranges": "bytes",
        "Content-length": contentLength,
        "Content-Type": `video/${video.extension}`,
        // "Cross-Origin-Resource-Policy": "cross-origin",
    };

    res.writeHead(StatusCodes.PARTIAL_CONTENT, headers);

    const videoStream = fs.createReadStream(filePath, {
        start: chunkStart,
        end: chunkEnd,
    });

    videoStream.pipe(res);
}