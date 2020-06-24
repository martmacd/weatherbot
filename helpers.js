// const findCity = require('./findCity');
const cityList = require('./city.list.json');
const reverseGeo = require('./reverseGeo');
const writeWeather = require('./writeWeather');
const express = require('express');
const app = express();
const port = 3002;
const cors = require('cors');
let locationReturns = null;

//Serve !check return to port 3002
app.use(cors());
app.get('/', (req, res) => res.send(
    `${JSON.stringify(locationReturns)}`
));
app.listen(port, () => console.log(`Check server listening on port ${port}!`));

//Convert from Celcius to Farenheit
const ctof = (temp) => {
    const convertedTemp = ((temp * (9 / 5)) + 32);
    return convertedTemp;
}

//Build list of reverse Geocoding returns for more specific location data based on lat/lon coordiantes
const cityCheck = async (location) => {
    locationReturns = [];
    if (isNaN(location)) {
        for (const city in cityList) {
            let currentCity = (cityList[city].name).toLowerCase();
            if (currentCity.includes(location.toLowerCase())) {
                let lat = cityList[city].coord.lat;
                let lon = cityList[city].coord.lon;
                let geoResult = await reverseGeo(lat, lon);
                locationReturns.push(`${cityList[city].id}: ${geoResult}, ${cityList[city].country} `);

            }
            if (locationReturns.length >= 20) {
                break;
            }
        }
    }
    else {
        for (const city in cityList) {
            if ((cityList[city].id).toString() === location) {
                let lat = cityList[city].coord.lat;
                let lon = cityList[city].coord.lon;
                let geoResult = await reverseGeo(lat, lon);
                locationReturns.push(`${cityList[city].id}: ${geoResult}, ${cityList[city].country} \n`);
            }
            if (locationReturns.length >= 20) {
                break;
            }
        }
    }
    return [location,locationReturns];
    // return `Matches for ${location} are ${locationReturns}`;
}

const weatherAdd = async (chatter, searchID) => {
    console.log(searchID);
    let addedLocation = "";
    let match = false;
    for (record in cityList) {
        if ((cityList[record].id).toString() === searchID) {
            addedLocation = `${cityList[record].name},${cityList[record].country}`;
            console.log(`${chatter} set their Weather location to ${addedLocation} with ID#${cityList[record].id}.`);
            match = true;
            return (writeWeather(chatter, searchID));
        }
    }

    if (match === false) {
        console.log(`${searchID} not found in city list. Please enter a valid locationID.`);
    }

}

module.exports.ctof = ctof;
module.exports.cityCheck = cityCheck;
module.exports.weatherAdd = weatherAdd;