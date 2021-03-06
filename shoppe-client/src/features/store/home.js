import serverPath from '../../serverPath';

export const retrieveWelcome = () => {
  return async (dispatch, getState) => { // thunk receives dispatch and getState methods
    const response = await fetch(serverPath+"/home");
    const jsonResponse = await response.json();
    dispatch({type: 'home/welcomeMessage', payload: jsonResponse});
  }
};

export function selectHome(state) {return state.home};