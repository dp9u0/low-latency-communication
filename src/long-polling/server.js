let http = require('http');
let fs = require("fs");
let dataFactory = require("../common/dataFactory").dataFactory;
dataFactory.start();

const LONG_POLLING_TIMEOUT = 30000;

let server = http.createServer(function(req, res) {
    if (req.url == '/api') {
        datas = dataFactory.tryGetData();
        if (datas) {
            let response = { tag: 'long-polling', status: true, msg: 'data returned(d)', data: datas };
            res.end(JSON.stringify(response));
        } else {
            //TIMEOUT 后 直接返回
            setTimeout(() => {
                dataFactory.cleanCallback();
                let response = { tag: 'long-polling', status: false, msg: 'no data returned', };
                res.end(JSON.stringify(response));
            }, LONG_POLLING_TIMEOUT);
            dataFactory.setCallback((datas) => {
                dataFactory.cleanCallback();
                let response = { tag: 'long-polling', status: true, msg: 'data returned(c)', data: datas };
                res.end(JSON.stringify(response));
            });
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
}).listen(8082, 'localhost');

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