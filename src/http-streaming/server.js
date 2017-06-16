let http = require('http');
let fs = require("fs");
let dataFactory = require("../common/dataFactory").dataFactory;
dataFactory.start();

const HTTP_STREAM_TIMEOUT = 5 * 60 * 1000;

let server = http.createServer(function(req, res) {
    if (req.url == '/api') {
        setTimeout(() => {
            dataFactory.cleanCallback();
            let response = { tag: 'http-stream', status: false, msg: 'data end', end: true };
            res.end(JSON.stringify(response));
        }, HTTP_STREAM_TIMEOUT);
        dataFactory.setCallback((datas) => {
            let response = { tag: 'http-stream', status: true, msg: 'data returned', data: datas };
            res.write(JSON.stringify(response));
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
}).listen(8083, 'localhost');

console.log(`server start on http://localhost:8083`);

server.on('connection', function(socket) {
    console.log('connection');
});
server.on('close', function() {
    console.log('close......');
});
server.on('error', function(error) {
    console.log(`error:${error}`);
});