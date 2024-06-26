import { FileTypes } from "../interfaces/UserSchema"


const getFiletype = (fileext: string): FileTypes  => {
    switch (fileext)
    {
        case 'image/png':
        case 'image/jpg':
        case 'image/gif':
            return 'picture'

        case 'video/mp4':
            return 'video'

        case 'audio/mpeg':
            return 'music'

        case 'text/plain':
            return 'txt'

        case 'application/x-javascript':
        case 'application/x-shellscript':
        case 'text/x-python':
            return 'code'

        default: return 'other'
    }
}


export const AvailableFileTypes: string[] = [
    'image/png', 'image/jpg', 'image/gif',
    'video/mp4',
    'audio/mpeg',
    'text/plain',
    'application/x-javascript', 'application/x-shellscript', 'text/x-python'
]

export default getFiletype