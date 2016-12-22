var request = require('request');

request.GET('')

request('http://www.google.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
})

request({
  url: "https://triggers.octoblu.com/v2/flows/f0e859b8-17e2-4dee-87fe-e71f733cc1d0/triggers/9c516ba1-c251-11e6-8ac8-5588f11c4255",
  method: "POST",
  json: true,
  headers: {
    "content-type": "application/json",
},


request({

})
