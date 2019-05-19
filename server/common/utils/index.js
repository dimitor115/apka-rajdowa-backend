export { default as Response } from './Response'
export { default as Exception } from './Exception'

export function isObjectID(text) {
    const regex = new RegExp('^[0-9a-fA-F]{24}$')
    return regex.test(text)
}
