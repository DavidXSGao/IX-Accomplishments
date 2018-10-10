/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

import React, { Component } from 'react';
import axios from "axios";
import {
	HelpBlock,
	FormControl,
	FormGroup,
	Button,
	Modal,
    Row,
    Col,
    Image,
    DropdownButton,
    MenuItem
} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
const moment = require('moment');

export class CustomAccomplishmentsModal extends Component{
	constructor(props) {
	    super(props);
	    this.state = { departments: [], department: "All", data: [] }
        this.loadDataFromDepartmentsFromServer = this.loadDataFromDepartmentsFromServer.bind(this);
	}

	componentDidMount() {
    	this.loadDepartmentsFromServer();
    	this.loadDataFromDepartmentsFromServer();
	}

	/*
        This function deletes an accomplishment if the delete button is pressed and refreshes the page
    */
    handleAccomplishmentDelete(id) {
        axios.delete('http://localhost:9002/api/accomplishments/'+id)
            .then(res => {
                console.log('The acknowledgement has been deleted');
            })
            .catch(err => {
      			console.log(err); this.props.history.push('/error')
 			});


    }

	loadDepartmentsFromServer() {
	    axios
	    .get("http://localhost:9002/api/departments")
	    .then(res => {
	        this.setState({
	        	departments: ["All", ...res.data.sort()]
	        });
	    })
	    .catch(function(error) {
	        console.log(error); this.props.history.push('/error');
	    });
	}

	loadDataFromDepartmentsFromServer() {
	    if (this.props.category === "Most Received Recognitions"){
	    	axios
		    .get("http://localhost:9002/api/mostrecognized/"+this.state.department)
		    .then(res => {
		        this.setState({
		        	data: res.data
		        });
		    })
		    .catch(function(error) {
				console.log(error); this.props.history.push('/error');
		    });
	    } else if (this.props.category === "Most Given Recognitions"){
	    	axios
		    .get("http://localhost:9002/api/mostrecognitions/"+this.state.department)
		    .then(res => {
		        this.setState({
		        	data: res.data
		        });
		    })
		    .catch(function(error) {
		        console.log(error); this.props.history.push('/error');
		    });
	    } else {
	    	axios
		    .get("http://localhost:9002/api/recentaccomplishments/"+this.state.department)
		    .then(res => {
		        this.setState({
		        	data: res.data
		        });
		    })
		    .catch(function(error) {
				console.log(error); this.props.history.push('/error');
		    });
	    }
	}
	/*
	    This function validates the input in the department form group
	    and returns "success" which is needed for react-boostrap if the input is valid
	    and "error" if it is not
	*/
	validateDepartment() {
	    if (this.state.department === "") {
	    	return null;
	  	}
	  	if (document.getElementById("modal-department")) {
	    	if (!this.state.departments.includes(this.state.department)) {
	      		return "error";
	    	}
	  	}
	  	return "success";
	}

	/*
    	This function returns a datalist with all the options being the departments of the users
  	*/
  	AutoCompleteDepartments() {
    	const departments = this.state.departments;
    	const listItems = departments.map((department, index) => (
      		<option key={index}>{department}</option>
    	));
    	return <datalist id="dlAutoCompleteDepartments">{listItems}</datalist>;
  	}


  	/*
    	This function handles input in the department form group and will filter recipients
    	if a valid department is inputted
  	*/
	handleDepartmentInput(event) {
	    if (document.getElementById("modal-department").value) {
	    	this.setState(
	        { department: document.getElementById("modal-department").value },
	        function() {
	          if (this.state.departments.indexOf(this.state.department) !== -1) {
	            this.loadDataFromDepartmentsFromServer();
	          }
	        }
	      );
	    }
	}

	clearFilter() {
		document.getElementById("modal-department").value = "";
		this.setState(
        	{ department: "All" }
      	);
        this.loadDataFromDepartmentsFromServer();
	}

	/*
        This function transforms the last updated dated stored in MongoDB for each user
        into minutes, hours, days, months from the current time
    */
    Updated(prop){
    	if (prop.acknowledged){
        	return <div className="updated">{moment(prop.updated).fromNow()}</div>;
    	} else {
        	return <td className="updated">{moment(prop.updated).fromNow()}</td>;
    	}
    }

