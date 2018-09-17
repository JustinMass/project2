import * as React from 'react';
import * as io from 'socket.io-client';
// import * as $ from 'jquery';

// interface IProps extends IPokemonState {
//   fetchPokemon: (id: number) => any,
//   updateId: (id: number) => any
// }

export class GameCanvasComponent extends React.Component<any, any> {

  public canvas: any;
  public users: any[];
  public imageContainer: any;
  // public showImages = false;
  public isDrawing = false;
  public socket = io('http://localhost:3001');
  public drawColor = '#ff4141';
  public lineWidth = 4;
  public user = {
    art: '',
    id: 0,
    pId: 0,
    points: 0
  };

  constructor(props: any) {
    super(props);
    this.canvas = React.createRef();
    this.imageContainer = React.createRef();
    this.state = {
      showImages: false,
      timer: '',
      users: [],
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
      showImages : false
    })
    console.log('voted');
  }


  public componentDidMount() {
    this.socket.emit('new player');

    this.socket.on('show art', (players: any[]) => {
      console.log(players);
      this.setState({
        ...this.state,
        users: players
      })
      this.setState({
        ...this.state,
        showImages: true
      })
      this.canvas.current.style.display = "none";
    })

    this.socket.on('timer', (timer: any) => {
      this.setState({
        timer
      });
    })

    this.socket.on('finish', () => {
      this.setState({
        timer: "Time's Up!"
      })
      const current = this.canvas.current;
      const image = new Image();
      image.src = current.toDataURL("image/png");
      this.socket.emit('art transfer', image.src);

    })

    this.socket.on('player data', (player: any)=> {
        this.user = player;
        console.log(this.user);
    })
  }

  public render() {
    return (
      <div id="canvasComponentContainer"
        onMouseMove={this.draw}
        onMouseDown={(e: any) => { this.toggleDraw(); this.startDraw(e); }}
        onMouseUp={this.toggleDraw}>
        >
      <div id="gameCanvasContainer">
          <h5 className="gameTimer">{this.state.timer}</h5>
          <canvas id="gameCanvas" width={600} height={600} className="bg-light" ref={this.canvas}>
          </canvas>
          <br />
          {!this.state.showImages && <button onClick={() => { this.drawColor = '#f8f9fa'; this.lineWidth = 20; }} className="btn btn-dark eraseButton">Eraser</button>}
          {!this.state.showImages && <button onClick={() => { this.drawColor = '#ff4141'; this.lineWidth = 4; }} className="btn btn-danger eraseButton">Red</button>}
        </div>

        <div className="container resultsContainer">
          <div className="row">
            {this.state.showImages && this.state.users.map((user: any) =>
            user && 
              <div key={user.id} className="col">
                <div className="bg-light refImage text-light">
                  <img src={user.art} onClick={() => { this.handleVote(user.pId) }} className="resultImage"></img>
                  {user.pId + 1}
                </div>
              </div>

            )}
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