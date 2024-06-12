import mongoose from "mongoose"
import VideoSchema from "../interfaces/VideoSchema"


const videoSchema = new mongoose.Schema<VideoSchema>({
    name: String
})


export default mongoose.model<VideoSchema>('Video', videoSchema)