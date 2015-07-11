var app = require('app');
var BrowserWindow = require('browser-window');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var render = require('./lib/render.js');
global.event = new EventEmitter();
global.event.client = new EventEmitter();
global.event.main = new EventEmitter();
if(fs.existsSync('./config.json')){
    global.Config = require('./config.json');
}
else{
    global.Config = {};
}
if(!global.Config['connection']['ip']){
    var setup = require('./lib/setup.js').Setup;
}
else{
    var socket = require('./lib/socket.js').Socket;
}

// Report crashes to our server.
require('crash-reporter').start();

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    global.windows = {};
    global.windows['loading'] = new render.Render('loading.html', new BrowserWindow({width: 500, height: 250, resizable: false, frame: false, title: 'Node-IRC-Client', type: 'splash'}));
    global.windows['error'] = new render.Render('error.html', new BrowserWindow({width: 500, height: 600, resizable: false, center: true, 'skip-taskbar': true, frame: true, title: 'Node-IRC-Client - Error'}), true);
    //global.windows['main'] = new render.Render('index.html', new BrowserWindow({width: 800, height: 800}));
    if(setup){
        setup(global.Config);
    }
    else{
        console.log('SOCKETS!');
        global.Socket = new socket('http://'+ global.Config['connection']['ip'] + ':' + global.Config['connection']['port'], global.Config['connection']['username'], global.Config['connection']['password']);
    }
});