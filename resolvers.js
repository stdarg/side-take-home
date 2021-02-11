const env = require('env-var')
const debug = require('debug')('side:resolver')
const { get_properties } = require("./simplyrets")

const AUTH_ON = env.get('AUTH_ON').default("true").asBool()
debug(`AUTH_ON is ${AUTH_ON}`)

const resolvers = {
    Query: {
        properties: async (parent, args, context) => {
            debug("Here 1", context, args.city)

            if (AUTH_ON && (!context || !context.user || !context.user.email)) {
                debug("No user")
                return null
            }
            const simplyrets = await get_properties([args.city])
            debug("YYY", simplyrets)

            const listings = []
            for (const listing of simplyrets) {
                const data = {}
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
            debug("Here 2", listings)
            return listings
        }
    },
    Mutation: {
        favorite: async (_, { listingId }) => {
            debug("Mutation", listingId)
            return {
                listingId: listingId,
                count: 1234
            }
        }
    }
}

module.exports = { resolvers }

