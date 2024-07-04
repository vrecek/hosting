export default interface FileSchema
{
    ownerID: string
    items:   FileItems[]
}

export interface FileItems
{
    secretName: string
}