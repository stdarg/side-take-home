const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { lookup_user } = require("./db")
const { get_properties } = require("./simplyrets")

const AUTH_ON = false

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
    # This "Book" type defines the queryable fields for every book in our data source.
    type Property {
        area: Int
        bedrooms: Int
    }
    type Address {
        crossStreet: String
        state: String
        country: String
        postalCode: String
        streetName: String
        streetNumberText: String
        city: String
        streetNumber: Int
        full: String
        unit: String
    }
    type Listing {
        listingId: String
        favoriteCount: Int
        listPrice: Int
        property: Property
        address: Address
        disclaimer: String
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
        properties(city: String): [Listing]
    }
`;

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        properties: async (parent, args, context) => {
            console.log("Here 1", context, args.city)

            if (AUTH_ON && (!context || !context.user || !context.user.email)) {
                console.error("No user")
                return null
            }
            simplyrets = await get_properties([args.city])
            console.log("YYY", simplyrets)

            // listing = LISTINGS[0]
            listings = []
            for (const listing of simplyrets) {
                data = {}
                data.listingId = listing.listingId
                data.favoriteCount = 233
                data.listPrice = listing.listPrice
                data.property = {
                    area: listing.property.area,
                    bedrooms: listing.property.bedrooms
                }
                data.address = listing.address
                data.disclaimer = listing.disclaimer
                listings.push(data)
            }
            console.log("Here 2", listings)
            return listings
        }
    },
};


async function getUser(token) {
    console.log("getUser 1", token)
    if (!token || typeof(token) != "string" | token.length == 0) {
        console.log("getUser 2", token)
        return false
    }
    console.log("getUser 3", token)

    user = await lookup_user(token)
    console.log("XXX", user)
    if (user && typeof(user) == "object" && user.hasOwnProperty("email")) {
        console.log("getUser 4", token)
        return user
    }
    console.log("getUser 5", token)

    return false
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // Note! This example uses the `req` object to access headers,
    // but the arguments received by `context` vary by integration.
    // This means they will vary for Express, Koa, Lambda, etc.!
    //
    // To find out the correct arguments for a specific integration,
    // see the `context` option in the API reference for `apollo-server`:
    // https://www.apollographql.com/docs/apollo-server/api/apollo-server/

    // Get the user token from the headers.
    // console.log("header", req.headers)
    token = (req.headers.authorization || '').split(' ')[1] || ''
    if (token) {
        console.log("xxx token:", token)
    }

    // try to retrieve a user with the token
    const user = await getUser(token);
    if (user) {
        console.log("xxx User:", user)
        return { user };
    }
    return { user: false }
  }
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
