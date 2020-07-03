const Trello = require("./src/trello.js"),
    express = require('express'),
    cors = require('cors'),
    app = express();

let trelloData = null,
    trelloDataTimeStamp = null;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/client/public'));
app.use(cors());

app.get('/assignments', async (request, response) => {
    if (!trelloDataTimeStamp || (Date.now() > trelloDataTimeStamp + 300000)) {
        trelloData = await Trello.getTrelloData();
        trelloDataTimeStamp = Date.now();
    }
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Encoding': 'utf-8' })
    response.end(JSON.stringify(trelloData));
});

app.get('/resetcache', async (request, response) => {
    trelloDataTimeStamp = null;
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Encoding': 'utf-8' })
    response.end('cache reset');
});

app.listen(app.get('port'), function () {
    console.log(`Node app is running at localhost: ${app.get('port')}`);
});
