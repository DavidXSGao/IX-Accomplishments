import { applyMiddleware, createStore } from "redux"

import { createLogger } from 'redux-logger'
import thunk from "redux-thunk"
import promise from "redux-promise-middleware"
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import reducer from "./reducers"

const middleware = applyMiddleware(promise(), thunk, createLogger(), routerMiddleware(createHistory()))

export default createStore(reducer, middleware)