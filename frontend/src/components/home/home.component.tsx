import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import logo from '../../assets/octoArtistTransparent-shadow.png'

interface IProps extends RouteComponentProps<{}> {

}

export class HomeComponent extends React.Component<IProps, {}> {

    public goToGame = () => {
        this.props.history.push('/game');
    }

    public componentDidMount() {
       $('body').css('backgroundImage', `url(), radial-gradient(ellipse at center, rgba(69,72,77,1) 0%,rgba(0,0,0,1) 100%)`);
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
                    <div className="col homeElement">
                    <img src={logo} className="homeElement" alt="octopus" id="DrawctopusLogo"></img>
                    </div>
                    <div className="infoListContainer col-6">
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
                <button className="btn btn-dark goToGameButton" onClick={() => { this.goToGame() }}>Join Match As A Guest</button>

                 <button onClick={()=>{this.props.history.push('/sign-in');}} className="btn btn-dark signInHomeButton" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                Sign In
              </button>
            </div>
        )
    }
}