import * as jwt from 'jsonwebtoken'

export const secret = process.env.JWT_SECRET || 'wpGu8AA234nnjks38fdt(7&54sd*(&*%T$#hkfjmcs'
const timeToLogOut = 3600 * 2 // the JWT tokens are valid for 2 hours

interface JwtPayload {
  id: string;
}

export const sign = (data: JwtPayload) =>
  jwt.sign(data, secret, { expiresIn: timeToLogOut })

export const verify = (token: string): JwtPayload =>
  jwt.verify(token, secret) as JwtPayload