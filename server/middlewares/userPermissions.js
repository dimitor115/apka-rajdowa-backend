import { Event } from 'models'
import { byIdQuery } from 'common/utils'
import { USER_ROLE } from 'common/constants'

export default function (role = USER_ROLE.ADMIN) {
    return async (req, res, next) => {
        const { id } = req.params
        const userId = req.user._id
        const result = await Event.findOne(byIdQuery(id))
        if (result) {
            // eslint-disable-next-line no-unused-expressions
            result.administrators
                .some(
                    admin => admin.userId === userId.toString()
                        && (admin.role === role || admin.role === USER_ROLE.OWNER)
                )
                ? next()
                : res.status(403)
                    .send({ messages: ['You don\'t have permision to performe this operation on current event'] })
        } else {
            res.status(404)
                .send({ messages: [`There is no event with given id: ${id}`] })
        }
    }
}
