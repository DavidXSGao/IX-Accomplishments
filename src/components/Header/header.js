/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { GoogleLogout } from 'react-google-login';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import { fetchUser, userLogout } from "./../../store/actions/userActions";

function mapStateToProps(store) {
  return {
    user: store.user.user,
    userEmail: store.user.userEmail
  }
}

class Header extends Component{
  constructor(props){
	  super(props);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.googleError = this.googleError.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  googleError (error) {
    console.log(error)
    this.props.handleFailNotification("Login has failed.");
  }

  responseGoogle (googleUser) {
    this.props.dispatch(fetchUser(googleUser.profileObj.email))
    this.props.handleSuccessNotification("You have logged in as " + googleUser.profileObj.email);
  }

  handleAuth (){
    if ((this.props.user && Object.keys(this.props.user).length !== 0) || this.props.userEmail) {
      return(
        <div className="google-btn-container">
          <GoogleLogout
            buttonText="Logout"
            onLogoutSuccess={this.handleLogout}
            className="google-logout-btn"
          />
        </div>
      );
    }
  }

  handleLogout (){
      if (window.gapi) {
          const auth2 = window.gapi.auth2.getAuthInstance()
          if (auth2 != null) {
              auth2.signOut().then(
                  auth2.disconnect().then(
                    this.props.handleSuccessNotification("We hope you come back soon!")
                  )
              )
          }
      }
      this.props.dispatch(userLogout())
  }

  renderProfile(){
    if (this.props.user && Object.keys(this.props.user).length !== 0) {
      return (
        <NavLink to={"/profile/" + this.props.user.fullName} className="pull-right profile" activeClassName="active">
          <button className="pull-right btn profile-btn">
            Profile
          </button>
      </NavLink>
      );
    } else {
      return null
    }
  }

  render(){
    return (
      <Navbar fluid>
        <Navbar.Header>
          <NavLink to="/dashboard" className="navbar-title" activeClassName="non-active">
            <img src='/images/index-exchange_owler_20170206_200022_original.jpg' alt='IX-Logo' className='IX-Logo' />
            IX Accomplishments
          </NavLink>
          {/*<NavLink to="/about" className="pull-right about" activeClassName="active">
            <button className="pull-right btn about-btn">
              About
            </button>
          </NavLink>*/}
          {/*<NavLink to="/rewards" className="pull-right rewards" activeClassName="active">
            <button className="pull-right btn rewards-btn">
              Rewards
            </button>
          </NavLink>*/}
          <NavLink to="/newuser" className="pull-right new-user" activeClassName="active">
            <button className="pull-right btn new-user-btn">
              New User
            </button>
          </NavLink>
          {/*<NavLink to="/leaderboard" className="pull-right leaderboard" activeClassName="active">
            <button className="pull-right btn leaderboard-btn">
              Leaderboard
            </button>
          </NavLink>*/}
          {this.renderProfile()}
          <NavLink to="/dashboard" className="pull-right dashboard" activeClassName="active">
            <button className="pull-right btn dashboard-btn">
              Dashboard
            </button>
          </NavLink>
          {this.handleAuth()}
        </Navbar.Header>
        <Navbar.Collapse>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Header));
