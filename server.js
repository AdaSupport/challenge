const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');
const _ = require('lodash');

const DB = firstTodos.map((t) => {
    return new Todo(t.id, t.title, t.status);
});

let dbUpdatedTimeStamp = Date.now();

server.on('connection', (client) => {

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', {db: DB, oldTS:null, currentTS: dbUpdatedTimeStamp, status: 'Add'});
    };

    // Accepts when a client makes a new todo
    client.on('service', (t) => {
        if(t.service == 'Add'){
            // Push this newly created todo to our database
            const newTodo = new Todo(undefined, title=t.record.title);
            DB.push(newTodo);
            let oldTS = dbUpdatedTimeStamp;
            dbUpdatedTimeStamp = Date.now();
            server.emit('load', {db: [newTodo], oldTS:oldTS, currentTS: dbUpdatedTimeStamp, status: 'Add'});
        }
        if(t.service == 'Delete'){
            _.forEach(t.records, function(eachRecord) {
                let index = _.findIndex(DB, function(o) { return o.id == eachRecord.id; });
                if(index > -1){
                    DB.splice(index, 1);
                }
            });
            let oldTS = dbUpdatedTimeStamp;
            dbUpdatedTimeStamp = Date.now();
            server.emit('load', {db: t.records, oldTS:oldTS, currentTS: dbUpdatedTimeStamp, status: 'Delete'});
        }
        if(t.service == 'Complete'){
            _.forEach(t.records, function(eachRecord) {
                let index = _.findIndex(DB, function(o) { return o.id == eachRecord.id; });
                if(index > -1){
                    DB[index].status = 'Completed';
                }
            });
            let oldTS = dbUpdatedTimeStamp;
            dbUpdatedTimeStamp = Date.now();
            server.emit('load', {db: t.records, oldTS:oldTS, currentTS: dbUpdatedTimeStamp, status: 'Complete'});
        }
    });

    reloadTodos();
});
server.listen(3003);
