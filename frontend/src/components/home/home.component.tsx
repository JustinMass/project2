import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import logo from '../../assets/Picture1.png'

interface IProps extends RouteComponentProps<{}> {

}

export class HomeComponent extends React.Component<IProps, {}> {

    public goToGame = () => {
        this.props.history.push('/game');
    }


    public render() {
        return (
            <div className="container">
            <div className="row">
            <div className="col">
            <h1 className="text-white text-center font-weight-bold welcomeMessage">Welcome to Drawctopus</h1>
            </div>
            </div>
                <div className="row">

                    
                    <br />
                    <div className="col">
                        <img src={logo} alt="octopus" height="500" width="400"></img>
                    </div>
                    <div className="col-7">
                        <ul>
                            <li className="text-white infoList">Join an Octopus lobby</li>
                            <li className="text-white infoList">Draw the specified object within the time limit</li>
                            <li className="text-white infoList">Vote to see which octopus's drawing was the best</li>
                            <li className="text-white infoList">Accumulate ink sacks by gettin' votes</li>
                            <li className="text-white infoList">Spend sacks to buy different tentacles</li>
                            <li className="text-white infoList">Become the greatest octopus artist known to octopi</li>
                        </ul>
                    </div>
                </div>
                <button className="btn btn-dark goToGameButton" onClick={() => { this.goToGame() }}>Go To The Game</button>

                 <button onClick={()=>{this.props.history.push('/sign-in');}} className="btn btn-dark" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                Sign In
              </button>
            </div>
        )
    }
}