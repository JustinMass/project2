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

const games = [];

function Game(room){
    const curGame = this;
    curGame.players = [null, null, null, null, null, null];
    curGame.isFull = false;
    curGame.id = room;
    curGame.finished = false;
    curGame.time = 11;

    // communication for single player in room
    curGame.initPlayer = (socket) => {
        let pId = -1;
        socket.on('new player', () => {
            for(let i=0; i<curGame.players.length; i++){
                if(!curGame.players[i]){
                    pId = i;
                    curGame.players[i] = {
                        art: '',
                        id: Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER)),
                        score: 0
                    };
                    break;
                }
            }
        });

        socket.emit('player data', curGame.players[pId]);

        socket.on('art transfer', (art) => {
            curGame.players[pId].art = art;
        });

        socket.on('disconnect', function () {
            curGame.players[pId] = null;
        });
    };

    // communication for all players in room
    setInterval(() => {
        curGame.time--;
        if(curGame.time>0){
            io.to(room).emit('timer', curGame.time);
        }
        else if(!curGame.finished){
            io.sockets.emit('finish');
            curGame.finished = true;
        }
        else if(!curGame.artShown) {
            io.to(room).emit('show art', curGame.players);
            curGame.artShown = true;

            // wait a set amount of time for votes
            setInterval(() => {
                //TODO: Handle votes

                // reset variables
                curGame.timer = 11;
                curGame.finished = false;
                curGame.artShown = false;
            }, 5000);
        }
    }, 1000);

}

io.on('connection', (socket) => {
    let room = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER));

    if(games.length === 0){
        games.push(new Game(room));
        socket.join(room);
        games[0].initPlayer(socket);
        //socket.emit('start', room);
    }
    else{
        let success = false;
        for(let i = 0; i<games.length; i++){
            let game = games[i];
            if(!game.isFull){
                socket.join(game.id);
                games[i].initPlayer(socket);
                //socket.emit('start', game.id);
                success = true;
                break;
            }
        }

        //no open room found
        if(!success){
            games.push(new Game(room));
            socket.join(room);
            games[games.length-1].initPlayer(socket);
            //socket.emit('start', room);
        }
    }
});