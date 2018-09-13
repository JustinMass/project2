import * as React from 'react';
import * as io from 'socket.io-client';
 // import * as $ from 'jquery';

// interface IProps extends IPokemonState {
//   fetchPokemon: (id: number) => any,
//   updateId: (id: number) => any
// }

// function subscribeToTimer(interval: any, cb: any) {
//   console.log(interval + cb);
// } 
// export { subscribeToTimer }




export class GameCanvasComponent extends React.Component<any, {}> {

  private canvasRef: React.RefObject<HTMLCanvasElement>;
  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef();
  }
  public componentDidMount() {
    const socket = io('http://localhost:3001');

    socket.on('connected', (payload: any) => {
      console.log(`You are user #${payload.count}`);

      const users = payload.users;

      console.log(`All users:`);

      for (const id in users) {
        if (id) {
          console.log(id);
        }
      }

      socket.on('quit', (id: any) => {
        console.log(`${id} disconnected`)
      })
    });
    const canvas = this.canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = "#FF0000"
        ctx.strokeStyle = "#bada55"
        ctx.lineWidth = 5
        ctx.lineCap = "round"
      }
    }
    // this.updateCanvas();
  }
  public updateCanvas(x: any, y: any, type: any) {
    const canvas = this.canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        if (type === 'dragstart') {
          ctx.beginPath();
          ctx.moveTo(x, y);
        }
        else if (type === 'drag') {
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        else {
          ctx.closePath();
        }

        // ctx.fillRect(0, 0, 150, 150);
        // ctx.moveTo(0, 0);
        // ctx.lineTo(200, 100);
        // ctx.stroke();
        // ctx.moveTo(0, 0);
        // ctx.lineTo(100, 100);
        // ctx.stroke();
        // console.log('in update canvas')
      }
    }
  }

  public handleDrag(e: any) {
   // $('canvas').on( 'dragstart', )
    const type = e.type;
    console.log(type);
    const canvas = this.canvasRef.current;
    if (canvas) {
     // const offset = $(canvas).offset();
     // if (offset) {
        const x = e.clientX;
        const y = e.clientY;
        this.updateCanvas(x, y, type);
     // }
    }
  }

  public render() {
    return (
      <div className="container" id="gameCanvasContainer">
        <div className="row">
          <div className="col" id="gameCanvas">
            <button className="btn btn-primary">Test button</button>
            <canvas className="bg-light" ref={this.canvasRef} draggable={true} onDrag={(e) => { this.handleDrag(e) }} onDragStart={(e) => { this.handleDrag(e) }} onDragEnd={(e) => { this.handleDrag(e) }} width={300} height={300}></canvas>
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