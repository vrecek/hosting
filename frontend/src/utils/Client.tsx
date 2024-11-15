// Aliases to export
namespace Aliases {
    export type Maybe<T> = T | null | undefined
}

// TextBox types
namespace RB {
    export abstract class ResultBox {
        public abstract setType(type: RB.BoxType): this
        public abstract setStyles({left, pos, top, bottom, right, width}: BoxPositions): this
        public abstract fadeAnimation(): this
        public abstract append(element: Element, msg: string): this | null
        public abstract remove(afterMs?: number): void
    }

    export type BoxType = 'error' | 'warning' | 'success'
    export type Positions = 'absolute' | 'fixed' | 'static'
    export type BoxPositions = {
        pos:      Positions
        left?:     string
        top?:      string
        right?:    string
        bottom?:   string
        width?:    string 
        translate?: string
        padding?:  string
    }
    export type BoxStyles = {
        background: string
        iconChar: '!' | '?' | '✓'
    }
}

// DropDown types
namespace DD {
    export abstract class DropDown {
        public abstract expandMenu(display?: DD.DisplayType): void 
        public abstract shrinkMenu(display?: DD.DisplayType): void
        public abstract rotateArrow(arrow: HTMLElement): void
        public abstract setElement(element: HTMLElement): void
        public abstract switchActive(): void
        public abstract getActive(): boolean
        public abstract getID(): string
    }

    export type DisplayType = 'block' | 'flex'

    export type ReturnedHeight = {
        height: number
        marginTop: number
        marginBottom: number
    }

    export type BoxProps = {
        mTop: number
        mBottom: number
    } | null
}

// Loading types
namespace LOAD {
    export abstract class Loading {
        public abstract defaultStyleDots(dotStyles?: LOAD.DotStyleType): this
        public abstract append(element: HTMLElement, appendFirst?: boolean, addRelative?: boolean): void
        public abstract remove(): void
    }

    export type DefaultStyle = {
        backgroundClr?: string,
        clr1?:          string,
    }
    
    export type DotStyleType = DefaultStyle & {
        dotSize?:   number
        position?: 'fixed' | 'absolute'
    }
}

// Fetches types
namespace FETCH {
    export type RequestType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

    export type FetchOptions = {
        body?: any
        abortSignalMs?: number
        cookie?: string
        formdataBody?: FormData
        authorization?: any
        credentials?: any
    }

    export type AbortObj = {
        signal?: AbortSignal
    }

    export type FetchResult<T> = [
        ErrorReturn | null,
        SuccessReturn<T> | null
    ]

    export type ErrorReturn = MixReturn & {
        serverMsg: string
    }

    export type SuccessReturn<T> = MixReturn & {
       json: T | null
    }

    export type MixReturn = {
        code: number
        defaultMsg: string
    }
    
    export type FetchErrorReturn = {
       code: number,
       msg: string
    }
}



export default class Client {
    public static ResultBox = class extends RB.ResultBox 
    {
        private box:            HTMLElement  | null
        private typeStyles:     RB.BoxStyles | null
        private positionStyles: RB.BoxPositions
        private removeAnim:     (() => Promise<void>) | null


        public constructor(type?: RB.BoxType)
        {
            super()

            this.box        = null
            this.typeStyles = null
            this.removeAnim = null

            this.setType(type ?? 'error')

            this.positionStyles = {
                pos: 'static',
                left: 'auto',
                top: 'auto',
                translate: 'none',
                width: '100%'
            }
        }


        public setType(type: RB.BoxType): this
        {
            if (type === 'error')
                this.typeStyles = { background: '#d62439', iconChar: '!' }

            else if (type === 'warning')
                this.typeStyles = { background: 'rgb(224, 150, 11)', iconChar: '?' }

            else if (type === 'success')
                this.typeStyles = { background: '#2fc23d', iconChar: '✓' }


            return this
        }

        public setStyles({left, pos, top, bottom, right, width, padding, translate}: RB.BoxPositions): this
        {
            this.positionStyles = {
                left:      left      ?? 'auto',
                top:       top       ?? 'auto',
                bottom:    bottom    ?? 'auto',
                right:     right     ?? 'auto',
                width:     width     ?? '100%',
                translate: translate ?? 'none',
                padding:   padding   ?? '.75em',
                pos
            }

            return this
        }

        public append(element: Element, msg: string, cname?: string): this | null
        {
            if (this.box || !this.typeStyles) return null

            const div:  HTMLDivElement  = document.createElement('div'),
                  p:    HTMLDivElement  = document.createElement('p'),
                  span: HTMLSpanElement = document.createElement('span')

            div.className = cname ?? 'resultbox-element'

            const WHITE_COLOR: string = 'rgb(250, 250, 250)'
            const {pos, bottom, left, right, top, width, padding, translate} = this.positionStyles

            Object.assign(div.style, {
                background: this.typeStyles.background,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                borderRadius: '.2em',
                zIndex: '100',
                color: WHITE_COLOR,
                position: pos,
                translate,
                padding,
                left,
                right,
                bottom,
                width,
                top
            } as CSSStyleDeclaration)

            Object.assign(p.style, {
                fontWeight: '700',
                fontSize: '.9rem',
                color: WHITE_COLOR,
                marginRight: '.75em'
            } as CSSStyleDeclaration)
            
            Object.assign(span.style, {
                width: '35px',
                height: '35px',
                flexShrink: '0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: `2px solid ${WHITE_COLOR}`,
                color: WHITE_COLOR,
                borderRadius: '50%',
                fontWeight: '700',
            } as CSSStyleDeclaration)


            p.textContent = msg
            span.textContent = this.typeStyles.iconChar

            div.appendChild(p)
            div.appendChild(span)

            this.box = div

            element.appendChild(div)
            
            return this
        }

        public fadeAnimation(): this
        {
            const transitionMs: number = 1000

            this.removeAnim = async () => {
                this.box!.style.transition = `${transitionMs}ms`
                this.box!.style.top = '-100%'

                return new Promise(res => setTimeout(res, transitionMs))
            }

            return this
        }

        public remove(afterMs?: number): void
        {
            setTimeout(async () => {
                await this.removeAnim?.()

                this.box?.remove()
                this.box = null
                this.removeAnim = null

            }, afterMs ?? 0)
        }
    }


