const findWeather = require('./findWeather');
const testqueue = require('./src/testqueue');
let weatherQueue = require('./src/weatherQueue');
// let weatherQueue = testqueue;
const TwitchBot = require('twitch-bot');
const keys = require('./keys');
const weatherNow = require('./weatherNow');
const { cityCheck } = require('./helpers');
const { weatherAdd } = require('./helpers');
const weatherDelete = require('./deleteWeather');
const weather = require('./weather');
const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');
let weatherOpen = true;


//Serve weatherQueue to port 3001
app.use(cors());
app.get('/', (req, res) => res.send(`${JSON.stringify(weatherQueue)}`));
app.listen(port, () => console.log(`Weather queue server listening on port ${port}!`));

const Bot = new TwitchBot({
  username: 'mrmarmacbot',
  oauth: keys.botOauth,
  channels: ['mrmarmac']
})

Bot.on('join', channel => {
  //console.log(`Joined channel: ${channel}`)
  Bot.say('WeatherBot connected!')
})

Bot.on('error', err => {
  console.log(err)
})


//Separate command and parameter
Bot.on('message', async chatter => {
  let command = "";
  let parameter = "";
  if (chatter.message[0] === "!") {
    if (chatter.message.search(" ") === -1) {
      command = chatter.message;
    }
    else {
      command = chatter.message.slice(0, chatter.message.search(" "));
      parameter = chatter.message.slice((command.length) + 1);
    }
  }

  switch ((command).toLowerCase()) {
    case '!test':
      Bot.say('Command executed! PogChamp');
      break;

    case '!join':
      if (weatherOpen === false) {
        Bot.say('Weather queue currently closed.')
        break;
      }
      else {
        if (chatter.message.search(" ") === -1) {
          console.log(`Searching weather database for ${chatter.display_name}...`);
          let findResponse = await findWeather(chatter.display_name);
          Bot.say(findResponse);
        }
        else {
          if ((chatter.display_name === "MrMarmac") || (chatter.mod)) {
            console.log("MOD");
            let target = parameter.replace("@", "");
            let findResponse = await findWeather(target);
            Bot.say(findResponse);
          }
          else {
            Bot.say("Only mods can add other people to the queue.");
          }
        }
        break;
      }

    case '!open':
      if (weatherOpen) {
        Bot.say('Weather queue is already open!');
      } else {
        weatherOpen = true;
        Bot.say('Weather queue is now open! Type !joinweather to take part!');
      }
      break;

    case '!close':
      if (!weatherOpen) {
        Bot.say('Weather queue is already closed!');
      } else {
        weatherOpen = false;
        Bot.say('Weather queue is now closed! Look out for your forecast in the next news bulletin.');
      }
      break;

    case '!clear':
      while(weatherQueue.length > 0){
        weatherQueue.pop();
      }
      console.log(`Cleared the queue.`);
      Bot.say('Weather queue now clear.');
      break;

    case '!queue':
      let weatherQueueList = [];
      console.log(`Expected queue:`);
      for (let viewer in weatherQueue){
          console.log(weatherQueue[viewer].viewer);
      }
      for (let viewer of weatherQueue) {
        weatherQueueList.push(viewer.viewer);
        
      }
      let weatherQueueString = weatherQueueList.join(', ');
      weatherQueueList.length <= 0 ? Bot.say('Queue currently empty.') : Bot.say(`${weatherQueue.length} forecasts in queue: ${weatherQueueString}.`);
      break;

    case '!add':
      //Check for anything after !weatheradd  
      if (parameter.length === 0) {
        console.log('User must add location to argument');
      }
      //Check for parameter > 0 and mod or Marmac
      else if ((parameter.length > 0) && ((chatter.display_name === "MrMarmac") || (chatter.mod))) {
        //Check for more than 1 parameter (space in parameter)
        if (parameter.search(" ") !== -1) {
          //Separate parameter into target & location
          let target = parameter.slice(0, (parameter.search(" ")));
          target = target.replace("@", "");
          let location = parameter.slice(parameter.search(" ") + 1);

          //Check if location parameter is a number (no check on username)
          if (isNaN(location)) {
            Bot.say("Parameter must be a locationID. Use !check to get one. (mod only command)")
          }
          else {
            console.log(`Mod is adding ${target} for locationID ${location}`)
            await weatherAdd(target, location)
            .then((result) => {
              Bot.say(result);
            })
            .catch((err) => {
              console.log(err);
            });
            // weatherAdd(target, location);
          }
        }
        else {
          if (isNaN(parameter)) {
            Bot.say("Parameter must be a locationID. Use !check to get one. (mod only command)")
          }
          else {
            console.log("Mod is adding themselves with " + chatter.display_name + " " + parameter);
            weatherAdd(chatter.display_name, parameter);
          }
        }
      }
      else {
        if (isNaN(parameter)) {
          Bot.say("Parameter must be a locationID. Use !check to get one. (mod only command)")
        }
        else {
          weatherAdd(chatter.display_name, parameter);
          console.log("User is adding themselves with " + chatter.display_name + " " + parameter);
        }
      }
      break;

    case '!delete':
      if ((chatter.display_name === "MrMarmac") || (chatter.mod)) {
        if (parameter.length === 0) {
          console.log('Please target user to argument');
        }
        else {
          weatherDelete(parameter);
        }
      }
      break;

    case '!check':
      if ((chatter.display_name === "MrMarmac") || (chatter.mod)) {
        if (parameter.length === 0) {
          console.log('User must add location to argument');
        }
        else {
          let checkResponse = await cityCheck(parameter);
          console.log(`Results for ${checkResponse[0]}:`);
          for(let i=1; i<checkResponse[1].length; i++){
            console.log(checkResponse[1][i]);
          }
          //console.log(`${checkResponse}`);
          if (chatter.display_name !== 'MrMarmac') {
            Bot.say(`Hey MrMarmac! There's a new !check request from ${chatter.display_name}!`);
          };
        }
      }
      break;

    case '!weathernow':
      if (parameter.length === 0) {
        console.log('User must add location to argument');
      }
      else {
        weatherResponse = await weatherNow(parameter, chatter.display_name);
        Bot.say((weatherResponse));
      }
      break;

    case '!weather':
      if (parameter.length === 0) {
        weatherResponse = await weather(chatter.display_name);
        Bot.say((weatherResponse));
      }
      else {
        weatherResponse = await weather(parameter.replace("@", ""));
        if (weatherResponse !== "User not found in weather file.") {
          Bot.say(`${weatherResponse} Requested by ${chatter.display_name} BloodTrail`);
        }
        else {
          Bot.say(weatherResponse);
        }
      }
  }
})




module.exports = weatherOpen;