

var Ui = function(chat_container) {
    var ui = {};
        ui.chatContainer = chat_container;
        ui.reportToUser = {};

    var connectBox = get('connect-box');
    var connectBtn = get('connectBtn');
    var sendBtn = get('sendBtn');
    var nameBox = get('nickname');
    var sendMsgBox = get('send-message-box');
    var msgBox = get('message-box');

    setStyle(connectBox, 'display', 'inline-block');
    setStyle(sendMsgBox, 'display', 'none');

    ui.nameBox = nameBox;
    ui.btnConnect= connectBtn;
    ui.btnSend = sendBtn;
    ui.msgBox = msgBox;
    ui.msgId = 0;
    ui.reportToUser.error = function(msg) {
        alert(msg);
    };

    ui.connectionChanged = function(connected) {
        if (connected) {
            setStyle(connectBox, 'display', 'none');
            setStyle(sendMsgBox, 'display', 'block');
        }

        else {
            setStyle(connectBox, 'display', 'inline-block');
            setStyle(sendMsgBox, 'display', 'none');
        }
    };

    ui.addMessage = function(user, me, message) {
        ui.msgId += 1;
        var cssClass = user == me ? 'user me' : 'user';

        var msg = '<div id="message' + ui.msgId+'" class="message"></div>';
        addChild(this.chatContainer, msg);
        var toAdd = '<span class="'+ cssClass+'">'+user+':</span> <span class="msg">' + message+'</span>';
        addChild(get('message' +ui.msgId), toAdd);
    };

    ui.usersChange = function(name, count) {
        changeContent(get('users-count'), count);

    };



    return ui;
};


var Connection = function() {
    var con = {};
        con.socket = {on:function(){}};
    con.connect = function(host) {
        this.socket = io.connect(host);
    };

    con.connectUser = function(name) {
      this.socket.emit('connectme', {name: name});
      console.log('Connecting me', name);
    };

    con.sendMessage = function(user,message) {
      this.socket.emit('newMessage', {user: user, message: message});
    };

    con.connect('http://localhost:666');

    return con;

};




var App = function(uiController, connectionController) {

    this.ui = uiController;
    this.con = connectionController;
    this.userName = '';


    this.self = this;

    this.ui.btnConnect.onclick = function() {
        if (self.ui.nameBox.value) {
            self.con.connectUser(self.ui.nameBox.value);
            self.userName = self.ui.nameBox.value;
            self.ui.connectionChanged(true);
        }

        else {
            self.ui.reportToUser.error('Insert name');
        }
    };

    this.ui.btnSend.onclick = function() {
        if (self.ui.msgBox.value) {
            self.con.sendMessage(self.userName, self.ui.msgBox.value);
        }

        else {
            self.ui.reportToUser.error('Insert message');
        }
    };

    this.con.socket.on('usersChange', function(data){
        self.ui.usersChange(null, data.count);
    });

    this.con.socket.on('stats', function(data) {
        self.ui.usersChange(null, data.count);
        console.log(data)
    });

    this.con.socket.on('newMessage', function(data) {
        self.ui.addMessage(data.user, self.userName, data.message);
    });


};














