# test-smart-spaces
Automated tests for Smartspaces

Process to create new inquisitor device for a room
- Go to "things.octoblu.com" and select device to group together. At the moment, we need to add skype, light and room itself
  Click on "Group" on top left of the screen then give it a name. Naming convention is "Inquisitor-Test-room" then hit create.
- After created the inquisitor device, go to app.octoblu.com to look for the device and get the uuid
- Download meshblu-inquisitor project from github. Put meshblu.json credential from the user into the main directory of the project.
- Run command line 'coffe command.coffee -u (uuid of the inqusitor device here)'
- Go to interaction-monitor.octoblu.com/(uuid of the new inquisitor device here)/graph to check that the inquisitor created properly
- We can also add or remove device from the inquisitor device group from "things.octoblu.com" 
- Always update device's subscription using meshblu-inquisitor everytime you add or remove a additional device


    
##To Run all the tests specified in folder on all the rooms using test-runner:
```
‹test-schedule-meeting› »»»» node mocha-ssfc.js                                                                                                      0|19:38:22

  Usage: mocha-ssfc [options]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -r, --rooms <roomsDir>  Directory containing room configuration files, escape with 'x'
    -t, --tests <testDir>   Directory containing mocha tests, escape with 'x'
```
To debug the test runner:
```
env DEBUG=test-runner node mocha-ssfc.js -r ../config/ -t ../test >results.html
```

##To Run an individual test on a room directly using mocha:
- Make sure to have include meshblu.json of admin user inside room's config folder
- run command from /test/ folder: 
    -- For complete instant meeting: env ROOM=../config/<name of config folder for the room>/ mocha Test-Instant-Meeting.js
    -- For instant meeting without skype: env ROOM=../config/<name of config folder for the room>/ mocha Test-Instant-Meeting-without-skype.js
