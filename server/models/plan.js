 import mongoose from 'mongoose'

const Plan = mongoose.Schema(
  {
    login: { type: String, required: true }
  },
  {
    versionKey: false,
    collection: 'plans'
  }
)

export default mongoose.model('Plan', Plan)
