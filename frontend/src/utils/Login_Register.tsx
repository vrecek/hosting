import { CredentialsBody } from "@/interfaces/AccountInterfaces"
import Client, { RB } from "./Client"


const credentialsAction = async (
    e:         React.FormEvent, 
    url:       string, 
    box:       RB.ResultBox, 
    succMsg:   string,
    bodyFn:    CredentialsBody,
    successFn: (form: HTMLFormElement) => void
): Promise<void> => 
{
    e.preventDefault()

    const t:   HTMLFormElement    = e.currentTarget! as HTMLFormElement,
          ele: HTMLInputElement[] = [...t.elements] as HTMLInputElement[]

    const load = new Client.Loading()
    load.defaultStyleDots({
        backgroundClr: 'rgba(30, 30, 30, .75)',
        clr1: 'royalblue',
        dotSize: 15,
        position: 'absolute'
    }).append(t)

    const [err] = await Client.Fetches.http(url, 'POST', {
        credentials: 'include',
        body: bodyFn(ele)
    })

    load.remove()

    box.setType(err ? 'error' : 'success')
        .setStyles({ pos: 'absolute', top: '0', left: '0', width: '100%', padding: '1.35em' })
        .append(t, err ? err.serverMsg : succMsg)
        ?.fadeAnimation()
        .remove(2000)

    if (!err)
    {
        ele.map(x => x.value = '')
        setTimeout(() => successFn(t), 1500)
    }
}


export default credentialsAction