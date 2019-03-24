import mongoose from 'mongoose'

const Form = mongoose.Schema(
    {
        name: { type: String, required: true },
        structure: { type: Object, required: true }
    },
    {
        versionKey: false,
        collection: 'forms'
    }
)

export default mongoose.model('forms', Form)
