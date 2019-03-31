import * as express from 'express'
import mongoose from 'mongoose'

import resultHandler from '../middlewares/resultHandler'

import { Schema } from '../models'
import { SchemasService } from '../services'

const router = express.Router()

router.post('/', resultHandler(req => SchemasService.create(req.body.name, req.body.schema)))
router.get('/:id/public', resultHandler(req => SchemasService.getPublic(req.params.id)))
router.get('/:id/private', resultHandler(req => SchemasService.getPrivate(req.params.id)))

router.get('/', (req, res) => {
    Schema.findOne({ _id: req.headers.form_id })
        .then(foundSchema => {
            const formSchema = mongoose.Schema(foundSchema.structure, {
                versionKey: false,
                collection: `form_${foundSchema.name}`
            })

            const formModel = mongoose.modelNames().includes(`form_${foundSchema.name}`)
                ? mongoose.model(`form_${foundSchema.name}`) : mongoose.model(`form_${foundSchema.name}`, formSchema)

            formModel.find({})
                .then(result => {
                    res.status(200).send(result)
                })
                .catch(err => {
                    res.status(500).send(err)
                })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

router.post('/', (req, res) => {
    Schema.findOne({ _id: req.headers.form_id })
        .then(foundSchema => {
            const formSchema = mongoose.Schema(foundSchema.structure, {
                versionKey: false,
                collection: `form_${foundSchema.name}`
            })

            const formModel = mongoose.modelNames().includes(`form_${foundSchema.name}`)
                ? mongoose.model(`form_${foundSchema.name}`) : mongoose.model(`form_${foundSchema.name}`, formSchema)

            formModel.create(req.body)
                .then(result => {
                    res.status(201).send(result)
                })
                .catch(err => {
                    res.status(500).send(err)
                })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

// router.get('/models', (req, res) => {
//     mongoose.connection.createCollection('test123')
//     .then(result => console.log('result', result))
//     .catch(err => console.log('err',err))
//     // mongoose.connection.collection('form_rajd_wiosenny').findOne({}, (err, result) => console.log(result))
//         // .then(result => console.log(result))
//     // console.log(mongoose.connection.collections.createCollections('blebleble'))
//     // res.send('')
// })


export default router
