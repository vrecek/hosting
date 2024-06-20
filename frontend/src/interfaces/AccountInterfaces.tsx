export interface IPasswordInputs 
{
    onlyOne?: boolean
}

export interface ICheckboxInput
{
    label:  string
    id:     string
    cname?: string
}

export type CredentialsBody = (ele: HTMLInputElement[]) => any