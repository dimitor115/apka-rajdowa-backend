import jwt from 'jsonwebtoken'

const createToken = user => jwt.sign(
  {
    sub: user._id,
    user: {
      id: user._id,
      email: user.google.email,
      googleId: user.google.googleId
    },
    iat: new Date().getTime(),
    expiresIn: process.env.EXP_TOKEN
  },
  process.env.PASSPORT_KEY
)

export default createToken
