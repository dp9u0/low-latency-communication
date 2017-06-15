let http = require('http');
let fs = require("fs");
let random = require("random-js")();

let store = { num: 0 };

setInterval(() => {
    store.num = random.integer(1, 10);
}, 10);

let server = http.createServer(function(req, res) {
    if (req.url == '/api') {
        resopnseToClient(res, 10);
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
}).listen(8082, 'localhost');

function resopnseToClient(res, timeout, currentTime = 0) {
    if (store.num === 5) {
        let response = { tag: 'long-polling', status: true, msg: `data returned after ${currentTime*1000}s`, data: new Date().toLocaleString() };
        res.end(JSON.stringify(response));
    } else if (timeout === currentTime) {
        let response = { tag: 'long-polling', status: false, msg: 'timeout,no data returned', data: '' };
        res.end(JSON.stringify(response));
    } else {
        setTimeout(() => {
            resopnseToClient(res, timeout, currentTime + 1);
        }, 1000);
    }
}

console.log(`server start on http://localhost:8082`);

server.on('connection', function(socket) {
    console.log('connection');
});
server.on('close', function() {
    console.log('close......');
});
server.on('error', function(error) {
    console.log(`error:${error}`);
});