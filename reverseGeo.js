const { ctof } = require('./helpers');

const reverseGeo = async (lat, lon) => {
    require('es6-promise').polyfill();
    require('isomorphic-fetch');
    const keys = require('./keys');
    let response = "";
    try {
        let geoResponse = null;
        response = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${keys.geoApi}&q=${lat}%2C${lon}&pretty=1&no_annotations=1`);
        const currentJson = await response.json();
        
        //Check whether geocode reponse has 'state' value.
        if(typeof currentJson.results[0].components.state === 'undefined'){
            geoResponse = (`${currentJson.results[0].components.county}`);
        }
        else{
            geoResponse = (`${currentJson.results[0].components.county}, ${currentJson.results[0].components.state}`);
        }
        return geoResponse;
    }
    catch (error) {
        console.log(error);
        return (`Something went wrong. Nice one, mate.`);
    }
}

module.exports = reverseGeo;