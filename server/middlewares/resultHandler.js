import log from '../common/logger'
import Response from '../common/utils/Response'
import Exception from '../common/utils/Exception'

// This is simple result handler and will be extend in future
export default function (func) {
  return (req, res) => func(req, res)
    .then(result => {
      if (result instanceof Response) {
        res.status(result.httpCode)
          .json({
            body: result.body,
            messages: result.messages
          })
      } else {
        res.json(result)
      }
    })
    .catch(error => {
      if (error instanceof Exception) {
        error.messages.forEach(msg => log.error(msg))
        res.status(error.httpCode)
          .send({
            messages: error.messages
          })
      } else {
        log.error(error)
        res.status(500)
          .send(error)
      }
    })
}
