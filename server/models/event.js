import mongoose from 'mongoose'

const Event = mongoose.Schema(
    {
        organisationId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        emailAlias: {
            type: String,
            required: true,
            unique: true // TODO: read how it works
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        logo: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        collection: 'events'
    }
)

export default mongoose.model('Event', Event)
