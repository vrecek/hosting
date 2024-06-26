import ffmpeg from 'fluent-ffmpeg'


const makeThumbnail = async (dest: string, thumb_path: string, thumb_name: string, ts: number): Promise<void> => {
    return new Promise((res, rej) => {
        ffmpeg(dest).screenshots({
            count: 1,
            folder: thumb_path,
            timestamps: [ts],
            filename: thumb_name,
            size: '640x480'
        })
        .on('end', res)
        .on('error', rej)
    })
}


export default makeThumbnail