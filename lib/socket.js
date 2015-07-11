var render = require('./render');
var BrowserWindow = require('browser-window');
var rooms = {};

var Room = function(username, channel, network, element, window){
    var self = this;

    self.name = channel;

    self.owner = username;

    self.network = network;

    self.element = element;

    self.window = window;
};


var Socket = function(address, username, password){
    var socket = require('socket.io-client')(address);

    socket.on('connect', function(){
        global.event.emit('connection');
        socket.emit('identify', {'ident':username, 'pass':password});
    });

    socket.on('connect_error', function(err){
        console.log(err);
        global.event.emit('connection_error', err);
    });

    socket.on('connect_timeout', function(){
        global.event.emit('connection_error', 'timeout');
    });

    socket.on('reconnect', function(){
        global.event.emit('connection');
        socket.emit('identify', {'ident':username, 'pass':password});
    });

    socket.on('reconnect_failed', function(){
        global.event.emit('connection_error', 'reconnect_fail');
    });

    socket.on('disconnect', function(){
        global.event.emit('disconnect');
    });

    socket.on('room_join', function(room){
        rooms[room] = new Room(room);
    });

    socket.on('ident_confirm', function(result){
        global.event.emit('logged_in', result);
        global.windows['loading'].closeWindow();
        global.windows['main'] = new render.Render('index.html', new BrowserWindow({width: 800, height: 800, title:'Node-IRC-Client'}));
        global.windows['main'].window.openDevTools({detach: true});
        global.user = result;
    });

    socket.on('ident_error', function(result){
        global.event.emit('credentials_error');
    })
};

exports.Socket = Socket;