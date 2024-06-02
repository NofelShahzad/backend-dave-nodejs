const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');
const EventEmmitter = require('events');
class Emitter extends EventEmmitter { };

const myEmitter = new Emitter();
myEmitter.on('log', (msg,fileName)=> logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response)=>{
    try {
        const rawData =await fsPromises.readFile(filePath,
             !contentType.includes('image')? 'utf-8' : ''
            );
        const data =contentType==='application/json'
        ?JSON.parse(rawData):rawData;

        response.writeHead(
            filePath.includes('404.html')?404: 200,
            {'Content-Type': contentType}
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data): data
        );
        
    } catch (error) {
        console.log(error);
        myEmitter.emit('log', `${error.name}: ${error.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}


const server = http.createServer((req, res)=>{

    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt');

    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
            default:
            contentType = 'text/html';
            break;
    }

    let filePath =
    contentType === 'text/html' && req.url === '/'
        ? path.join(__dirname, 'views', 'index.html')
        : contentType === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname, 'views', req.url, 'index.html')
            : contentType === 'text/html'
                ? path.join(__dirname, 'views', req.url)
                : path.join(__dirname, req.url);

    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if(fileExists){
        // serve the file
        serveFile(filePath,contentType,res);
        
    }else{
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, {'Location':'/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'Location':'/'});
                res.end();
            default:
                //serve a 404 response
                serveFile(path.join(__dirname,'views', '404.html'),'text/html',res);
                break;
        }

    }







    


})


server.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})




    // if (req.url === '/') {
    //     res.writeHead(200, { 'content-type': contentType });
    //     res.end('<h1>Hello World</h1>');
    // } else if (req.url === '/about') {
    //     res.writeHead(200, { 'content-type': contentType });
    //     res.end('<h1>About Page</h1>');
    // } else {
    //     res.writeHead(404, { 'content-type': contentType });
    //     res.end('<h1>404 Page Not Found</h1>');
    // }



// myEmitter.emit('log','Log event emitted!');
 

// let filePath;

    // if (req.url === '/' || req.url === 'index.html') {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'Text/html');
    //     filePath = path.join(__dirname, 'views', 'index.html');

    //     fs.readFile(filePath, 'utf-8', (err,data)=>{
    //         res.end(data);
    //     })
    // }

    // switch (req.url) {
    //     case '/':
    //         res.statusCode = 200;
    //         res.setHeader('Content-Type', 'Text/html');
    //         filePath = path.join(__dirname, 'views', 'index.html');

    //         fs.readFile(filePath, 'utf-8', (err, data) => {
    //             res.end(data);
    //         });
    //         break;
    // }