    public static DropDown = class extends DD.DropDown
    {
        private active:       boolean
        private elementList:  HTMLElement | undefined
        private boxProps:     DD.BoxProps
        private transitionMs: number
        private id:           string


        private returnHeight(list: HTMLElement, display?: DD.DisplayType): DD.ReturnedHeight {
            list.style.height  = 'auto'
            list.style.display = display ?? 'block'

            const getValueOfProperty = (property: string): number => {
                return parseFloat(window.getComputedStyle(list, null)
                                    .getPropertyValue(property)
                                    .split('')
                                    .filter(x => /[0-9.]/ig.test(x) )
                                    .join('')
                                )
            }
            
            const height: number = getValueOfProperty('height')

            if(!this.boxProps) {
                const marginTop:    number = getValueOfProperty('margin-top'),
                      marginBottom: number = getValueOfProperty('margin-bottom')


                this.boxProps = {
                    mTop: marginTop,
                    mBottom: marginBottom
                }
            }

            return {
                height, 
                marginTop: this.boxProps.mTop, 
                marginBottom: this.boxProps.mBottom
            }
        }

        private zeroListProperties(list: HTMLElement): void {
            list.style.marginTop    = '0'
            list.style.marginBottom = '0'
            list.style.height       = '0'
            list.style.overflow     = 'hidden'
        }

        private calculateListProperties(list: HTMLElement, values: DD.ReturnedHeight): void {
            const {marginBottom, marginTop, height} = values

            list.style.marginTop    = `${ marginTop }px`
            list.style.marginBottom = `${ marginBottom }px`
            list.style.height       = `${ height }px`
        }


        public constructor(transitionMs: number, hiddenList?: HTMLElement)
        {
            super()

            this.id           = Math.random().toString().slice(2)
            this.active       = false
            this.elementList  = hiddenList
            this.boxProps     = null
            this.transitionMs = transitionMs
        }


        /**
            * @info Use height: 0, display: none, overflow: hidden IF THE ELEMENT IS HIDDEN BY DEFAULT 
            * @param display Optional - block or flex
        */
        public expandMenu(display?: DD.DisplayType): void
        {
            if (!this.active || !this.elementList) return

            const VALUES: DD.ReturnedHeight = this.returnHeight(this.elementList, display)
            
            this.elementList.style.transition = '0'
            this.zeroListProperties(this.elementList)
            
            setTimeout(() => {
                this.elementList!.style.transition = `${this.transitionMs}ms`
                this.calculateListProperties(this.elementList!, VALUES)

                setTimeout(() => this.elementList!.style.overflow = 'visible', this.transitionMs)
            }, 5);
        }


        /**
            * @param display Optional - block or flex
        */
        public shrinkMenu(display?: DD.DisplayType): void
        {
            if(this.active || !this.elementList) return

            this.elementList.style.transition = `${this.transitionMs}ms`
            this.elementList.style.overflow   = 'hidden'

            this.calculateListProperties(this.elementList, this.returnHeight(this.elementList, display))

            setTimeout(() => {
                this.zeroListProperties(this.elementList!)

                setTimeout(() => this.elementList!.style.display = 'none', this.transitionMs)
            }, 5)
        }  

        /**
            * @param arrow Rotates passed element (presumably arrow icon to indicate an expanded list)
        */
        public rotateArrow(arrow: HTMLElement): void
        {
            this.active
                ? arrow.style.transform = 'rotate(180deg)'
                : arrow.style.transform = 'rotate(0)'
        }

        public switchActive(): void 
        { 
            this.active = !this.active 
        }

        public setElement(element: HTMLElement): void
        {
            this.elementList = element
        }

        public getActive(): boolean 
        { 
            return this.active 
        }

        public getID(): string 
        {
            return this.id
        }
    }


