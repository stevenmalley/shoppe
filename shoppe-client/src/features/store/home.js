export const retrieveWelcome = () => {
  return async (dispatch, getState) => { // thunk receives dispatch and getState methods
    const response = await fetch("http://localhost:8080");
    const jsonResponse = await response.json();
    dispatch({type: 'home/welcomeMessage', payload: jsonResponse});
  }
}

export function selectHome(state) {return state.home};


/*
import { createAsyncThunk } from '@reduxjs/toolkit';

export const retrieveWelcome = createAsyncThunk(
  'home/welcomeMessage',
  async (arg, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:8080");
      const jsonResponse = await response.json();
      console.log(jsonResponse.message);
      return jsonResponse.message;
    } catch(err) {
      throw err;
    }
  }
);
*/
