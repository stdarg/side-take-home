const getUserDebug = require('debug')('side:get_user')
const contextDebug = require('debug')('side:context')
const { lookupUser } = require('./db')

async function getUser (token) {
  if (!token || typeof (token) !== 'string' | token.length === 0) {
    return false
  }
  getUserDebug('get_user 3', token)

  const user = await lookupUser(token)
  getUserDebug('XXX', user)
  if (user && typeof (user) === 'object' && Object.prototype.hasOwnProperty.call(user, 'email')) {
    getUserDebug('get_user 4', token)
    return user
  }
  getUserDebug('get_user 5', token)

  return false
}

const context = async ({ req }) => {
  const token = (req.headers.authorization || '').split(' ')[1] || ''
  if (token) {
    contextDebug('xxx token:', token)
  }

  // try to retrieve a user with the token
  const user = await getUser(token)
  if (user) {
    contextDebug('xxx User:', user)
    return { user }
  }
  return { user: false }
}

module.exports = {
  context
}