    public static Loading = class extends LOAD.Loading
    {
        private div:             HTMLElement
        private currentAppended: HTMLElement | null
        private customElement:   HTMLElement | null


        public constructor(className?: string)
        {
            super()

            this.currentAppended = null
            this.customElement   = null
            
            this.div = document.createElement('div')
            this.div.className = className ?? 'loading-default-class'
        } 

        /**
            * @info Sets default loading styles 
            * @param dotStyles Optional - Object of a optional dot styles
        */
        public defaultStyleDots(dotStyles?: LOAD.DotStyleType): this
        {
            const spans:     HTMLElement[] = [...Array(3)].map(_ => document.createElement('span')),
                  container: HTMLElement   = document.createElement('div')


            const appliedStyles: LOAD.DotStyleType = { 
                backgroundClr: dotStyles?.backgroundClr ?? 'rgba(30, 30, 30, .85)',
                clr1:          dotStyles?.clr1          ?? 'royalblue',
                position:      dotStyles?.position      ?? 'fixed',
                dotSize:       dotStyles?.dotSize       ?? 20
            }

            const { backgroundClr, clr1, position, dotSize } = appliedStyles
            

            Object.assign(this.div.style, {
                position,
                left: '0',
                top: '0',
                width: '100%',
                height: '100%',
                background: backgroundClr,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: '100'
            } as CSSStyleDeclaration)

            container.style.display = 'flex'

            let i: number = 100
            for (const dot of spans)
            {
                container.appendChild(dot)

                Object.assign(dot.style, {
                    background: clr1,
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    borderRadius: '50%',
                    marginRight: '.75em'
                } as CSSStyleDeclaration)

                dot.animate(
                    [
                        { transform: 'scale(1)' },
                        { transform: 'scale(.5)' },
                        { transform: 'scale(1)' }
                    ],
                    { duration: 800, iterations: Infinity, delay: i }
                )

                i += 100
            }

            this.div.appendChild(container)

            return this
        }

        /**
         * @param element custom HTML element
        */
        public setCustomElement(element: HTMLElement): this
        {
            this.customElement = element

            return this
        }

        /**
            * @param element An element which loading will be appended to 
            * @param appendFirst Optional - if true, the loading will be appended at the beginning of the container, otherwise as a last element (default)
        */
        public append(element: HTMLElement, appendFirst?: boolean): void
        {
            if (this.currentAppended) return

            if (this.customElement)
                this.div.appendChild(this.customElement)

            this.currentAppended = this.div

            appendFirst 
                ? element.prepend(this.div) 
                : element.appendChild(this.div)
        }

        /**
            @info Remove an appended image
        */
        public remove(): void
        {
            this.currentAppended?.remove()
            this.currentAppended = null
        }
    }


