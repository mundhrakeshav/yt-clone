import { object, string, TypeOf, boolean } from "zod";

export const updateVideoSchema = {
    body: object({
        title: string(),
        description: string(),
        published: boolean()
    }),
    params: object({
        videoID: string()
    })
}

export type UpdateVideoBody = TypeOf<typeof updateVideoSchema.body>;
export type UpdateVideoParams = TypeOf<typeof updateVideoSchema.params>;
