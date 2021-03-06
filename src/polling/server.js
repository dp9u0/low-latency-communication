let http = require('http');
let fs = require("fs");
let random = require("random-js")();
let dataFactory = require("../common/dataFactory").dataFactory;
dataFactory.start();
let server = http.createServer(function(req, res) {
    if (req.url == '/api') {
        datas = dataFactory.tryGetData();
        if (datas) {
            let response = { tag: 'polling', status: true, msg: 'data returned', data: datas };
            res.end(JSON.stringify(response));
        } else {
            let response = { tag: 'polling', status: false, msg: 'no data returned', };
            res.end(JSON.stringify(response));
        }
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
}).listen(8081, 'localhost');

console.log(`server start on http://localhost:8081`);

server.on('connection', function(socket) {
    console.log('connection');
});
server.on('close', function() {
    console.log('close......');
});
server.on('error', function(error) {
    console.log(`error:${error}`);
});