/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import {
    Route,
    Switch} from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import store from "./store/store.js"
import App from './App';

import './CSS/bootstrap.css';
import './CSS/dashboard-bootstrap.css';

import registerServiceWorker from './registerServiceWorker';

const history = createHistory()

ReactDOM.render((
	<Provider store={store}>
	    <ConnectedRouter history={history}>
	    	<Switch>
            	<Route path="/" name="Home" component={App}/>
            </Switch>
	    </ConnectedRouter>
    </Provider>
), document.getElementById('root'));

registerServiceWorker();
