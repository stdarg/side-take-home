const debug = require('debug')('side:get_user')
const { lookupUser } = require('./db')

// Using a token, look the user up in the db
async function getUser (token) {
  if (!token || typeof (token) !== 'string' | token.length === 0) {
    return false
  }

  const user = await lookupUser(token)
  if (user && typeof (user) === 'object' && Object.prototype.hasOwnProperty.call(user, 'email')) {
    debug('getUser: Found user by token:', user)
    return user
  }

  return false // no user found
}


// The context pull the basic auth token from the headers and adds the user
// to the context which is available in the resolvers.
const context = async ({ req }) => {
  const token = (req.headers.authorization || '').split(' ')[1] || ''

  // try to retrieve a user with the token
  const user = await getUser(token)
  if (user) {
    return { user }
  }

  return { user: false } // no user was found
}

module.exports = { context }
