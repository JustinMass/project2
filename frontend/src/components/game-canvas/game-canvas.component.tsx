import * as React from 'react';
import * as io from 'socket.io-client';
// import * as $ from 'jquery';

// interface IProps extends IPokemonState {
//   fetchPokemon: (id: number) => any,
//   updateId: (id: number) => any
// }

export class GameCanvasComponent extends React.Component<any, any> {

  public canvas: any;
  public image: any;
  public imageContainer: any;
  // public timer: any;
  public isDrawing = false;
  public socket = io('http://localhost:3001');
  public drawColor = '#ff4141';
  public lineWidth = 4;

  constructor(props: any) {
    super(props);
    this.canvas = React.createRef();
    this.image = React.createRef();
    this.imageContainer = React.createRef();
    // this.timer = React.createRef();
    this.state = {
      timer: 0
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

  public sendArt = () => {
    // const current = this.canvas.current;
    // const image = new Image();
    // image.src = current.toDataURL("image/png");
    // // this.image.current.src = image.src;
    // this.socket.emit('art transfer', image.src);
    // // current.style.display = "none";
  }


  public componentDidMount() {

    this.socket.on('new art', (art: any) => {
      this.image.current.src = art;
      this.imageContainer.current.style.display = "block";
      this.canvas.current.style.display = "none";
    })
    this.imageContainer.current.style.display = "none";

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
    // this.image.current.src = image.src;
    this.socket.emit('art transfer', image.src);
    // current.style.display = "none";
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
          <canvas id="gameCanvas" width={600} height={600} className="bg-light" ref={this.canvas}
          >
          </canvas>
          <br />
          <button onClick={() => { this.sendArt() }} className="btn btn-primary">Send Art</button>
          <button onClick={() => { this.drawColor = '#f8f9fa'; this.lineWidth = 20; }} className="btn btn-dark eraseButton">Eraser</button>
          <button onClick={() => { this.drawColor = '#ff4141'; this.lineWidth = 4; }} className="btn btn-danger eraseButton">Red</button>
          <button onClick={() => { this.canvas.current.style.display = "block"; this.imageContainer.current.style.display = "none"; }} className="btn btn-warning eraseButton">Draw</button>
          <div ref={this.imageContainer} className="bg-light refImage">
            <img ref={this.image}></img>
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