    public static Fetches = class
    {
        private static async getReturnedData<T>(res: Response): Promise<FETCH.FetchResult<T>> {
            let json: T | null

            try { json = await res.json() }
            catch (err) { json = null }
        
            const returnObj: FETCH.MixReturn = {
                code:       res.status,
                defaultMsg: res.statusText,
            }
            
            if (!res.ok) {
                const serverMsg: string = (json as any)?.msg ?? ''
                return [{...returnObj, serverMsg}, null]
            }
    
            return [null, {...returnObj, json}]
        }

        private static getFetchOptions(body?: any, formdataBody?: FormData, rest?: any): any[]
        {
            return [
                formdataBody ?? JSON.stringify(body),
                formdataBody ? {...rest} : {...rest, 'Content-Type': 'application/json'}
            ]
        }


        /**
            * @info Use when you want to do a regular request
            * @param url URL to fetch from
            * @param type HTTP method. GET, POST, PATCH, PUT, DELETE
            * @param options Optional options
            * @returns [error, data] array. Both can be null. `data` is an object { code: number, defaultMsg: string, json: T }. `error` is an object { code: number, defaultMsg: string, serverMsg: string }. Error's `defaultMsg` can be TimeoutError if the server didn't respond after abortSignalMs milliseconds
        */
        public static async http<T = any>(url: string, type: FETCH.RequestType, options?: FETCH.FetchOptions): Promise<FETCH.FetchResult<T>>
        {
            const {body, formdataBody, abortSignalMs, credentials, ...rest} = options ?? {}

            if (body && typeof body !== 'object') 
                throw `'body' is not an object. Got ${typeof body} instead`

            const [fetchBody, fetchHeaders] = this.getFetchOptions(body, formdataBody, rest),
                   abortTimeout: number     = abortSignalMs ?? 15000

            const abort: FETCH.AbortObj = {}
            if (abortSignalMs !== -1)
                abort.signal = AbortSignal.timeout(abortTimeout)

            try {
                const res: Response = await fetch(url, {
                    method: type,
                    headers: fetchHeaders,
                    credentials,
                    ...abort,
                    body: fetchBody
                })
            
                return await this.getReturnedData(res)

            } catch (err: any) {
                let serverMsg: string = 'Error from the fetch request'

                if (err.name === 'TimeoutError') 
                    serverMsg = `Request expired after: ${abortTimeout / 1000} seconds`
                

                return [
                    {
                        defaultMsg: err.name,
                        code: 500,
                        serverMsg
                    },
                    null
                ]
            }
        }
    }



    /**
     * @param code HTTP status code
     * @returns HTTP status as a string 
    */
    public static getDefaultMsgFromErrorCode(code: number): string
    {
        switch (code)
        {
            case 400: return 'Bad request'
            case 401: return 'Unauthorized'
            case 403: return 'Forbidden'
            case 404: return 'Not found'
            case 500: return 'Internal server error'

            default: return 'Unkown error'
        }
    }


    /**
     * @param dateNum Time in ms
     * @returns String representing a date in a "x days ago" format
    */
    public static numberToPastDateString(dateNum: number): string
    {
        const diff: number = Date.now() - dateNum,
              days: number = diff / 1000 / 60 / 60 / 24 

        if (days <= 1) 
            return 'Today'
        if (days > 1 && days < 2) 
            return '1 day ago'

        return `${Math.floor(days)} days ago`
    }


    /**
     * 
     * @param dateNum Time in ms
     * @param as Print output as: date, time, or both
     * @returns String representing date (e.g 7/18/2024 2:52:43 PM)
    */
    public static numberToDateString(dateNum: number, as?: 'date' | 'time'): string
    {
        const d: Date = new Date(dateNum)

        switch (as)
        {
            case 'date': return d.toLocaleDateString()
            case 'time': return d.toLocaleTimeString()
            default: return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
        }
    }


    /**
     * @param seconds total seconds 
     * @returns String in a "xx:xx:xx" or "xx:xx" format
    */
    public static secondsToTimeString(seconds: number): string
    {
        let isoStr: string = new Date(seconds * 1000).toISOString()

        if (seconds < 3600)
            isoStr = isoStr.slice(14, 19)
        else
            isoStr = isoStr.slice(11, 19)

        return isoStr
    }
    

    /**
     * @returns random id as string
    */
    public static getRandomID(): string 
    {
        return Math.random().toString(16).slice(2)
    }

    
    /**
     * 
     * @param bytes bytes
     * @returns readable string, eg 128 Bytes, 395 KiB, 223 MiB, 1.3 GiB
    */
    public static bytesToReadable(bytes: number): string
    {
        if (bytes <= 1024)
            return `${bytes} Bytes`

        const str = (v: number, s: string): string => `${(bytes / v).toFixed(2)} ${s}`  

        if (bytes <= 1048576)
            return str(2 ** 10, 'KiB')

        if (bytes <= 1073741824)
            return str(2 ** 20, 'MiB')
        
        return str(2 ** 30, 'GiB')
    }


    /**
     * @param arr Array to get the item from
     * @returns Random array <T> item
    */
    public static getRandomItemFromArray<T = any>(arr: T[]): T
    {
        const random: number = ~~(Math.random() * arr.length)

        return arr[random]
    }


    /**
     * @info Does not mutate the original array
     * @param array Array to shuffle 
     * @returns Shuffled array
    */
    public static shuffleArray<T = any>(array: T[]): T[]
    {
        const arrCopy: T[] = [...array]

        let currentIndex: number = arrCopy.length,
            randomIndex:  number

        while (currentIndex !== 0)
        {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--

            [arrCopy[currentIndex], arrCopy[randomIndex]] = 
            [arrCopy[randomIndex], arrCopy[currentIndex]]
        }

        return arrCopy
    }
}


export type {
    Aliases,
    FETCH,
    RB,
    LOAD,
    DD,
}