const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeWeather = async (chatter, locationId) => {
    console.log(`${chatter} has ID ${locationId}.`);
    let contents = await readFile('viewers.json', 'utf8');
    contents = JSON.parse(contents);
    let matched = false;

    if (contents.length > 0) {
        for (record in contents) {
            if (((contents[record].viewer).toLowerCase()) === chatter.toLowerCase()) {
                matched = true;
            }
        }
    }

    if (matched) {
        // console.log(`Record already exists for ${chatter}`);
        return(`Record already exists for ${chatter}`);
    }
    else {
        contents.push({ viewer: chatter, id: locationId });
        const writeFile = util.promisify(fs.writeFile);
        await writeFile('viewers.json', JSON.stringify(contents));
        console.log('Saved!');
        return (`Added ${chatter} to file with ID ${locationId}.`)
    };

}
module.exports = writeWeather;