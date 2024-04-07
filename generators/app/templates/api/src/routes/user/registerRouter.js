import Router from 'koa-router'

const router = new Router()

// Example function. Remove or replace for a function that creates a user.
const createUser = async (user) => {
  if (!user) {
    throw new Error('There is not user')
  }
  return true
}

router.post('/', async (ctx) => {
  const { user } = ctx.state

  await createUser(user)

  ctx.status = 201
})

export { router as registerRouter }
