import mongoose from 'mongoose'

const User = mongoose.Schema(
  {
    google: {
      email: { type: String, required: true },
      googleId: { type: String, required: true },
      displayName: { type: String, required: true },
      photoUrl: { type: String, required: false },
      gender: { type: String, required: false }
    }
  },
  {
    versionKey: false,
    collection: 'users'
  }
)

export default mongoose.model('User', User)
