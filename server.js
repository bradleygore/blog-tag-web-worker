/**
 * Created by bgore on 2/7/15.
 */
var http = require('http');
var urlHelper = require('url');
var pathHelper = require('path');
var fs = require('fs');
var baseDir = __dirname;
var server = http.createServer(handleRequest);

var contentTypes = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.xml': 'text/xml',
    DEFAULT: 'text/plain'
};


function handleRequest(req, res) {
    var reqUrl = urlHelper.parse(req.url);
    console.log('REQUEST URL.PATHNAME: ', reqUrl.pathname);
    var filePath = baseDir + reqUrl.pathname;
    //if root, then send the index.html
    if(reqUrl.pathname === '/') {
        filePath = filePath + 'index.html';
    } else if (reqUrl.pathname === '/rss') {
        //if /rss, then send the rss.xml
        filePath = baseDir + '/' + 'rss.xml';
    }

    //populate the ext
    var contentType = contentTypes[pathHelper.extname(filePath)] || contentTypes.DEFAULT;
    console.log('REQUEST FILEPATH: ', filePath);

    //first, check if it's a file and if it exists
    fs.exists(filePath, function checkPath(exists) {

        if (exists) {
            console.log('EXISTS: ', contentType);
            res.writeHead(200, {'Content-Type': contentType});
            var readStream = fs.createReadStream(filePath);

            readStream.on('open', function writeFile() {
                readStream.pipe(res);
            });

            readStream.on('error', function hasError(err) {
                res.end(err);
            });

        } else {
            console.log('DOES NOT EXIST!!!');
            res.writeHead(404, {'Content-Type': contentTypes.DEFAULT});
            res.write('404 Not Found\n');
        }

    });
}

server.listen(8080);