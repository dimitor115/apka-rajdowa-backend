import jwt from 'jsonwebtoken'

export default user => jwt.sign(
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
