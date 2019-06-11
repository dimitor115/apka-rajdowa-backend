import { User } from '../../models'
import { USER_ROLE } from '../constants'

export { default as Response } from './Response'
export { default as Exception } from './Exception'

export function isObjectID(text) {
    const regex = new RegExp('^[0-9a-fA-F]{24}$')
    return regex.test(text)
}

export function byIdQuery(id) {
    return isObjectID(id)
        ? { _id: id }
        : { slug: id }
}

export function mapEmailsToUsers(users, messages) {
    return users.map(async email => {
        const result = await User.findOne({ 'google.email': email })
        if (result) {
            return { userId: result._id, role: USER_ROLE.ADMIN, email }
        } else {
            messages.push(`Użytkownik ${email} będzie miał dostęp do wydarzenia po pierwszym logowaniu.
                 Nie mamy go jeszcze w systemie`)
            // This email will be replace by user id after user first login
            return { userId: email, role: USER_ROLE.ADMIN, email }
        }
    })
}
