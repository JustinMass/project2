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

//directories set here can be accessed by user
app.use('/static', express.static(__dirname + '/static'));

// serve start page (TEMPORARY UNTIL S3 SETUP)
// app.get('/', function(req, res){
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// start listening
server.listen(port, () => {
    console.log(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
});

let count = 0;
let users = {};
io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    count++;

    users[socket.id] = socket.id;
    let payload = {
        count,
        users
    };
    socket.emit('connected', payload);

    socket.on('disconnect', function () {

        //check that user is a player. If players[socket.id] is undefined, the user is not a player
        if (typeof users[socket.id] !== 'undefined') {
            users[socket.id] = {};
        }

        count--;

        io.sockets.emit('quit', socket.id);
    });
});