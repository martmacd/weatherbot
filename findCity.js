const findCity = (location) => {
    let city = "";
    let country = "";

    if (location.indexOf(",") === -1) {
        location = location.trim();
        console.log(`Searching for ${location}.`);
        return `Searching for ${location}.`;   
    } else {
        city = location.slice(0, (location.indexOf(",")));
        city = city.trim();
        country = location.slice((city.length + 1));
        country = country.trim();
        console.log(`City: ${city}. Country: ${country}`);
        return `City: ${city}. Country: ${country}`;
    }
}
module.exports = findCity;