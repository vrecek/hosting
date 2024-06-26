import ffmpeg from 'fluent-ffmpeg'
import ffmpeg_static from 'ffmpeg-static'


ffmpeg.setFfmpegPath(ffmpeg_static!)


const ffprobe = async (file: string): Promise<ffmpeg.FfprobeFormat> => {
    return new Promise((res, rej) => {
        ffmpeg.ffprobe(file, (err, data) => {
            if (err)
                return rej(err)

            res(data.format)
        })
    })
}


export default ffprobe