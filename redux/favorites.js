import * as ActionTypes from './ActionTypes';

export const FAVORITES_LOADING = 'FAVORITES_LOADING';
export const ADD_FAVORITE = 'ADD_FAVORITE';
export const FAVORITES_FAILED = 'FAVORITES_FAILED';

// add other reducers
export const favorites = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_FAVORITE:
      if (state.includes(action.payload)) {
        return state;
      }
      return state.concat(action.payload);

    case ActionTypes.DELETE_FAVORITE:
      return state.filter((favorite) => favorite !== action.payload);

    default:
      return state;
  }
};
