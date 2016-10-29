'use strict';

const JsonServer = require('json-server');

const server = JsonServer.create();
const router = JsonServer.router('db.json');
const middlewares = JsonServer.defaults();

const port = process.env.PORT || 3000

server.use(middlewares);

var resetDate;
server.get('/resetDate', function (req, res) {
  res.jsonp(resetDate);
});

server.use(router);
server.listen(port, function () {
  console.log('Listening on port ' + port);
  resetDate = (new Date);
});