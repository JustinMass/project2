import { combineReducers } from "redux";
import { signInReducer } from "./sign-in.reducer";
import { gameCanvasReducer } from "./game-canvas.reducer";



export interface ISignInState {
  credentials: {
    password: string,
    username: string
  },
  errorMessage: string
}

export interface IGameCanvasState {
    user: {
      id: number,
      password: string,
      points: number,
      upgrades: [{
        userUpgradeId: number,
        userId: number,
        upgrade: string
      }],
      username: string
    }
}

export interface IState {
  signIn: ISignInState,
  gameCanvas: IGameCanvasState
}

export const state = combineReducers<IState>({
  gameCanvas: gameCanvasReducer,
  signIn: signInReducer
})