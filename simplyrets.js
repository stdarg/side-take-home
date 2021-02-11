const debug = require('debug')('simplyrets')
const is2 = require('is2')
const simplyrets = require('@datafire/simplyrets').create({
  username: 'simplyrets',
  password: 'simplyrets'
})

async function getProperties (cities) {
  const res = await simplyrets.properties.get({ cities: cities })
  if (!is2.array(res)) {
    debug('received unexpected type:', typeof (res))
    return []
  }
  return res
}

module.exports = {
  getProperties
}
