const Trello = require("./src/trello.js"),
      express = require('express'),
      app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/client/public'));

app.get('/assignments', async (request, response) => {
    const trelloData = await Trello.getTrelloData();

    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8', 'Content-Encoding': 'utf-8'})
    response.end(JSON.stringify(trelloData));
});

app.listen(app.get('port'), function () {
    console.log(`Node app is running at localhost: ${app.get('port')}`);
});
