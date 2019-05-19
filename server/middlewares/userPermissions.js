import { Event } from 'models'
import { byIdQuery } from 'common/utils'

export default function (role = 'ADMIN') {
    return async (req, res, next) => {
        const { id } = req.params
        const userId = req.user._id
        const result = await Event.findOne(byIdQuery(id))
        if (result) {
            /* eslint-disable */
            result.administrators
                .some(admin => admin.userId === userId.toString() && (admin.role === role || admin.role === 'OWNER'))
                ? next()
                : res.status(403)
                    .send({ messages: ['Nie masz uprawnień do wykonania tej operacji na tym wydarzeniu'] })
        } else {
            res.status(404)
                .send({ messages: [`Nie ma w systemie wydarzenia o id: ${id}`] })
        }
    }
}
