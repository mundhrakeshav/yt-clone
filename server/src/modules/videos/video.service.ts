import { Video, VideoModel } from "./video.model";

export function createVideo({ owner }: { owner: string }) {
    return VideoModel.create({ owner });
}

export function findVideo(videoID: Video["videoID"]) {
    return VideoModel.findOne({videoID});
}

export function findVideos() {
    return VideoModel.find({published: true}).lean();
}