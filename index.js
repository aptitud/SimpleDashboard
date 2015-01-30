var Trello = require("./src/trello.js");

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.redirect("/public/index.html");
});

app.get("/consultants", function(request, response) {
  Trello.retrieveConsultants(function(consultants) {
    response.writeHead(200, {"Content-Type": "application/json", "Content-Encoding": "UTF-8"})
    response.end(JSON.stringify(consultants));
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
