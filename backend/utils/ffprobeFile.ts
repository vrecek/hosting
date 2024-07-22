import ffmpeg from 'fluent-ffmpeg'


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