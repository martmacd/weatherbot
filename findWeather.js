let weatherQueue = require('./src/weatherQueue');
const fs = require('fs');

const findWeather = async (chatter) => {
    try {
        //Check viewers.json for match and add to weatherQueue
        let contents = readFileBody();
        let contentsJson = JSON.parse(contents) || [];

        // Find the record for the chatter
        const record = findRecord(contentsJson, chatter);
        if(! record) {
            return `No match found for ${chatter} in database. Let MrMarmac or a mod know where you're from!`;
        }

        // Check if chatter is in queue
        if(findRecord(weatherQueue, chatter)) {
            return `${chatter} is already in the queue.`;
        }

        weatherQueue.push(record);
        console.log(`Added ${chatter} to the queue.`);
        console.log(`New queue:`);
        for (let viewer in weatherQueue){
            console.log(weatherQueue[viewer].viewer);
        }
        
        return `Added ${record.viewer} to the queue.`;
    }
    catch (err) {
        console.log(err);
    }
}

function findRecord(records, chatter) {
    chatter = chatter.toLowerCase();

    for(const record of records) {
        if(record.viewer.toLowerCase() === chatter) {
            return record;
        }
    }

    return null;
}

function readFileBody() {
    return fs.readFileSync('viewers.json', 'utf8');
}

module.exports = findWeather;