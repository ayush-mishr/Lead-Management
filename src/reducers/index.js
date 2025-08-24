import { combineReducers } from "@reduxjs/toolkit"
import auth  from "../slices/auth"
import profile from "../slices/profile"



const rootReducer = combineReducers({
  auth: auth,
    profile: profile,
})

export default rootReducer;
