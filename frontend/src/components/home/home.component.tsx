import * as React from 'react';
import { RouteComponentProps } from 'react-router';

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
                    <div className="col homeScreen">
                    <h1 className="text-white text-center font-weight-bold">Welcome to Our Crappy Draw Game</h1>
                    <br/>
                    <ul>
                        <li className="text-white infoList">Join a lobby</li>
                        <li className="text-white infoList">Draw the specified object within the time limit</li>
                        <li className="text-white infoList">Vote whose drawing was the best</li>
                        <li className="text-white infoList">Accumulate points by gettin' votes</li>
                        <li className="text-white infoList">Spend points to buy upgrades</li>
                        <li className="text-white infoList">Become the greatest web artist known to man</li>
                    </ul>
                        <button className="btn btn-dark goToGameButton" onClick={() => { this.goToGame() }}>Go To The Game</button>
                    </div>
                </div>
            </div>
        )
    }
}