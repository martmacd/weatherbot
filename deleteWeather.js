const fs = require('fs');


//check viewers.json file for chatter and delete their record on a match result

const weatherDelete = (chatter) => {
    fs.readFile('viewers.json', 'utf8', function (err, contents) {
        contents = JSON.parse(contents);
        let matched = false;
        if (contents.length > 0) {
            for (record in contents) {
                if (((contents[record].viewer).toLowerCase()) === chatter.toLowerCase()) {
                    matched = true;
                    console.log(`Deleting ${contents[record].viewer} from position ${record} in database.`)
                    contents.splice([record], 1)
                    fs.writeFile('viewers.json', JSON.stringify(contents), function (err) {
                        if (err) throw err;
                        console.log('Deleted!');
                    })
                }
            }
        }

        if (!matched) {
            console.log(`No record found for ${chatter}.`)
        }
    });
}
module.exports = weatherDelete;