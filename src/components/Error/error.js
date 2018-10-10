import React, { Component } from 'react';
import {
    Row
} from 'react-bootstrap';

export class ErrorPage extends Component{
  render () {
  	return (
  		<div className='login-background'>
            <div className='login-container'>
              <Row className="login-body">
                <font color='white' className='login-title'><b>IX ACCOMPLISHMENTS - ERROR</b></font>
              </Row>
              <Row className="login-body-text">
                <font color='white' className='login-text'>Service is unavailable.</font>
              </Row>
            </div>
        </div>
  	);
  }
}

export default ErrorPage;
