import * as React from 'react';
import './include/bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Store';
// import { HomeComponent } from './components/home/home.component';
import { GameCanvasComponent } from './components/game-canvas/game-canvas.component';
import { Chat } from './components/chat/chat';
import { HomeComponent } from './components/home/home.component';



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
                {/* <Route path="/register" component={RegisterComponent} />
                <Route path="/second" component={SecondComponent} />
                <Route path="/home" component={HomeComponent} />
                <Route path="/sign-in" component={SignInComponent} />
                <Route path="/clicker" component={ClickerComponent} />
                <Route path="/tic-tac-toe" component={TicTacComponent} />
                <Route path="/chuck-norris" component={ChuckNorrisComponent} />
                <Route path="/pokemon" component={PokemonComponent} />
                <Route path="/movies" component={MoviesComponent} />
                <Route path="/nested" component={NestedComponent} /> */}
                <Route path= "/chat" component={Chat} /> 
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
