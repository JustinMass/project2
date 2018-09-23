import * as React from 'react';
import * as io from 'socket.io-client';
import { RouteComponentProps } from 'react-router';
import { DBuser } from '../sign-in/sign-in.component';
import logo from '../../assets/octoArtistTransparent4.png';

// import { IGameCanvasState, IState } from '../../reducers';
// import { updateUser } from '../../actions/game-canvas/game-canvas.actions';
// import { connect } from 'react-redux';

interface IProps extends RouteComponentProps<{}> {
  // updateUser: (user: {}) => any

}

export class GameCanvasComponent extends React.Component<IProps, any> {

  public canvas: any;
  public imageContainer: any;
  public isDrawing = false;
  public socket = io('http://ec2-34-219-29-142.us-west-2.compute.amazonaws.com:3001/');
  public drawColor = '#212529';
  public lineWidth = 4;
  public user = {
    art: '',
    message: '',
    messages: [],
    pId: 0,
    score: 0,
    upgrades: [],
    username: ''
  };


  constructor(props: any) {
    super(props);
    this.canvas = React.createRef();
    this.imageContainer = React.createRef();
    this.state = {
      afterVote: false,
      author: '',
      displayFailure: false,
      failedToBuy: false,
      message: '',
      messages: [],
      score: 0,
      showCanvas: false,
      showImages: false,
      showWaiting: true,
      showWinner: false,
      timer: '',
      topic: '',
      upgrades: [],
      users: [],
      waitingString: 'Waiting For More Octopi...',
      winners: []
    }
  }

  public addMessage = (data: any) => {
    console.log(data);
    this.setState({ ...this.state, messages: [...this.state.messages, data] });
    const something = document.getElementsByClassName('messages')[0];
    something.scrollTop = something.scrollHeight;
    // console.log(this.state.messages);
  }

  public sendMessage = (ev: any) => {
    console.log('we have a key press');
    if (ev.type === 'keypress' && (ev.which !== 13)) {
      return;
    }
    console.log('we hit enter');
    ev.preventDefault();

    console.log(this.user.username + ' ' + this.state.message);
    this.socket.emit('SEND_MESSAGE', {
      author: this.user.username,
      message: this.state.message
    })
    this.setState({ ...this.state, message: '' });
  }


  public getContext(): CanvasRenderingContext2D {
    return this.canvas.current.getContext("2d");
  }

  public draw = (e: any) => {
    if (this.isDrawing) {
      const current = this.canvas.current;
      const context: CanvasRenderingContext2D = current.getContext("2d");
      context.strokeStyle = this.drawColor;
      context.lineWidth = this.lineWidth;
      context.lineCap = "round";
      context.lineTo(e.pageX - current.offsetLeft, e.pageY - current.offsetTop)
      context.stroke()
    }
  }

  public toggleDraw = () => {
    this.isDrawing = !this.isDrawing;
  }

  public startDraw = (e: any) => {
    const context = this.getContext();
    const current = this.canvas.current;
    context.moveTo(e.pageX - current.offsetLeft, e.pageY - current.offsetTop);
    context.beginPath();
  }

  public handleVote = (pId: any) => {
    this.socket.emit('user vote', pId);
    this.setState({
      ...this.state,
      afterVote: true,
      showImages: false
    });
    console.log('voted');
  }

  public resetGame = () => {
    this.setState({
      ...this.state,
      showCanvas: true,
      showImages: false,
      showWinner: false
    });
    if (this.canvas.current) {
      const ctx = this.getContext();
      ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
      this.isDrawing = false;
    }
  }

  public buyUpgrade = (e: any) => {
    console.log(e.target.value);
    const buyUpgrade = {
      upgrade: e.target.value,
      user: this.user
    }


    this.socket.emit('buy upgrade', buyUpgrade);

  }

  public DisplayFailure = () => {
    console.log('in display failure');
    this.setState({
      ...this.state,
      displayFailure: false
    });
    setTimeout(() => {
      this.setState({
        ...this.state,
        failedToBuy: false
      });
    }, 1500)
  }


