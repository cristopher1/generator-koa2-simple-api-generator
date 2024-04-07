import Router from 'koa-router'
import jwt from 'jsonwebtoken'
import config from '../../config/jwt.js'

const { JWTSecret, JWTAlgorithm } = config

// Example function. Remove or replace for the real function to get user info.
const getUserInfo = async (email, password) => {
  const userInfo = {
    email,
    password,
  }
  return userInfo
}

/** @type {import('koa').Middleware} */
const obtainToken = async (ctx) => {
  const { email, password } = ctx.request.body
  const userInfo = await getUserInfo(email, password)
  const token = jwt.sign(userInfo, JWTSecret, { algorithm: JWTAlgorithm })
  ctx.status = 200
  ctx.body = {
    token,
  }
}

const router = new Router()

router.post('/', obtainToken)

export { router as tokenRouter }
