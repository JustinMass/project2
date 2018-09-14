import * as React from 'react';
import * as io from 'socket.io-client';
// import * as $ from 'jquery';

// interface IProps extends IPokemonState {
//   fetchPokemon: (id: number) => any,
//   updateId: (id: number) => any
// }

export class GameCanvasComponent extends React.Component<any, {}> {

  public canvas: any;
  public image: any;
  public isDrawing = false;
  public socket = io('http://localhost:3001');

  constructor(props: any) {
    super(props);
    this.canvas = React.createRef();
    this.image = React.createRef();
  }

  public getContext(): CanvasRenderingContext2D {
    return this.canvas.current.getContext("2d");
  }

  public draw = (e: any) => {
    if (this.isDrawing) {
      const current = this.canvas.current;
      const context: CanvasRenderingContext2D = current.getContext("2d");
      context.strokeStyle = '#ff4141';
      context.lineWidth = 4;
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
    const current = this.canvas.current;
    const image = new Image();
    image.src = current.toDataURL("image/png");
    this.image.current.src = image.src;
    this.socket.emit('art transfer', image.src)
  }


  public componentDidMount() {

   this.socket.on('new art', (art: any)=> {
      this.image.current.src = art;
   })
    
    }
    

  public render() {
    return (
      <div id="gameCanvasContainer">
        <canvas id="gameCanvas" width={600} height={600} className="bg-light" ref={this.canvas}
          onMouseMove={this.draw}
          onMouseDown={(e: any) => { this.toggleDraw(); this.startDraw(e); }}
          onMouseUp={this.toggleDraw}>
        </canvas>
        <button onClick={()=>{this.sendArt()}} className="btn btn-primary">Send Art</button>
        <img ref={this.image}></img>
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