  public componentDidMount() {
    // document.body.style.backgroundImage = '../../assets/octoArtistTransparent4.png';
    $('body').css('backgroundImage', `url(${logo})`);
    console.log('changed the login push so it pushes to the game');
    // const userString = localStorage.getItem('user')
    if (DBuser && DBuser.id !== 0) {
      // const user = JSON.parse(userString); 
      // console.log(user);
      // console.log('This is the JSON parse');
      console.log(DBuser);
      console.log('this is the exported DB user');

      this.socket.emit('new player', DBuser);
    }
    else {
      this.socket.emit('new player', null);
    }

    this.socket.on('show art', (players: any[]) => {
      console.log('in show art');
      console.log(players);
      this.setState({
        ...this.state,
        showCanvas: false,
        showImages: true,
        users: players
      })

    })

    // not receiving messages
    this.socket.on('RECEIVE_MESSAGE', (data: any) => {
      console.log('calling add message');
      this.addMessage(data);
    })

    this.socket.on('state', (serverState: any) => {
      this.setState({
        ...this.state,
        timer: 'Draw: ' + serverState.time,
        topic: serverState.topic
      });
    })

    this.socket.on('vote state', (serverState: any) => {
      this.setState({
        ...this.state,
        timer: 'Vote For Another Octopus: ' + serverState.time,
        topic: serverState.topic
      });
    })

    this.socket.on('wait state', (serverState: any) => {
      this.setState({
        ...this.state,
        timer: 'New Match In : ' + serverState.time,
        topic: serverState.topic
      });
    })

    this.socket.on('await players', () => {
      this.setState({
        ...this.state,
        timer: 'Waiting For More Players To Start Match'
      });

    })

    this.socket.on('finish', () => {
      this.setState({
        timer: "Time's Up!"
      })
      const current = this.canvas.current;
      if (current) {
        const image = new Image();
        image.src = current.toDataURL("image/png");
        this.socket.emit('art transfer', image.src);
      }

    })

    this.socket.on('player data', (player: any) => {
      console.log('setting player data');
      this.user = player;
      if (this.user.username === 'Guest') {
        this.setState({
          ...this.state,
          score: 'Guest: ' + (this.user.pId + 1) + '\xa0\xa0|\xa0 Sacks: ' + this.user.score,
          upgrades: player.upgrades
        })
      }
      else {
        this.setState({
          ...this.state,
          score: (this.user.username) + '\xa0\xa0|\xa0 Sacks: ' + this.user.score,
          upgrades: player.upgrades
        })
      }
      console.log(this.user);
    })

    this.socket.on('winners', (winners: any[]) => {
      console.log('in winner');
      console.log(winners);
      this.setState({
        ...this.state,
        afterVote: false,
        showImages: false,
        showWinner: true,
        winners
      });
      this.socket.emit('get data');
    })

    this.socket.on('done waiting', () => {
      this.resetGame();
    })

    this.socket.on('game start', () => {
      this.setState({
        ...this.state,
        showCanvas: true,
        showWaiting: false
      })
    })

    this.socket.on('purchase failure', () => {
      console.log('in purchase failure');
      this.setState({
        ...this.state,
        displayFailure: true,
        failedToBuy: true
      })
    })

    this.socket.on('player joining', () => {
      console.log('in player joining');
      this.setState({
        ...this.state,
        waitingString: 'Waiting For Current Match To End..'
      });
    })

  }

  public componentWillUnmount () {
    this.socket.disconnect();
  }

