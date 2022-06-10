import { serverPath } from "../../config";

export const register = (user) => {
  return async (dispatch, getState) => {
    if (user.name && user.email && user.username && user.password) {
      const {name,email,username,password} = user;
      const response = await fetch(serverPath+"/register",
        {method: "POST", credentials:"include", headers: {"Content-Type":"application/json"}, body:JSON.stringify({name,email,username,password})});
   //   const jsonResponse = await response.json();
      dispatch({type: 'auth/register'});//, payload: jsonResponse});
    }
  }
};

export const login = (username,password) => {
  return async (dispatch, getState) => {
    const reqBody = JSON.stringify({username,password});
    const response = await fetch(serverPath+"/login",
      {method: "POST", credentials:"include", headers: {"Content-Type":"application/json", "Connection": "keep-alive"}, body:reqBody});
    const jsonResponse = await response.json();
    dispatch({type: 'auth/login', payload: jsonResponse});
  }
};

export const checkLogin = () => {
  return async (dispatch, getState) => {
    const response = await fetch(serverPath+"/user", {credentials:"include"});
    if (response.ok) {
      const jsonResponse = await response.json();
      dispatch({type: 'auth/checkLogin', payload: jsonResponse});
    } else {
      dispatch({type: 'auth/checkLogin', payload: {message:""}});
    }
  }
};

export const getUserAccount = (username) => {
  return async (dispatch, getState) => {
    const response = await fetch(serverPath+"/user/"+username, {credentials:"include"});
    if (response.ok) {
      const jsonResponse = await response.json();
      dispatch({type: 'auth/getUserAccount', payload: jsonResponse});
    }
  }
};

export const logout = () => {
  return async (dispatch, getState) => {
    await fetch(serverPath+"/logout", {credentials:"include"});
    dispatch({type:"auth/logout"});
  }
};

export function selectAuth(state) {return state.auth};
