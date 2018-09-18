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
  public socket = io('http://localhost:3001');
  public drawColor = '#ff4141';
  public lineWidth = 4;
  public user = {
    art: '',
    id: 0,
    pId: 0,
    score: 0
  };
  public winner = {
    art: '',
    id: 0,
    pId: 0,
    score: 0
  };

  constructor(props: any) {
    super(props);
    this.canvas = React.createRef();
    this.imageContainer = React.createRef();
    this.state = {
      score: 0,
      showCanvas: true,
      showImages: false,
      showWinner: false,
      timer: '',
      topic: 'blake kruppa',
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
        timer: 'Draw: ' + serverState.time,
        topic: serverState.topic
      });
    })

    this.socket.on('vote state', (serverState: any) => {
      this.setState({
        timer: 'Vote For Another Octopus: ' + serverState.time
      });
    })

    this.socket.on('wait state', (serverState: any) => {
      this.setState({
        timer: 'New Match In : ' + serverState.time
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
        score: 'Sacks: ' + this.user.score
      })
      console.log(this.user);
    })

    this.socket.on('winners', (winners: any[]) => {
      console.log('in winner');
      console.log(winners);
      this.setState({
        ...this.state,
        showImages: false,
        showWinner: true,
        winners
      });
      this.socket.emit('get data');
    })

    this.socket.on('done waiting', () => {
      this.resetGame();
    })

  }

  public render() {
    return (
      <div id="canvasComponentContainer"
        onMouseMove={(this.state.showCanvas ? this.draw : () => { console.log() })}
        onMouseDown={(e: any) => { if (this.state.showCanvas) { this.isDrawing = true; this.startDraw(e); } }}
        onMouseUp={(this.state.showCanvas ? this.toggleDraw : () => { console.log() })}>
        >
      <div id="gameCanvasContainer">
          {<h5 className="gameTimer">{this.state.timer}</h5>}
          {(this.state.showCanvas || this.state.showImages) && <h5 className="gameTimer">Topic: {this.state.topic}</h5>}
          {<h5 className="gameTimer">{this.state.score}</h5>}
          {this.state.showCanvas && <canvas id="gameCanvas" width={600} height={600} className="bg-light" ref={this.canvas}>
          </canvas>}
          <br />
          {this.state.showCanvas && <button onClick={() => { this.drawColor = '#f8f9fa'; this.lineWidth = 20; }} className="btn btn-dark eraseButton">Eraser</button>}
          {this.state.showCanvas && <button onClick={() => { this.drawColor = '#ff4141'; this.lineWidth = 4; }} className="btn btn-danger eraseButton">Red</button>}
        </div>

        <div className="container resultsContainer">
          <div className="row">
            {this.state.showImages && this.state.users.map((user: any) =>
              user && (user.pId !== this.user.pId) &&
              <div key={user.id} className="col">
                <div className="bg-light refImage text-light">
                  <img src={user.art} onClick={() => { this.handleVote(user.pId) }} className="resultImage"></img>
                  {user.pId + 1}
                </div>
              </div>
            )}
            <div className="container">
              <div className="row">
                {this.state.showWinner && this.state.winners.map((winner: any) =>

                  <div key={winner.pId} className="col">
                    <div className="bg-light refImage text-light">
                      <img className="resultImage" src={winner.art}></img>
                    </div>
                    <h2 className="text-light winnerLabel">User {winner.pId + 1} Wins!</h2>
                    <h3 className="text-light winnerLabel">Topic: {this.state.topic}</h3>
                    {/* <h4 className="text-light">Joining New Lobby..</h4> */}
                  </div>

                )}
              </div>
            </div>
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