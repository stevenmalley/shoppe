import { createSlice } from '@reduxjs/toolkit';

const homeOptions = {
    name: "home",
    initialState: {
      message: "WELCOME"
    },
    reducers: {welcomeMessage:(home,action) => {home.message = action.payload.message}}
  }
  export const homeSlice = createSlice(homeOptions);