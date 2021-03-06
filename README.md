﻿# weatherbot
Twitch.tv Weatherbot by martmacd

NB: this requires the following large file in the root diretory as a JSON file:

http://bulk.openweathermap.org/sample/city.list.json.gz

This piece of software runs in node and has 2 major components:

1. It activates in a chosen twitch channel (requires entries into the keys.json file) and listens for the following commands:

!add <username> <locationID>
  adds user to the viewers.json file with locationID
  
!join
  checks file for username who used command and adds them to queue if queue is open
  
!open
  opens a closed queue (MOD ONLY)
  
!close
  closes an open queue (MOD ONLY)
  
!clear
  clears the current queue (MOD ONLY)
  
!queue
  displays the current queue
  
!delete <username>
  removes a user from the file (MOD ONLY)
  
!check <string/zipcode>
  populates checkOverlay.html with weather stations and their IDs from specified area
  
!weathernow <string:location>
  logs current conditions and forecast H/L to the connected chat
  
!weather <optional: username>
  logs current conditions and forecast H/L to the connected chat for the user (username parameter MOD ONLY)
  
2. Renders forecasts for the locations in the weatherqueue in React on ./source/index.js

Thanks for checking it out!
