'use strict';

const Express = require('express');
const app = Express();
app.use(Express.static('client'));

app.get('/', function (req, res) {
  const indexPath = __dirname + '/client/index.html';
  res.sendFile(indexPath);
});

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Listening on port ' + port);
});