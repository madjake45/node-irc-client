var app = require('app');
var BrowserWindow = require('browser-window');
var Menu = require('menu');
var Tray = require('tray');
var Dialog = require('dialog');
var EventEmitter = require('events').EventEmitter;

//<editor-fold desc="Render">

var Render = function(view, window, hidden){
    var self = this;

    self.window = window;

    self.view = view;

    if(hidden){
        self.window.hide();
    }

    self.loadView(self.view);

    self.window.setMenu(null);

    self.window.on('focus', function(){
        self.active = true;
    });

    self.window.on('blur', function(){
        self.active = false;
    });

    self.window.on('close', function(){
        self.window.hide();
        self.visible = false;
    });
};

Render.prototype.hideTask = function(val){
    this.window.setSkipTaskbar(val);
};

Render.prototype.loadView = function(view){
    console.log(__dirname);
    this.window.loadUrl('file://'+ __dirname +'/../html/' + view);
    this.view = view;
};

Render.prototype.hideWindow = function(){
    if(this.visible == false){
        this.window.hide();
    }
    this.visible = false;
};

Render.prototype.showWindow = function(){
    if(this.visible == true){
        this.window.show();
    }
    this.visible = true;
};

Render.prototype.minimize = function(){
    this.window.minimize();
};

Render.prototype.restore = function(){
    this.window.restore();
};

Render.prototype.focus = function(){
    this.window.focus();
};

Render.prototype.isVisible = function(){
    return this.window.isVisible();
};

Render.prototype.isActive = function(){
    return this.active;
};

Render.prototype.closeWindow = function(){
    this.window.close();
};

exports.Render = Render;

//</editor-fold>

//<editor-fold desc="Notification">
var Notification = function(title, text, window){
    if(!global.windows[window].isActive()){

    }
};
//</editor-fold>

//<editor-fold desc="Tray">

app.on('ready', function(){
    var appIcon = new Tray('./img/logo.png');
    var contextMenu = Menu.buildFromTemplate([
        {label: 'Connect', type:'radio'},
        {label: 'Disconnect', type:'radio'},
        {label: 'Do Not Disturb', type:'radio', checked:global.Config['settings']['do_not_disturb']}
    ]);
    appIcon.setContextMenu(contextMenu);
});

//</editor-fold>