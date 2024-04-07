import Router from 'koa-router'
import jwt from 'jsonwebtoken'
import config from '../../config/jwt.js'

const { JWTSecret, JWTAlgorithm } = config

/** @type {import('koa').Middleware} */
const isAuthenticated = async (ctx, next) => {
  const { token } = ctx.request
  if (!token) {
    ctx.status = 401
    return
  }

  const userInfo = jwt.verify(token, JWTSecret, {
    algorithm: JWTAlgorithm,
  })

  if (userInfo) {
    ctx.state.userInfo = userInfo
    await next()
  } else {
    ctx.status = 401
  }
}

const router = new Router()

router.use(isAuthenticated)

export { router as authenticationRouter }
