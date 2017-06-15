let http = require('http');
let fs = require("fs");
let random = require("random-js")();

let server = http.createServer(function(req, res) {
    if (req.url == '/api') {
        if (random.integer(1, 2) === 1) {
            let response = { tag: 'polling', status: true, msg: '', data: new Date().toLocaleString() };
            res.end(JSON.stringify(response));
        } else {
            let response = { tag: 'polling', status: false, msg: 'no data returned', data: '' };
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