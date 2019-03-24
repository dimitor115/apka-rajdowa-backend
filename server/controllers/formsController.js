import * as express from 'express'
import mongoose from 'mongoose'
// import resultHandler from '../middlewares/resultHandler'
// import examplesService from '../services/ExamplesService'
import { Form } from '../models'

const router = express.Router()

// router.get('/', resultHandler(() => examplesService.all()))
// router.get('/:id', resultHandler(req => examplesService.byId(req.params.id)))
// router.post('/', resultHandler(req => examplesService.create(req.body.name)))

router.post('/', (req, res) => {
    const formSchema = mongoose.Schema(req.body.structure, {
        versionKey: false,
        collection: `form_${req.body.name}`
    })
    const formsModel = mongoose.model(`form_${req.body.name}`, formSchema)

    formsModel.create({
        name: 'Marek',
        phone: 505380563,
        index: '238481'
    })

    Form.create(req.body)
        .then(result => {
            console.log(result)
            res.status(200).send('Udalo sie')
        })
        .catch(err => {
            console.log(err)
            res.status(500).send('Cos sie zjebalo')
        })
})

router.get('/id/:name', (req, res) => {
    Form.findOne({ name: req.params.name })
        .then(result => {
            const formSchema = mongoose.Schema(result.structure, {
                versionKey: false,
                collection: `form_${result.name}`
            })

            const formsModel = mongoose.model(`form_${result.name}`, formSchema)

            formsModel.find({})
                .then(result => {
                    res.status(200).send(result)
                })
                .catch(err => {
                    res.status(500).send(err)
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).send('Cos sie zjebalo')
        })
})

router.get('/models', (req, res) => {
    mongoose.connection.createCollection('test123')
    // console.log(mongoose.connection.collections.createCollections('blebleble'))
    res.send('')
})

router.get('/', (req, res) => {
    Form.findOne({ _id: '5c96ba68d4259d57344a46f0' })
        .then(result => {
            res.status(200).send(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send('Cos sie zjebalo')
        })
})

export default router
