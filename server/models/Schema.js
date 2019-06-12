import mongoose from 'mongoose'

const Schema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        colors: {
            primary: { type: String },
            background: { type: String }
        },
        structure: { type: Object, required: true },
        slug: {
            type: String,
            slug: 'name',
            unique: true
        }
    },
    {
        versionKey: false,
        collection: 'schemas'
    }
)

export default mongoose.model('Schema', Schema)
