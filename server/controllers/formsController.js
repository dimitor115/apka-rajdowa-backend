import * as express from 'express'
import mongoose from 'mongoose'
// import resultHandler from '../middlewares/resultHandler'
// import examplesService from '../services/ExamplesService'
import { Form } from '../models'

const router = express.Router()

router.post('/schemas', (req, res) => {
    // const formSchema = mongoose.Schema(req.body.structure, {
    //     versionKey: false,
    //     collection: `form_${req.body.name}`
    // })
    // const formsModel = mongoose.model(`form_${req.body.name}`, formSchema)

    // formsModel.create({
    //     name: 'Marek',
    //     phone: 505380563,
    //     index: '238481',
    //     isPaid: ["oplacone", "weryfikacja"],
    //     status: 'test2'
    // })
    // .then(result => console.log('result', result))
    // .catch(err=> console.log('err', err))

    Form.create(req.body)
        .then(newSchema => {
            mongoose.connection.createCollection(`form_${newSchema._id}`)
                .then(() => {
                    res.status(200).send({ id: newSchema._id })
                })
        })
        .catch(err => {
            res.status(500).send(err)
        })


})

router.get('/schemas/:id', (req, res) => {
    Form.findOne({ _id: req.params.id })
        .then(result => {
            res.status(200).send(result)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

router.get('/', (req, res) => {
    Form.findOne({ _id: req.headers.form_id })
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
    Form.findOne({ _id: req.headers.form_id })
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