	renderCorrespondingData() {
	    if (this.props.category === "Most Received Recognitions"){
	    	let accomplishmentNodes = this.state.data.map((user, index) => {
	          return (
	            <tr key={index}>
	                <td>{index+1}</td>
	                <td>
                        <NavLink className="accomplishment-user profile" style={{clear:'both'}} to={'/profile/'+user.fullName} activeClassName="active">
	                		{user.fullName}
	                	</NavLink>
	                </td>
            		<td>{user.received}</td>
	                {this.Updated(user)}
	            </tr>
	          );
	        });
	        return (
	            <tbody>
	            <tr>
	                <th>Rank</th>
	                <th>User</th>
	                <th>Recognitions</th>
	                <th className="updated">Last Received</th>
	            </tr>
	                {accomplishmentNodes}
	            </tbody>
	        );
	    } else if (this.props.category === "Most Given Recognitions"){
	    	let accomplishmentNodes = this.state.data.map((user, index) => {
	          return (
	            <tr key={index}>
	                <td>{index+1}</td>
	                <td>
	                	<NavLink className="accomplishment-user profile" style={{clear:'both'}} to={'/profile/'+user.fullName} activeClassName="active">
	                		{user.fullName}
	                	</NavLink>
	                </td>
            		<td>{user.given}</td>
	                {this.Updated(user)}
	            </tr>
	          );
	        });
	        return (
	            <tbody>
	            <tr>
	                <th>Rank</th>
	                <th>User</th>
	                <th>Recognitions</th>
	                <th className="updated">Last Given</th>
	            </tr>
	                {accomplishmentNodes}
	            </tbody>
	        );
	    } else {
	    	let accomplishmentNodes = this.state.data.map((accomplishment, index) => {
	          return (
	            <tr key={index}>
	                <td>
	                    <Row>
	                        <Col md={8}>
	                            <Col md={2}>
	                                <Image src={'/images/'+accomplishment.acknowledgedImg} alt={accomplishment.acknowledgedImg} circle/>
	                            </Col>
	                            <Col md={10}>
	                                <Row>
	                                    <NavLink className="accomplishment-user profile" style={{clear:'both'}} to={'/profile/'+accomplishment.acknowledged} activeClassName="active">
	                                        {accomplishment.acknowledged}
	                                    </NavLink>
	                                </Row>
	                                <Row>
	                                    <Col md={5} className="accomplishment-details">
	                                        Was recognized by&nbsp;
	                                        <NavLink className="accomplishment-user profile" style={{clear:'both'}} to={'/profile/'+accomplishment.acknowledger} activeClassName="active">
	                                            {accomplishment.acknowledger}
	                                        </NavLink>
	                                    </Col>
	                                    <Col md={4}className="accomplishment-details">
	                                        {this.Updated(accomplishment)}
	                                    </Col>
	                                </Row>
	                            </Col>
	                        </Col>
	                        <Col md={4} className="actions">
	                             <DropdownButton
	                              title={<i className="fa fa-ellipsis-h"></i>}
	                              key={1}
	                              id={`dropdown-basic-${1}`}
	                            >
	                                <NavLink to={'/editpost/'+accomplishment._id+"/"+accomplishment.acknowledger+"/"+accomplishment.department+"/"+accomplishment.acknowledged+"/"+accomplishment.message+"/"+accomplishment.acknowledgerImg+"/"+accomplishment.acknowledgedImg} className="nav-link" activeClassName="active">
	                                    <li role="presentation" className="">
	                                    <div className="edit-button">EDIT</div>
	                                    </li>
	                                </NavLink>
	                                <MenuItem divider/>
	                                <MenuItem
	                                    eventKey="DELETE"
	                                    onClick={
	                                        this.handleAccomplishmentDelete.bind(this, accomplishment._id)
	                                    }
	                                >DELETE</MenuItem>
	                            </DropdownButton>
	                        </Col>
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
	            <tbody>
	                <tr key="titles">
	                    <th className="recognizer user-col">Post</th>
	                </tr>
	                {accomplishmentNodes}
	            </tbody>
	        );
	    }
	}
	render(){
        return (
        	<Modal
                show={this.props.show}
                onHide={this.props.handleHide}
                dialogClassName="custom-modal"
                bsSize="large"
        		aria-labelledby="contained-modal-title-lg"
                >
                	<Modal.Header closeButton>
                    	<Modal.Title id="contained-modal-title-lg">
	                      	{this.props.category}

	                    </Modal.Title>
	                </Modal.Header>
	                <Modal.Body>
	                <i className="fa fa-times clear-input" aria-hidden="true" onClick={this.clearFilter.bind(this)}/>
	                     	<FormGroup
	                          controlId="modal-department"
	                          validationState={this.validateDepartment()}
	                          style={{float:"right", paddingRight:5}}
	                        >
	                        	<FormControl
	                            	bsClass="form-control"
	                            	list="dlAutoCompleteDepartments"
		                            type="text"
		                            placeholder="Departments"
		                            onChange={this.handleDepartmentInput.bind(this)}
		                        />
	                          	{this.AutoCompleteDepartments()}
	                          	<HelpBlock>Please enter a valid department</HelpBlock>
	                        </FormGroup>
	                	<table className="table">
	                		{this.renderCorrespondingData()}
	                	</table>
	                </Modal.Body>
	                <Modal.Footer>
	                	<Button onClick={this.props.handleHide}>Close</Button>
	                </Modal.Footer>
                </Modal>
        );
    }
}

export default CustomAccomplishmentsModal;