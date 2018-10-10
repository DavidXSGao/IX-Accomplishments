/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

import React, { Component } from 'react';
import {
    Route,
    Switch,
    Redirect,
    withRouter
} from 'react-router-dom';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { GoogleLogin } from 'react-google-login';

import {
  Row
} from 'react-bootstrap';

import Header from './components/Header/header.js';
import AppRoutes from './components/Router/router.js';
import NewUser from './components/Create/newUser.js';

import {style} from './CSS/style.js'

import { fetchUser } from "./store/actions/userActions";

function mapStateToProps(store) {
  return {
    user: store.user.user,
  }
}

class App extends Component {
	constructor(props){
    super(props);
    this.state = { notificationSystem: null}
    this.handleSuccessNotification = this.handleSuccessNotification.bind(this);
    this.handleFailNotification = this.handleFailNotification.bind(this);
    this.handleAuth = this.handleAuth.bind(this)
    this.responseGoogle = this.responseGoogle.bind(this);
    this.googleError = this.googleError.bind(this);
  }

  /*
    This function sets the notification system to refer to react-notification-system upon
    rendering the App
  */
  componentDidMount(){
    this.setState({notificationSystem: this.refs.notificationSystem});
  }

  googleError (error) {
    console.log(error)
    this.handleFailNotification("Login has failed.");
  }

  responseGoogle (googleUser) {
    this.props.dispatch(fetchUser(googleUser.profileObj.email))
    this.handleSuccessNotification("You have logged in as " + googleUser.profileObj.email);
  }

  /*
    This function allows a message to be displayed in a green notification pill for 15 seconds
  */
  handleSuccessNotification (message){
    this.state.notificationSystem.addNotification({
      message: (
        <div>
          <b>{message}</b>
        </div>
      ),
      level: 'success',
      position: 'tc',
      autoDismiss: 15
    });
  }

  /*
    This function allows a message to be displayed in a red notification pill for 15 seconds
  */
  handleFailNotification (message){
    this.state.notificationSystem.addNotification({
      message: (
        <div>
          <b>{message}</b>
        </div>
      ),
      level: 'error',
      position: 'tc',
      autoDismiss: 15
    });
  }

  handleAuth (){
    if(this.props.user){
      if (Object.keys(this.props.user).length === 0) {
        return (
          <div className='login-background'>
            <div className='login-container'>
              <Row className="login-body">
                <font color='white' className='login-title'><b>IX ACCOMPLISHMENTS</b></font>
              </Row>
              <Row className="login-body-text">
                <font color='white' className='login-text'>Welcome to Index Exchange's unique and rewarding employee recognition system.</font>
              </Row>
              <Row className="login-body">
                <font color='white' className='login-text'>Please log in using your Google account to continue.</font>
              </Row>
              <Row className="login-body">
                <GoogleLogin
                  clientId="889581760285-1gam2bblej2dqluge80gj64u6cv2hr4h.apps.googleusercontent.com"
                  buttonText="Login Using Google"
                  onSuccess={this.responseGoogle}
                  onFailure={this.googleError}
                  className="google-btn"
                />
              </Row>
              <Row className='login-author-container'>
                <font color='deepskyblue' className='login-author'> BY DAVID</font>
              </Row>
            </div>
          </div>
        );
      } else {
        return(
          <Switch>
            {AppRoutes.map((prop, key) => {
              if (prop.redirect) {
                return <Redirect from={prop.path} to={prop.to} key={key} />;
              }
              return (
                <Route
                  path={prop.path}
                  key={key}
                  render={routeProps => (
                    <prop.component
                      {...routeProps}
                      handleFailNotification={this.handleFailNotification}
                      handleSuccessNotification={this.handleSuccessNotification}
                      dispatch={this.props.dispatch}
                    />
                  )}
                />
              );
            })}
          </Switch>
        );
      }
    } else {
      this.handleSuccessNotification("Please register this new user before continuing.");
      if (window.location.pathname !== '/newuser'){
        this.props.history.push('/newuser')
      }
      return (
        <Switch>
          <Route
            path='/newuser'
            key='newuser'
            render={routeProps => (
              <NewUser
                {...routeProps}
                handleFailNotification={this.handleFailNotification}
                handleSuccessNotification={this.handleSuccessNotification}
                dispatch={this.props.dispatch}
              />
            )}
          />
          </Switch>
      );
    }
  }

  render() {
  	return (
      <div className='wrapper'>
        <NotificationSystem ref='notificationSystem' style={style} />
        <div id='main-panel' className='main-panel'>
          <Header
          {...this.props}
          handleFailNotification={this.handleFailNotification}
          handleSuccessNotification={this.handleSuccessNotification}
          />
          {this.handleAuth()}
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(App));
