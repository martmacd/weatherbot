const { ctof } = require('./helpers');
require('es6-promise').polyfill();
require('isomorphic-fetch');
const keys = require('./keys');
const fs = require('fs');

const weather = async (chatter) => {
    let match = false;
    let viewerFile = readFileBody();
    let parsedFile = JSON.parse(viewerFile);

    if (parsedFile.length > 0) {
        for (let record in parsedFile) {
            if (parsedFile.hasOwnProperty(record)) {
                if (((parsedFile[record].viewer).toLowerCase()) === chatter.toLowerCase()) {
                    match = true;
                    location = parsedFile[record].id;
                    return await processMatch(match, chatter, location);
                }
            }
        }
        if (!match) {
            return "User not found in weather file.";
        }
    }
};

function readFileBody() {
    return fs.readFileSync('viewers.json', 'utf8');
}

async function processMatch(match, chatter, location) {
    let response = "";
    try {
        response = await fetch(`http://api.openweathermap.org/data/2.5/weather?id=${encodeURIComponent(location)}&APPID=${keys.weatherApi}&units=metric`);
        const currentJson = await response.json();
        if (currentJson.sys.country === "US") {
            const metric = "F";
            return await (`Current weather for ${currentJson.name}, ${currentJson.sys.country}: ${ctof(currentJson.main.temp).toFixed(2)}${metric}. Forecast low/high: ${ctof(currentJson.main.temp_min).toFixed(2)}${metric}/${ctof(currentJson.main.temp_max).toFixed(2)}${metric}. Conditions: ${currentJson.weather[0].main}.`);
        } else {
            const metric = "C";
            return await (`Current weather for ${currentJson.name}, ${currentJson.sys.country}: ${currentJson.main.temp}${metric}. Forecast low/high: ${currentJson.main.temp_min}${metric}/${currentJson.main.temp_max}${metric}. Conditions: ${currentJson.weather[0].main}.`);
        }
    } catch (error) {
        console.log(error);
        return (`Error calling API.`);
    }
}

module.exports = weather;