import Client from "./Client"


const defaultResult = (msg: string): void => {
    new Client.ResultBox('error')
              .setStyles({ top: '0', left: '50%', width: '50%', translate: '-50% 0', pos: 'fixed' })
              .fadeAnimation()
              .append(document.body, msg)
              .remove(2000)
}


export default defaultResult