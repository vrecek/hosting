import Client, { LOAD } from "./Client"


const defaultLoad = (appendTo: HTMLElement): LOAD.Loading => {
    const load = new Client.Loading()

    load.defaultStyleDots({
        backgroundClr: 'rgba(30, 30, 30, .5)',
        position: 'absolute',
        dotSize: 15 
    }).append(appendTo)

    return load
}


export default defaultLoad