import * as React from 'react';
import * as io from 'socket.io-client';
import { RouteComponentProps } from 'react-router';
// import * as $ from 'jquery';

// interface IProps extends IPokemonState {
//   fetchPokemon: (id: number) => any,
//   updateId: (id: number) => any
// }
interface IProps extends RouteComponentProps<{}> {

}

export class GameCanvasComponent extends React.Component<IProps, any> {

  public canvas: any;
  // public users: any[];
  public imageContainer: any;
  public isDrawing = false;
  public socket = io('http://ec2-52-13-0-150.us-west-2.compute.amazonaws.com:3001/');
  public drawColor = '#212529';
  public lineWidth = 4;
  public user = {
    art: '',
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
      displayFailure: false,
      failedToBuy: false,
      score: 0,
      showCanvas: false,
      showImages: false,
      showWaiting: true,
      showWinner: false,
      timer: '',
      topic: '',
      upgrades: [],
      users: [],
      winners: []
    }
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
    const ctx = this.getContext();
    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    this.isDrawing = false;
  }

  public buyUpgrade = (e: any) => {
    console.log(e.target.value);
    const buyUpgrade = {
      upgrade: e.target.value,
      user: this.user
    }
    this.socket.emit('buy upgrade', buyUpgrade);
    // if(!this.state.upgrades){
    //   this.setState({
    //     ...this.state,
    //     upgrades: [e.target.value]
    //   });
    // }
    //   else {
    //   this.setState({
    //     ...this.state,
    //     upgrades: [...this.state.upgrades, e.target.value]
    //   });
    // }

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
    this.socket.emit('new player');

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
      this.setState({
        ...this.state,
        score: 'User: ' + (this.user.pId + 1) + '\xa0\xa0|\xa0 Sacks: ' + this.user.score,
        upgrades: player.upgrades
      })
      console.log(this.user);
    })

    this.socket.on('winners', (winners: any[]) => {
      console.log('in winner');
      console.log(winners);
      this.setState({
        ...this.state,
        afterVote:false,
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
  }

  public render() {
    return (
      <div id="canvasComponentContainer"
        onMouseMove={(this.state.showCanvas ? this.draw : () => { console.log() })}
        onMouseDown={(e: any) => { if (this.state.showCanvas) { this.isDrawing = true; this.startDraw(e); } }}
        onMouseUp={(this.state.showCanvas ? this.toggleDraw : () => { console.log() })}>
        >



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

            {this.state.showWaiting && <h5 className="gameTimer">Waiting For More Octopi...</h5>}
            {!this.state.showWaiting && <h5 className="gameTimer">{this.state.timer}</h5>}
            {(this.state.showCanvas || this.state.showImages) && <h5 className="gameTimer">Topic: {this.state.topic}</h5>}
            {!this.state.showWaiting && <h5 className="gameTimer">{this.state.score}</h5>}


            {this.state.showCanvas && <canvas id="gameCanvas" width={600} height={600} className="bg-light" ref={this.canvas}>
            </canvas>}


            <br />
            {this.state.showCanvas && <button onClick={() => { this.drawColor = '#f8f9fa'; this.lineWidth = 20; }} className="btn btn-sm eraseButton eraseBackground">Eraser</button>}
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
        </div>



        <div className="container resultsContainer">
          <div className="row">
            {this.state.showImages && this.state.users.map((user: any) =>
              user && (user.pId !== this.user.pId) &&
              <div key={user.id} className="col-4">
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
                <h2 className="text-light winnerLabel">User {winner.pId + 1} Wins!</h2>
                <h3 className="text-light winnerLabel">Topic: {this.state.topic}</h3>
              </div>

            )}
          </div>
        </div>

        <br />
        <div className="container upgradeContainer">

          <div className="row">

          </div>


        </div>


      </div>

    );
  }
}

// const mapStateToProps = (state: IState) => (state.signIn);

// const mapDispatchToProps = {
//   updateError: signInActions.updateError,
//   updatePassword: signInActions.updatePassword,
//   updateUsername: signInActions.updateUsername,
// }

// export default connect(mapStateToProps, mapDispatchToProps)(SignInComponent);