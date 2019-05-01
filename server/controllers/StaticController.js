import * as express from 'express'
import fs from 'fs'
import logger from '../common/logger'

const router = express.Router()
const uploadDir = process.env.UPLOAD_DIR || 'public/uploads'
/*
 This logic isn't extracted to dedicated service because of specific need to use result object
  */
router.get('/img/:id', (req, res) => {
    const path = `${uploadDir}/${req.params.id}`
    res.setHeader('Content-Type', 'png')
    fs.promises.access(path)
        .then(() => fs.createReadStream(path).pipe(res))
        .catch(error => {
            logger.warn(error)
            // this is only development useful solution and has to be remove before release
            fs.createReadStream(`${uploadDir}/logo-default.png`).pipe(res)
        })
})

export default router
