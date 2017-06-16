let http = require('http');
let fs = require("fs");
let dataFactory = require("../common/dataFactory").dataFactory;
dataFactory.start();

const LONG_POLLING_TIMEOUT = 10000;

let server = http.createServer(function(req, res) {
    if (req.url == '/api') {
        setTimeout(() => {
            dataFactory.cleanCallback();
            let response = { tag: 'http-stream', status: false, msg: 'data end', data: '', end: true };
            res.end("<script type=\"text/javascript\">processData('" + JSON.stringify(response) + "')</script>");
        }, LONG_POLLING_TIMEOUT);
        dataFactory.setCallback((datas) => {
            let response = { tag: 'http-stream', status: true, msg: 'data returned(c)', data: datas };
            res.write("<script type=\"text/javascript\">processData('" + JSON.stringify(response) + "')</script>");
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
}).listen(8084, 'localhost');

console.log(`server start on http://localhost:8084`);

server.on('connection', function(socket) {
    console.log('connection');
});
server.on('close', function() {
    console.log('close......');
});
server.on('error', function(error) {
    console.log(`error:${error}`);
});