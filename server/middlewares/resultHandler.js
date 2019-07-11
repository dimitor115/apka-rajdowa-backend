import log from 'common/logger'
import { Response, Exception } from 'common/utils'

// This is simple result handler and will be extend in future
export default function (func) {
    return async (req, res) => {
        try {
            const result = await func(req, res)
            if (result instanceof Response) {
                const { httpCode, data, messages } = result
                res.status(httpCode)
                    .json({ data, messages })
            } else {
                res.json(result)
            }
        } catch (error) {
            log.error(error)
            if (error instanceof Exception) {
                error.messages.forEach(msg => log.error(msg))
                res.status(error.httpCode)
                    .send({
                        messages: error.messages
                    })
            } else if (Object.prototype.hasOwnProperty.call(error, 'name') && error.name === 'ValidationError') {
                res.status(400)
                    .send({
                        messages: [error.message]
                    })
            } else {
                res.status(500)
                    .send({
                        messages: [error.message || '']
                    })
            }
        }
    }
}
