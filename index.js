const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { readFileSync } = require('fs')
const { connect_db, lookup_user } = require("./db")
const { resolvers } = require('./resolvers.js')

const get_user_debug = require('debug')('side:get_user')
const context_debug = require('debug')('side:context')
const app_debug = require('debug')('side:app')

// set up type defs
const typeDefs = gql(readFileSync('./type-defs.graphql').toString('utf-8'))

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

async function run_server() {
    await connect_db()

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context,
        introspection: true,
        playground: true,
    });

    const app = express();
    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
        app_debug(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
}

run_server()
