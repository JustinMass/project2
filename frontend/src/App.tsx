import * as React from 'react';
import './include/bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Store';
import { GameCanvasComponent } from './components/game-canvas/game-canvas.component';
import { HomeComponent } from './components/home/home.component';
import  SignInComponent  from './components/sign-in/sign-in.component';




class App extends React.Component {

  public componentDidMount() {
    document.title = "Drawctopus";
  }
  public render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
            <div id="main-content-container">
              <Switch>
                <Route path="/sign-in" component={SignInComponent} />
                <Route path="/game" component={GameCanvasComponent} />
                <Route component={HomeComponent} />
              </Switch>
            </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
