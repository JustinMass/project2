import * as React from 'react';
import * as io from 'socket.io-client';

// interface IProps extends IPokemonState {
//   fetchPokemon: (id: number) => any,
//   updateId: (id: number) => any
// }

// function subscribeToTimer(interval: any, cb: any) {
//   console.log(interval + cb);
// } 
// export { subscribeToTimer }




export class GameCanvasComponent extends React.Component<any, {}> {

  public componentDidMount() {
    const socket = io('http://localhost:3001');

    socket.on('connected', (payload:any) => {
      console.log(`You are user #${payload.count}`);
    
      const users = payload.users;
    
      console.log(`All users:`);
    
      for(const id in users){
        if(id){
          console.log(id);
        }
      }
    
      socket.on('quit', (id:any) => {
          console.log(`${id} disconnected`)
      })
    });
  }

  public render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col" id="gameCanvas">
            <button className="btn btn-primary">Test button</button>
            Game Canvas Component
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