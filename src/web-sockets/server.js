let http = require('http');
let fs = require("fs");
let random = require("random-js")();
let dataFactory = require("../common/dataFactory").dataFactory;
dataFactory.start();
let server = http.createServer(function(req, res) {
    if (req.url == '/') {
        fs.readFile("./index.html", "binary", function(err, file) {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(file, "binary");
                res.end();
            }
        });
    };
}).listen(8086, 'localhost');

console.log(`server start on http://localhost:8086`);

server.on('connection', function(socket) {
    console.log('connection');
});
server.on('close', function() {
    console.log('close......');
});
server.on('error', function(error) {
    console.log(`error:${error}`);
});


var io = require('socket.io')();
io.on('connection', function(client) {
    console.log(`client connected`);
    dataFactory.setCallback((datas) => {
        io.emit('data', JSON.stringify(datas));
    });
});
io.listen(8087);