const logEvents = require('./logEvents');

const EventEmmitter = require('events');

class MyEmitter extends EventEmmitter { };

const myEmitter = new MyEmitter();

myEmitter.on('log', (msg)=> logEvents(msg));

setTimeout(() => {
    myEmitter.emit('log','Log event emitted!');
}, 2000);
