const servers = require('./server/server');

servers.expressServer.listen(3000);

console.log('Waiting for clients to connect');


servers.socketIOServer.listen(3003);