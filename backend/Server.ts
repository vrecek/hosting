class Server
{
    public constructor()
    {

    }

    static async sleep(ms: number): Promise<null>
    {
        return new Promise(res => setTimeout(res, ms))
    }
}


export default Server