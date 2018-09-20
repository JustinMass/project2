import { IGameCanvasState } from ".";
import { gameCanvasTypes } from "../actions/game-canvas/game-canvas.actions";


const initialState: IGameCanvasState = {
    user: {
      id: 0,
      password: '',
      points: 0,
      upgrades: [{
        upgrade: '',
        userId: 0,
        userUpgradeId: 0,              
      }],
      username: ''
    }
}

export const gameCanvasReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case gameCanvasTypes.UPDATE_USER:
        return {
          ...state,
          user: action.payload.user
        }
    }
  
    return state;
  }