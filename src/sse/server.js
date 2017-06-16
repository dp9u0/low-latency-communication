let http = require('http');
let fs = require("fs");
let random = require("random-js")();
let dataFactory = require("../common/dataFactory").dataFactory;
dataFactory.start();

const EVENT_STREAM_TIMEOUT = 30000;
let id = 1;

let server = http.createServer(function(req, res) {
    if (req.url == '/api') {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            'Access-Control-Allow-Origin': '*',
            "Connection": "keep-alive"
        });
        dataFactory.setCallback((datas) => {
            let response = { tag: 'sse', status: true, msg: 'returned', data: datas };
            res.write('id: ' + id++ + '\n');
            res.write("data: " + JSON.stringify(response) + '\n\n');
        });
    };
    if (req.url == '/') {
        fs.readFile("./index.html", "binary", function(err, file) {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(file, "binary");
                res.end();
            }
        });
    };
}).listen(8085, 'localhost');

console.log(`server start on http://localhost:8085`);

server.on('connection', function(socket) {
    console.log('connection');
});
server.on('close', function() {
    console.log('close......');
});
server.on('error', function(error) {
    console.log(`error:${error}`);
});