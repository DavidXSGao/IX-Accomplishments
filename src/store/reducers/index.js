import { combineReducers } from "redux"
import { routerReducer } from 'react-router-redux'

import user from "./userReducer.js"
import users from "./usersReducer.js"
import accomplishments from "./accomplishmentsReducer.js"

export default combineReducers({
  user,
  users,
  accomplishments,
  router: routerReducer
})