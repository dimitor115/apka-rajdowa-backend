import log from 'common/logger'
import Response from 'common/utils/Response'
import Exception from 'common/utils/Exception'

// This is simple result handler and will be extend in future
export default function (func) {
    return async (req, res) => {
        try {
            const result = await func(req, res)
            if (result instanceof Response) {
                res.status(result.httpCode)
                    .json({
                        data: result.data,
                        messages: result.messages
                    })
            } else {
                res.json(result)
            }
        } catch (error) {
            log.error(error)
            console.log('chuj')
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
