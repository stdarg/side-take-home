// index.js sets up the express server with ApolloServer middleware to handle
// the gql queries.

const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { readFileSync } = require('fs')
const { connectDb } = require('./db')
const { resolvers } = require('./resolvers')
const { context } = require('./context')

const debug = require('debug')('side:app')
const typeDefs = gql(readFileSync('./type-defs.graphql').toString('utf-8'))

async function runServer () {
  await connectDb() // conect to the mongo db, use async to wait until done

  // create an instance of ApolloServer to handle gql queries
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: true,
    playground: true
  })

  const app = express() // set up express
  server.applyMiddleware({ app }) // add ApolloServer as middle to express

  // listen for incoming requests on port 4000, display a message when ready
  app.listen({ port: 4000 }, () =>
    debug(`Server ready at http://localhost:4000${server.graphqlPath}`)
  )
}

runServer()
