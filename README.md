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
