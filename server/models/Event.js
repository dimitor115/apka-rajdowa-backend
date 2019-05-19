import mongoose from 'mongoose'

const EventAdministrator = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['OWNER', 'ADMIN']
    }
})

const Event = mongoose.Schema(
    {
        administrators: [EventAdministrator],
        forms: Array,
        name: {
            type: String,
            required: true
        },
        emailAlias: {
            type: String,
            required: true,
            unique: true
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
        },
        slug: { type: String, slug: 'name', unique: true }
    },
    {
        versionKey: false,
        collection: 'events'
    }
)

export default mongoose.model('Event', Event)
