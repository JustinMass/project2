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

// log requests
app.use((req, res, next) => {
    console.log(`request made with path: ${req.path} \nand type: ${req.method}`);
    next();
});

//setup body parser
app.use(bodyParser.json());

app.use((req, resp, next) => {
    (process.env.DRAWCTOPUS_API_STAGE === 'prod')
        ? resp.header('Access-Control-Allow-Origin', 'http://www.drawctopus.net.s3-website-us-east-1.amazonaws.com/')
        : resp.header("Access-Control-Allow-Origin", "http://localhost:3000");
    resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    resp.header("Access-Control-Allow-Credentials", "true");
    resp.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
    next();
});

// start listening
server.listen(port, () => {
    console.log(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
});

const topics = ['Blake Kruppa', 'Fish', 'Chair', 'Regret', 'Hindsight', 'Fishing', 'Bike', 'Airplane'];

const games = [];

function Game(room){
    const curGame = this;
    curGame.players = [null, null, null, null, null, null];
    curGame.playerCt = 0;
    curGame.isFull = false;
    curGame.canJoin = true;
    curGame.started = false;
    curGame.id = room;
    curGame.finished = false;
    curGame.time = 11;
    curGame.tallies = [0, 0, 0, 0, 0, 0];

    // sets default topic
    curGame.lastTopic = 'default';
    curGame.topic = 'default';

    // communication for single player in room
    curGame.initPlayer = (socket) => {
        let pId = -1;
        socket.on('new player', () => {
            for(let i=0; i<curGame.players.length; i++){
                if(!curGame.players[i]){
                    pId = i;
                    curGame.players[i] = {
                        art: '',
                        pId,
                        score: 0,
                        upgrades: [],
                        username: 'Guest'
                    };
                    socket.emit('player data', curGame.players[pId]);
                    curGame.playerCt++;
                    break;
                }
            }

            let available = false;
            for(let i=0; i<curGame.players.length; i++){
                if(!curGame.players[i]) {
                    available = true;
                }
            }

            if(!available){
                curGame.isFull = true;
            }
        });

        socket.on('get data', () => {
           socket.emit('player data', curGame.players[pId]);
        });

        socket.on('art transfer', (art) => {
            curGame.players[pId].art = art;
        });

        socket.on('user vote', (voteId) => {
            if(pId !== voteId) {
                curGame.tallies[voteId]++;
            }
        });

        socket.on('buy upgrade', (upgradeObj) => {
           let player = curGame.players[upgradeObj.user.pId];
           let upgrade = upgradeObj.upgrade;

           if(!player.upgrades.includes(upgrade)){
               if(upgrade === 'yellow' && player.score>=10) {
                   player.score -= 10;
                   player.upgrades.push(upgrade);
                   socket.emit('player data', player);
               }
               else if(upgrade === 'blue' && player.score>=20) {
                   player.score -= 20;
                   player.upgrades.push(upgrade);
                   socket.emit('player data', player);
               }
               else if(upgrade === 'red' && player.score>=30) {
                   player.score -= 30;
                   player.upgrades.push(upgrade);
                   socket.emit('player data', player);
               }
               else if(upgrade === 'green' && player.score>=50) {
                   player.score -= 50;
                   player.upgrades.push(upgrade);
                   socket.emit('player data', player);
               }
               else{
                   socket.emit('purchase failure');
               }
           }
           else{
               socket.emit('purchase failure');
           }

        });

        socket.on('disconnect', function () {
            curGame.players[pId] = null;
            curGame.playerCt--;
            curGame.isFull = false;
        });
    };

    let isFirst = true;

    curGame.topic = topics[Math.floor(Math.random() * (topics.length))];
    curGame.lastTopic = curGame.topic;
    // communication for all players in room
    setInterval(() => {
        if(curGame.playerCt>=3 || curGame.started) {
            if(isFirst) {
                io.to(room).emit('game start');
                curGame.started = true;
                curGame.canJoin = false;
                isFirst = false;
            }

            curGame.time--;
            if (curGame.time > 0) {
                let state = {
                    time: curGame.time,
                    topic: curGame.topic
                };
                io.to(room).emit('state', state);
            }
            else if (!curGame.finished) {
                io.to(room).emit('finish');
                curGame.finished = true;
            }
            else if (!curGame.artShown) {
                io.to(room).emit('show art', curGame.players);
                curGame.artShown = true;
                let winnerShown = false;

                let voteTimer = 9;
                // wait a set amount of time for votes
                let waitInter = setInterval(() => {
                    if (voteTimer > 0) {
                        let state = {
                            time: --voteTimer,
                            topic: curGame.topic
                        };
                        io.to(room).emit('vote state', state);
                    }
                    else if (!winnerShown) {

                        let winners = [];
                        let max = 0;
                        // calculate max
                        for (let i = 0; i < curGame.tallies.length; i++) {
                            if (curGame.tallies[i] > max) {
                                max = curGame.tallies[i];
                            }

                            // calculate points for each player
                            if (curGame.players[i]) {
                                curGame.players[i].score += curGame.tallies[i] * 10;
                            }
                        }

                        // calculate winner
                        for (let i = 0; i < curGame.tallies.length; i++) {
                            if (curGame.tallies[i] === max && max !== 0) {
                                winners.push(curGame.players[i]);
                            }
                        }

                        // emit winner
                        io.to(room).emit('winners', winners);

                        winnerShown = true;

                        // wait for new match to start
                        let waitTime = 11;
                        curGame.canJoin = true;
                        let waitInterval = setInterval(() => {
                            if (waitTime > 0) {
                                let state = {
                                    time: --waitTime,
                                    topic: curGame.topic
                                };
                                io.to(room).emit('wait state', state);
                            }
                            else if (curGame.playerCt >= 3) {
                                io.to(room).emit('done waiting');

                                // reset variables
                                curGame.canJoin = false;
                                curGame.started = false;
                                curGame.time = 11;
                                curGame.finished = false;
                                curGame.artShown = false;
                                isFirst = true;
                                while (curGame.topic === curGame.lastTopic) {
                                    curGame.topic = topics[Math.floor(Math.random() * (topics.length))];
                                }
                                curGame.lastTopic = curGame.topic;
                                for (let i = 0; i < curGame.tallies.length; i++) {
                                    curGame.tallies[i] = 0;
                                }
                                clearInterval(waitInter);
                                clearInterval(waitInterval);
                            }
                            else{
                                io.to(room).emit('await players');
                            }
                        }, 1000);
                    }
                }, 1000);
            }
        }
    }, 1000);

}

io.on('connection', (socket) => {
    let room = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER));

    // if no games, create new one
    if(games.length === 0){
        games.push(new Game(room));
        socket.join(room);
        games[0].initPlayer(socket);
    }
    // if there are games, try connecting to them
    else{
        let success = false;
        for(let i = 0; i<games.length; i++){
            let game = games[i];
            if(!game.isFull && game.canJoin){
                socket.join(game.id);
                games[i].initPlayer(socket);
                success = true;
                break;
            }
        }

        // if there are games, but all were full, make a new one
        if(!success){
            games.push(new Game(room));
            socket.join(room);
            games[games.length-1].initPlayer(socket);
        }
    }
});