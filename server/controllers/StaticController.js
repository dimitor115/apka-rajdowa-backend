import * as express from 'express'
import fs from 'fs'
import path from 'path'

const router = express.Router()

router.get('/img/:id', (req, res) => {
    res.setHeader('Content-Type', 'png')
    fs.createReadStream(path.join('public/uploads/', req.params.id)).pipe(res)
})

export default router
