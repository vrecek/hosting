import fs from 'fs/promises'


const fsMkdir = async (path: string): Promise<void> => {
    try { await fs.access(path) }
    catch { await fs.mkdir(path) }
}


export default fsMkdir