  public render() {
    return (
      <div id="canvasComponentContainer"
        onMouseMove={(this.state.showCanvas ? this.draw : () => { console.log() })}
        onMouseDown={(e: any) => { if (this.state.showCanvas) { this.isDrawing = true; this.startDraw(e); } }}
        onMouseUp={(this.state.showCanvas ? this.toggleDraw : () => { console.log() })}>


        >

       {/* <img src={logo} className="homeElement" alt="octopus" id="DrawctopusLogo"></img> */}

        <div className="canvasUpgrades">

          {(this.state.showCanvas) && <div className="upgradeContainer">
            <button className="btn btn-dark buyUpgradeButton" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
              Buy Upgrades
              </button>
            <div>
              {this.state.failedToBuy && <h5 id="failedPurchase">Insufficient Sacks/Already Purchased Upgrade</h5>}
              {this.state.displayFailure && this.DisplayFailure()}
            </div>
            <div className="collapse" id="collapseExample">
              <button value="yellow" className="btn btn-warning upgradeButton" onClick={(e) => { this.buyUpgrade(e) }}>Buy Yellow <br /> 10 Sacks</button>
              <button value="blue" className="btn btn-primary upgradeButton" onClick={(e) => { this.buyUpgrade(e) }}>Buy Blue <br /> 20 Sacks </button>
              <button value="red" className="btn btn-danger upgradeButton" onClick={(e) => { this.buyUpgrade(e) }}>Buy Red <br /> 30 Sacks</button>
              <button value="green" className="btn btn-success upgradeButton" onClick={(e) => { this.buyUpgrade(e) }}>Buy Green <br /> 50 Sacks</button>

            </div>
          </div>}

          {(this.state.showImages || this.state.afterVote || this.state.showWaiting || this.state.showWinner) && <div className="upgradeContainer"></div>}

          <div id="gameCanvasContainer">

            {this.state.showWaiting && <h5 className="gameTimer">{this.state.waitingString}</h5>}
            {!this.state.showWaiting && <h5 className="gameTimer">{this.state.timer}</h5>}
            {(this.state.showCanvas || this.state.showImages) && <h5 className="gameTimer">Topic: {this.state.topic}</h5>}
            {!this.state.showWaiting && <h5 className="gameTimer">{this.state.score}</h5>}


            {this.state.showCanvas && <canvas id="gameCanvas" width={550} height={550} className="bg-light" ref={this.canvas}>
            </canvas>}


            <br />
            {this.state.showCanvas && <button onClick={() => { this.drawColor = '#f8f9fa'; this.lineWidth = 20; }} className="btn btn-sm eraseBackground">Eraser</button>}
            {this.state.showCanvas && <button onClick={() => { this.drawColor = '#212529'; this.lineWidth = 4; }} className="btn btn-dark eraseButton">{'\xa0'}</button>}
            {this.state.showCanvas && this.state.upgrades && this.state.upgrades.includes('blue') && <button className="btn btn-primary eraseButton"
              onClick={() => {
                this.drawColor = '#007bff';
                this.lineWidth = 4;
              }}>{'\xa0'}</button>}
            {this.state.showCanvas && this.state.upgrades && this.state.upgrades.includes('yellow') && <button className="btn btn-warning eraseButton"
              onClick={() => {
                this.drawColor = '#ffc107';
                this.lineWidth = 4;
              }}>{'\xa0'}</button>}
            {this.state.showCanvas && this.state.upgrades && this.state.upgrades.includes('green') && <button className="btn btn-success eraseButton"
              onClick={() => {
                this.drawColor = '#28a745';
                this.lineWidth = 4;
              }}>{'\xa0'}</button>}
            {this.state.showCanvas && this.state.upgrades && this.state.upgrades.includes('red') && <button className="btn btn-danger eraseButton"
              onClick={() => {
                this.drawColor = '#dc3545';
                this.lineWidth = 4;
              }}>{'\xa0'}</button>}
          </div>

          <div className="chatContainer">
            {/* <div className="row">
              <div className="col-xs-3"> */}
            <div className="card chatCard">
              <div className="card-body">
                <div className="card-title">Chat</div>
                <hr />
                <div className="messages">
                  {this.state.messages.map((message: any) => {
                    return (
                      <div key={Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER))}>{message.author}: {message.message}</div>
                    )
                  })}
                </div>

              </div>
              <div className="card-footer">

                <input type="text" onKeyPress={this.sendMessage} placeholder="Message" className="form-control" value={this.state.message} onChange={ev => this.setState({ message: ev.target.value })} />
                <br />
                <button onClick={this.sendMessage} className="btn btn-dark form-control">Send</button>
              </div>
            </div>
            {/* </div>
            </div> */}
          </div>

        </div>



        <div className="container resultsContainer">
          <div className="row">
            {this.state.showImages && this.state.users.map((user: any) =>
              user && user.art && (user.pId !== this.user.pId) &&
              <div key={user.pId} className="col-4">
                <div className="bg-light refImage text-light">
                  <img src={user.art} onClick={() => { this.handleVote(user.pId) }} className="resultImage" />
                  {/* {`User ${user.pId + 1}`} */}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="container winnerContainer">
          <div className="row">
            {this.state.showWinner && this.state.winners.map((winner: any) =>

              <div key={winner.pId} className="col">
                <div className="bg-light refImage text-light">
                  <img className="resultImage" src={winner.art} />
                </div>
                <h2 className="text-light winnerLabel">User {winner.username} Wins!</h2>
                <h3 className="text-light winnerLabel">Topic: {this.state.topic}</h3>
              </div>

            )}
          </div>
        </div>

      </div>

    );
  }
}

// const mapStateToProps = (state: IState) => (state.gameCanvas);

// const mapDispatchToProps = {
//   updateUser,
// }

// export default connect(mapStateToProps, mapDispatchToProps)(GameCanvasComponent);
