// Here, we implement the ApolloServer resolvers for the query and the mutation

const env = require('env-var')
const debug = require('debug')('side:resolver')
const { getProperties } = require('./simplyrets')
const { getFavoriteCount, incFavoriteCount } = require('./db')

const AUTH_ON = env.get('AUTH_ON').required().asBool()
debug(`AUTH_ON is ${AUTH_ON}`)

const resolvers = {
  Query: {
    properties: async (parent, { city }, context) => {
      if (AUTH_ON && (!context || !context.user || !context.user.email)) {
        debug('No user found on query properties')
        return null
      }

      const simplyrets = await getProperties(city)
      const listings = []

      for (const listing of simplyrets) {
        const data = {}
        data.listingId = listing.listingId
        data.favoriteCount = await getFavoriteCount(listing.listingId)
        data.listPrice = listing.listPrice
        data.property = {
          area: listing.property.area,
          bedrooms: listing.property.bedrooms
        }
        data.address = listing.address
        data.disclaimer = listing.disclaimer
        listings.push(data)
      }

      return listings
    }
  },
  Mutation: {
    favorite: async (_, { listingId }, context) => {
      if (AUTH_ON && (!context || !context.user || !context.user.email)) {
        debug('No user found on mutation favorite')
        return null
      }

      debug('before mutation', listingId, await getFavoriteCount(listingId))
      const doc = await incFavoriteCount(listingId)
      debug('after mutation', doc)
      return doc
    }
  }
}

module.exports = { resolvers }
