import express = require('express');
import session = require("express-session");
import * as bodyParser from "body-parser";


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

let players = [];
let playerCt = 0;
io.on('connection', (socket) => {
    let id = ++playerCt;
    players[id] = {
        id,
        art: ''
    };

    socket.emit('player data', players[id]);

    socket.on('art transfer', (art) => {
        // arts.push(art);
        players[id].art = art;

        setTimeout(() => {
            socket.emit('show art', players);

            // setTimeout(() => {
            //     arts = [];
            // }, 5000);
         }, 4000);
    });

    let finished = false;
    let time = 11;
    setInterval(() => {
        time--;
        if(time>0) {
            socket.emit('timer', time);
        }
        else if(!finished){
            socket.emit('finish');
            finished = true;
        }
    }, 1000);



    socket.on('disconnect', function () {
        players[id] = null;
        playerCt--;
    });
});