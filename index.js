var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var server = {};
server.lastPlayderID = 0;
server.playersList = [];

io.on('connection', function (socket) {
    console.log("User connected!")
    socket.on('newplayer',function(data){
        console.log("new player");
        console.log("data is "+data);
        console.log('init player '+data.x+', '+data.y);
        socket.player = {
            id: server.lastPlayderID++,
            x: data.x,
            y: data.y
        };

        socket.on('position',function(data){
            console.log("position: "+data);
            console.log('position to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            socket.broadcast.emit('players',getOtherPlayers(socket.player.id));
        });

        socket.on('disconnect',function(){
            console.log("User disconnected");
        });
    });

    socket.on('test',function(){
        console.log('test received');
    });
});

function getOtherPlayers(id){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        if (socketID !==  id) {
            var player = io.sockets.connected[socketID].player;
            if(player) players.push(player);
        }
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
