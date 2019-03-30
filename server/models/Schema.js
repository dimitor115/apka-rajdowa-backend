import mongoose from 'mongoose'

const Schema = mongoose.Schema(
    {
        name: { type: String, required: true },
        structure: { type: Object, required: true }
    },
    {
        versionKey: false,
        collection: 'schemas'
    }
)

export default mongoose.model('Schema', Schema)
