// Use the simplyrets npm module to makes requests of the SimplyRETS API.
//
const debug = require('debug')('simplyrets')
const is2 = require('is2')
const env = require('env-var')

const simplyrets = require('@datafire/simplyrets').create({
  username: env.get('SIMPLY_RETS_USER').required().asString(),
  password: env.get('SIMPLY_RETS_PASSWD').required().asString()
})


async function getProperties (city) {
  const res = await simplyrets.properties.get({ cities: [city] })
  if (!is2.array(res)) {
    debug('received unexpected type from SimplyRETS API:', typeof (res))
    return []
  }
  return res
}


module.exports = {
  getProperties
}
