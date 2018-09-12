import * as React from 'react';

// interface IProps extends IPokemonState {
//   fetchPokemon: (id: number) => any,
//   updateId: (id: number) => any
// }

export class GameCanvasComponent extends React.Component<any, {}> {

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