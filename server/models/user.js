import mongoose from 'mongoose'

const User = mongoose.Schema(
  {
    login: { type: String, required: true }
  },
  {
    versionKey: false,
    collection: 'users'
  }
)

export default mongoose.model('User', User)
