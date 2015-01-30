var Trello = require("./src/trello.js");

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.redirect("/public/index.html");
});

app.get("/consultants", function(request, response) {
  var getConsultants = function(callback) {
    if (this.__cache && Date.now() - this.__cacheDate > 5 * 60 * 1000) {
      delete this.__cache;
    }

    if (this.__cache) {
      callback(this.__cache);
    } else {
      var self = this;

      Trello.retrieveConsultants(function(consultants) {
        self.__cache = consultants;
        self.__cacheDate = Date.now();

        callback(consultants);
      });
    }
  };

  getConsultants(function(consultants) {
    response.writeHead(200, {"Content-Type": "application/json; charset=utf-8", "Content-Encoding": "utf-8"})
    response.end(JSON.stringify(consultants));
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
