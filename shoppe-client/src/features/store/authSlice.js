import { createSlice } from '@reduxjs/toolkit';

const authOptions = {
  name: "auth",
  initialState: {login:false},
  reducers: {
    register:(auth,action) => {
      return {login:false};
    },
    login:(auth,action) => {
      if (action.payload.message === "AUTHENTICATED") {
        auth.login = true;
        auth.username = action.payload.username;
        auth.name = action.payload.name;
      } else return {login:false};
    },
    checkLogin:(auth,action) => {
      if (action.payload.message === "AUTHENTICATED" && action.payload.username === auth.username) {
        auth.login = true;
      } else return {login:false};
    },
    getUserAccount:(auth,action) => {
      return {login:true, ...action.payload};
    },
    logout:(auth,action) => {
      return {login:false};
    }
  }
}

export const authSlice = createSlice(authOptions);