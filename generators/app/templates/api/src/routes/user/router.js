import Router from 'koa-router'

const router = new Router()

// Example function. Remove or replace for a function that obtains user information.
const getUserInfoByEmail = async (email) => {
  const user = {
    email,
    names: 'default user',
    surnames: 'default user',
  }
  return user
}

// Example function. Remove or replace for a function that update data user.
const updateUser = async (email, newUserData) => {
  if (!email) {
    throw new Error('There is not email')
  }
  if (!newUserData) {
    throw new Error('There is not new user data')
  }
  return true
}

router.get('/:userEmail', async (ctx) => {
  const { userEmail } = ctx.params

  const user = await getUserInfoByEmail(userEmail)

  if (!user) {
    ctx.status = 404
    return
  }

  const { email, names, surnames } = user

  ctx.status = 200
  ctx.body = {
    email,
    names,
    surnames,
  }
})

router.put('/', async (ctx) => {
  const { email } = ctx.state.userInfo
  const newUserData = ctx.request.body

  const user = await getUserInfoByEmail(email)

  if (!user) {
    ctx.status = 404
    return
  }

  await updateUser(email, newUserData)

  ctx.status = 201
})

export { router as userRouter }
