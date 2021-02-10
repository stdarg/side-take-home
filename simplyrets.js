
let simplyrets = require('@datafire/simplyrets').create({
    username: "simplyrets",
    password: "simplyrets"
});

async function get_properties(cities) {
    const res = await simplyrets.properties.get({cities: cities})
    return res
}

// get_properties(["Katy"]).catch(console.dir);

module.exports = {
    get_properties: get_properties
}
