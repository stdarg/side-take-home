const get_user_debug = require('debug')('side:get_user')
const context_debug = require('debug')('side:context')
const { lookup_user } = require("./db")

async function get_user(token) {
    if (!token || typeof(token) != "string" | token.length == 0) {
        return false
    }
    get_user_debug("get_user 3", token)

    const user = await lookup_user(token)
    get_user_debug("XXX", user)
    if (user && typeof(user) == "object" && Object.prototype.hasOwnProperty.call(user, "email")) {
        get_user_debug("get_user 4", token)
        return user
    }
    get_user_debug("get_user 5", token)

    return false
}

const context = async ({ req }) => {
    const token = (req.headers.authorization || '').split(' ')[1] || ''
    if (token) {
        context_debug("xxx token:", token)
    }

    // try to retrieve a user with the token
    const user = await get_user(token);
    if (user) {
        context_debug("xxx User:", user)
        return { user };
    }
    return { user: false }
}

module.exports = {
    context,
}
