const { ctof } = require('./helpers');
require('es6-promise').polyfill();
require('isomorphic-fetch');
const keys = require('./keys');
const weatherNow = async (location, chatter) => {
    let response = "";
    try {
        if ((isNaN(location) === true) || (isNaN(location) === false) && (location.length === 5)) {
            console.log(location);
            console.log("Text or Zipcode detected");
            response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&APPID=${keys.weatherApi}&units=metric`);
        }
        else {
            console.log("ID Detected");
            response = await fetch(`http://api.openweathermap.org/data/2.5/weather?id=${encodeURIComponent(location)}&APPID=${keys.weatherApi}&units=metric`);
        }
        const currentJson = await response.json();
        if (currentJson.sys.country == "US") {
            const metric = "F";
            return (`Current weather for ${currentJson.name}, ${currentJson.sys.country}: ${ctof(currentJson.main.temp).toFixed(2)}${metric}. Forecast low/high: ${ctof(currentJson.main.temp_min).toFixed(2)}${metric}/${ctof(currentJson.main.temp_max).toFixed(2)}${metric}. Conditions: ${currentJson.weather[0].description}. Requested by ${chatter} BloodTrail`);
        }
        else {
            const metric = "C";
            return (`Current weather for ${currentJson.name}, ${currentJson.sys.country}: ${currentJson.main.temp}${metric}. Forecast low/high: ${currentJson.main.temp_min}${metric}/${currentJson.main.temp_max}${metric}. Conditions: ${currentJson.weather[0].description}. Requested by ${chatter} BloodTrail`);
        }
    }
    catch (error) {
        console.log(error);
        return (`Invalid input. Please enter in the following format: "london,GB" or "hamilton,nz" etc.`);
    }
}

module.exports = weatherNow;