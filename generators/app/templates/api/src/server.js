import api from './api.js'

const port = process.env.PORT || 3000

api.listen(port, (err) => {
  if (err) {
    return console.error('Failed', err)
  }
  console.log(`Listening on port ${port}`)
  return api
})
