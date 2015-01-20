var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);


var User = function(name,id) {this.name=name; this.id=id};

app.use(express.static(__dirname + '/front'));

var users = [];




io.on('connection', function(socket) {

    socket.emit('stats', {count : users.length});

    socket.on('connectme', function(data) {
        console.log('new user connected', data);
        users.push(new User(data.name,socket.id));
       io.emit('usersChange', {name: data.name, count: users.length});

    });

    socket.on('disconnect', function(data,dt){
         users.forEach(function(item,index) {
            if (item.id == socket.id) {
                users.splice(index,1);
                console.log('user disconnected');
                io.emit('usersChange', {name: null, count: users.length});
            }
         });
    });

    socket.on('newMessage', function(data) {
        io.emit('newMessage', {user: data.user, message: data.message})
    });

});



app.get('/', function (req, res) {
    res.sendfile(__dirname + '/front/index.html');
});


server.listen(666, function() {
    console.log('Server listening on ' + server.address().port)
});