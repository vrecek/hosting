import mongoose from "mongoose"
import FileSchema from "../interfaces/FileSchema"


const fileSchema = new mongoose.Schema<FileSchema>({
    ownerID: String,
    
    items: {
        type: [{
            secretName: String,
            thumbnail: { type: String, default: undefined }
        }],

        default: []
    }
})


export default mongoose.model<FileSchema>('File', fileSchema)