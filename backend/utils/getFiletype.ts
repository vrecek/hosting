import { FileTypes } from "../interfaces/UserSchema"


const getFiletype = (fileext: string): FileTypes  => {
    switch (fileext)
    {
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.gif':
            return 'picture'

        case '.mp4':
        case '.mkv':
            return 'video'

        case '.mp3':
        case '.avi':
        case '.ogg':
            return 'audio'

        case '.txt':
            return 'txt'

        case '.js':
        case '.sh':
        case '.py':
        case '.c':
        case '.cpp':
            return 'code'

        default: return 'other'
    }
}


export default getFiletype