const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { readFileSync } = require('fs')
const { connect_db } = require("./db")
const { resolvers } = require('./resolvers')
const { context } = require('./context')

const debug = require('debug')('side:app')
const typeDefs = gql(readFileSync('./type-defs.graphql').toString('utf-8'))

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
        debug(`Server ready at http://localhost:4000${server.graphqlPath}`)
    );
}

run_server()
