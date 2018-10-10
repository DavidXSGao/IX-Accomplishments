/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 * Note: (bug) need to validate parameter
 */

import React, { Component } from 'react';
import {
  Grid,
  FormGroup,
  ControlLabel,
  FormControl,
  Thumbnail,
  Row,
  Col,
  Image,
  DropdownButton,
  MenuItem
} from "react-bootstrap";

// import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

import {Card} from './../Card/card.js';

import { editAccomplishment } from "./../../store/actions/accomplishmentsActions";

const moment = require('moment');

function mapStateToProps(store) {
  return {
    user: store.user.user,
  }
}

class Profile extends Component {
	constructor(props) {
  	super(props);
  	this.state = {username: "", user: {}, recentrecognitions: [], recentrecognized: [], points: 0};
  	this.loadUserFromServer = this.loadUserFromServer.bind(this);
  	this.loadUserRecentRecognitions = this.loadUserRecentRecognitions.bind(this);
  	this.loadUserRecentRecognized = this.loadUserRecentRecognized.bind(this);
    this.handleAccomplishmentDelete = this.handleAccomplishmentDelete.bind(this);
  }

  /*
    This function loads the accomplishments and users upon rendering the component
  */
  componentDidMount() {
  	this.setState({username:this.props.match.params.fullname});
  	this.loadUserRecentRecognitions();
  	this.loadUserRecentRecognized();
  	this.loadUserFromServer();
    setInterval(this.loadUserRecentRecognitions, 5000);
    setInterval(this.loadUserRecentRecognized, 5000);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.username && nextProps.match.params.fullname !== this.state.username) {
      this.setState({username: nextProps.match.params.fullname});
      this.loadUserFromServer();
      this.loadUserRecentRecognitions();
      this.loadUserRecentRecognized();
    }
  }

  /*
      This function grabs the 10 most recent accomplishments that were submitted
  */
  loadUserFromServer() {
    axios.get('http://localhost:9002/api/getuser/'+this.props.match.params.fullname)
    .then(res => {
        this.setState({
            user: res.data[0],
        });
    	document.getElementById("points").value = res.data[0].points
    })
     .catch(function(error) {
        console.log(error); this.props.history.push('/error');
    });
  }

  loadUserRecentRecognitions(){
  	axios.get('http://localhost:9002/api/recentrecognitions/'+this.props.match.params.fullname)
    .then(res => {
        this.setState({
            recentrecognitions: res.data
        });
    })
     .catch(function(error) {
        console.log(error); this.props.history.push('/error');
    });
  }

  loadUserRecentRecognized(){
  	axios.get('http://localhost:9002/api/recentrecognized/'+this.props.match.params.fullname)
    .then(res => {
        this.setState({
            recentrecognized: res.data
        });
    })
    .catch(function(error) {
        console.log(error); this.props.history.push('/error');
    });
  }

  /*
      This function edits an accomplishment if the edits button is pressed
  */
  handleAccomplishmentEdit(accomplishment) {
      this.props.dispatch(editAccomplishment(accomplishment))
      this.props.history.push('/editpost')
  }

  /*
      This function deletes an accomplishment if the delete button is pressed and refreshes the page
  */
  handleAccomplishmentDelete(id) {
    axios.delete('http://localhost:9002/api/accomplishments/'+id)
        .then(res => {
            console.log('The acknowledgement has been deleted');
        })
        .catch(function(error) {
            console.log(error); this.props.history.push('/error');
        });
  }

  /*
    This function transforms the last updated dated stored in MongoDB for each user
    into minutes, hours, days, months from the current time
  */
  Updated(prop){
      return <div className="updated">{moment(prop.updated).fromNow()}</div>;
  }

  displayActionsForUser(accomplishment){
    if(accomplishment.acknowledger === this.props.user.fullName){
        return(
            <Col md={4} className="actions">
                <DropdownButton
                  title={<i className="fa fa-ellipsis-h"></i>}
                  key={1}
                  id={`dropdown-basic-${1}`}
                >
                        <li role="presentation" className="">
                        <div className="edit-button" onClick={
                            this.handleAccomplishmentEdit.bind(this, accomplishment)
                        }>EDIT</div>
                        </li>
                    <MenuItem divider/>
                    <MenuItem
                        eventKey="DELETE"
                        onClick={
                            this.handleAccomplishmentDelete.bind(this, accomplishment._id)
                        }
                    >DELETE</MenuItem>
                </DropdownButton>
            </Col>
        );
    } else if (accomplishment.acknowledged === this.props.user.fullName ){
        return (
            <Col md={4} className="actions">
                <DropdownButton
                  title={<i className="fa fa-ellipsis-h"></i>}
                  key={1}
                  id={`dropdown-basic-${1}`}
                >
                    <MenuItem
                        eventKey="DELETE"
                        onClick={
                            this.handleAccomplishmentDelete.bind(this, accomplishment._id)
                        }
                    >DELETE</MenuItem>
                </DropdownButton>
            </Col>
        );
    } else {
        return null
    }
  }


  renderTable(type) {
  	var accomplishments = [];
  	if (type === "given"){
  		accomplishments = this.state.recentrecognitions;
  	} else {
  		accomplishments = this.state.recentrecognized;
  	}
    let accomplishmentNodes = accomplishments.map((accomplishment, index) => {
      return (
            <tr key={index}>
                <td>
                    <Row>
                        <Col md={8} className="accomplishment">
                            <Row>
                                <Col md={2} className="accomplishment-img">
                                    <Image src={'/images/'+accomplishment.acknowledgedImg} alt={accomplishment.acknowledgedImg} circle/>
                                </Col>
                                <Col md={10} className="accomplishment-header">
                                    <Row>
                                        {/*<NavLink className="accomplishment-user profile accomplishment-acknowledged" style={{clear:'both'}} to={'/profile/'+accomplishment.acknowledged} activeClassName="active">
                                            <b>{accomplishment.acknowledged}</b>
                                        </NavLink>*/}
                                        <b>{accomplishment.acknowledged}</b>
                                    </Row>
                                    <Row>
                                        <Col className="accomplishment-details accomplishment-acknowledger">
                                            Was recognized by&nbsp;
                                            {/*<NavLink className="accomplishment-user profile" style={{clear:'both'}} to={'/profile/'+accomplishment.acknowledger} activeClassName="active">
                                                {accomplishment.acknowledger}
                                            </NavLink>*/}
                                            {accomplishment.acknowledger}
                                        </Col>
                                        <Col className="accomplishment-details accomplishment-updated">
                                            {this.Updated(accomplishment)}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        {this.displayActionsForUser(accomplishment)}
                    </Row>
                    <Row className="accomplishment-message">
                        {accomplishment.message}
                    </Row>
                    <Row className="accomplishment-buttons">
                        <button className="pull-left btn accomplishment-button">
                            {accomplishment.department}
                        </button>
                        {/*<button className="pull-right btn">
                            Comments
                        </button>
                        <button className="pull-right btn accomplishment-button">
                            <i className="fa fa-thumbs-up"></i>
                        </button>*/}
                    </Row>
                </td>
            </tr>
          );
    });
    return (
    	<table style={{width:'100%'}}>
        <tbody>
            {accomplishmentNodes}
        </tbody>
    	</table>
    );
  }

  render() {
    return (
    <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={12}>
              <Card
                title={this.state.username}
                content={
                  <form>
                  	<Row>
	                  	<Thumbnail className="user-thumbnail" src={'/images/'+this.state.user.image} alt={this.state.username} style={{width:'10%', display: 'block', marginLeft:'auto', marginRight:'auto', paddingTop:'1%', paddingBottom:'1%'}}>
	                    </Thumbnail>
                  	</Row>
                  	<Row className="user-description" >
	                  	<FormGroup
                        controlId="points"
                      >
                  		<ControlLabel>Points</ControlLabel>
                      <FormControl
                        bsClass="form-control"
                        type="text"
                        placeholder="Points"
                        onChange={this.handleChange}
                        disabled
                      />
                      </FormGroup>
                  	</Row>
                  	<Row>
                  		<Col md={6}>
                  			<Row className="not-sticky-58">
		                  		<Card
		                  			title="Recently Received"
		                				content={this.renderTable("received")}
		                			/>
	                			</Row>
                  		</Col>
                  		<Col md={6}>
                  			<Row className="not-sticky-58">
		                  		<Card
		                  			title="Recently Given"
		                				content={this.renderTable("given")}
		                			/>
	                			</Row>
                  		</Col>
                  	</Row>
                  </form>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Profile));
