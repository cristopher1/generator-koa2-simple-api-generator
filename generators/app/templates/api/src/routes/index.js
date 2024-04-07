import Router from 'koa-router'
import { tokenRouter } from './authentication/tokenRouter.js'
import { authenticationRouter } from './authentication/authenticationRouter.js'
import { registerRouter } from './user/registerRouter.js'
import { userRouter } from './user/router.js'

const router = new Router({
  prefix: '/api/v1',
})

router.use('/users/register', registerRouter.routes())
router.use('/tokens', tokenRouter.routes())
router.use(authenticationRouter.routes())
router.use('/users', userRouter.routes())

export { router as apiRouter }
