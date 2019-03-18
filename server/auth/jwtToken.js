import jwt from 'jsonwebtoken'

const createToken = user => jwt.sign(
  {
    sub: user.email,
    user: {
      email: user.email,
      googleId: user.googleId
    },
    iat: new Date().getTime(),
    expiresIn: process.env.EXP_TOKEN
  },
  process.env.PASSPORT_KEY
)

export default createToken
