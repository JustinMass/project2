import express = require('express');
import session = require("express-session");
import * as bodyParser from "body-parser";
import * as path from "path";

const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);


// set the port
const port = process.env.PORT || 3001;
app.set('port', port);

// establish session
const sess = {
    secret: 'fortyton',
    cookie: {secure: false},
    resave: false,
    saveUninitialized: false
};

if (app.get('env') === 'production'){
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

// register session
app.use(session(sess));

// log requests
app.use((req, res, next) => {
    console.log(`request made with path: ${req.path} \nand type: ${req.method}`);
    next();
});

//setup body parser
app.use(bodyParser.json());

// start listening
server.listen(port, () => {
    console.log(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
});

io.on('connection', (socket) => {

    socket.on('art transfer', (art) => {
        // console.log(art);
        console.log('art received on server');
        io.sockets.emit('new art', art);
    });

    let time = 31;
    setInterval(() => {
        if(time>0) {
            socket.emit('timer', time);
        }
        else{
            socket.emit('finish');
        }
    }, 1000);

    socket.on('disconnect', function () {
        //disconnect logic goes here
    });
});