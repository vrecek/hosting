import Client from "./Client"


const accountHandle = async (url: string, method: 'DELETE' | 'POST'): Promise<void> => {
    const load = new Client.Loading()
    load.defaultStyleDots()
        .append(document.body)

    const [err] = await Client.Fetches.http(
        url, method, 
        { credentials: 'include' }
    )
    
    if (err)
    {
        load.remove()

        new Client.ResultBox('error')
                  .setStyles({ pos: 'fixed', top: '0', left: '50%', width: '50%', translate: '-50% 0'})
                  .append(document.body, err.serverMsg)
                  .fadeAnimation()
                  .remove(2500)

        return
    }

    window.location.href = '/'
}


export default accountHandle