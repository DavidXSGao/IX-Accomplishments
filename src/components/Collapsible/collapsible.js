/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

import React, { Component } from 'react';
import {
  Row,
  Col,
  Panel,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Thumbnail
} from 'react-bootstrap';
import axios from "axios";
import { NavLink } from 'react-router-dom';

import presetMessages from './../../data/presetMessages.js'


// these are the initial state of the form before being submitted, to make resetting the form easier
const initialState = {
      departments: [],
      users: [],
      department: "",
      filteredUsers: [],
      acknowledger: "",
      recipient: "",
      description: "",
      chosenRecipientImg: "",
      accomplishmentID: "",
      open: false
    };

export class Collapsible extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.loadDepartmentsFromServer = this.loadDepartmentsFromServer.bind(this);
    this.loadUsersFromServer = this.loadUsersFromServer.bind(this);
    this.loadUsersFromDepartmentsFromServer = this.loadUsersFromDepartmentsFromServer.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  /*
    This function loads the accomplishments and users upon rendering the component
  */
  componentDidMount() {
    this.loadDepartmentsFromServer();
    this.loadUsersFromServer();
    this.setState({acknowledger: this.props.user.fullName});
  }

  /*
    This function calls the server to get a list of all the departments that have users in MongoDB
  */
  loadDepartmentsFromServer() {
    axios
      .get("http://localhost:9002/api/departments")
      .then(res => {
        this.setState({
          departments: res.data.sort()
        });
      })
      .catch(err => {
          console.log(err); this.props.history.push('/error')
      });
  }

  /*
    This function calls the server to get a list of the full names of the users stored in mongoDB
  */
  loadUsersFromServer() {
    axios
      .get("http://localhost:9002/api/fullNames")
      .then(res => {
        this.setState({
          users: res.data
        });
      })
     .catch(err => {
        console.log(err); this.props.history.push('/error')

      });
  }

  /*
    This function calls the server to get a list of users given the department

    @params
      department - a valid department that has at least one user that belongs to it
  */
  loadUsersFromDepartmentsFromServer(department) {
    axios
      .get("http://localhost:9002/api/usersfromdepartment/" + department)
      .then(res => {
        this.setState({
          filteredUsers: res.data
        });
      })
     .catch(err => {
          console.log(err); this.props.history.push('/error')

      });
  }

  /*
    This function calls the server to get the department of the given user
    @params
      user - a valid user that has a corresponding department
  */
  loadDepartmentFromUserFromServer(user) {
    axios
      .get("http://localhost:9002/api/departmentfromuser/" + user)
      .then(res => {
        this.setState({
          departments: [res.data[0].department],
          department: res.data[0].department
        });
        document.getElementById("department").value = res.data[0].department
      })
     .catch(err => {
          console.log(err); this.props.history.push('/error')

      });
  }

  /*
    This function calls the server to get the image name of the user
    @params
      recipient - a valid user that has a corresponding image
  */
  loadImageFromRecipientFromServer(recipient) {
    axios
      .get("http://localhost:9002/api/imagefromuser/" + recipient)
      .then(res => {
        this.setState({
          chosenRecipientImg: res.data[0].image,
        });
      })
     .catch(err => {
          console.log(err); this.props.history.push('/error')

      });
  }

  /*
    This function returns a datalist with all the options being the full names of the users
  */
  AutoCompleteUsers() {
    const users = this.state.users;
    const listItems = users.map((user, index) => (
      <option key={index}>{user.fullName}</option>
    ));
    return <datalist id="dlAutoCompleteUsers">{listItems}</datalist>;
  }

  /*
    This function returns a datalist with all the options being the full names of the users
    filteredUsers are users that belong to a specified department
  */
  AutoCompleteRecipients() {
    var users = [];
    if (this.state.filteredUsers.length === 0) {
      users = this.state.users;
    } else {
      users = this.state.filteredUsers;
    }
    const listItems = users.map((user, index) => (
      <option key={index}>{user.fullName}</option>
    ));
    return <datalist id="dlAutoCompleteRecipients">{listItems}</datalist>;
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
    This function returns a datalist with all the options being preset messages for users to choose from
  */
  AutoCompleteMessages() {
    const listItems = presetMessages.map((message, index) => (
      <option key={index}>{message}</option>
    ));
    return <datalist id="dlAutoCompleteMessages">{listItems}</datalist>;
  }

  /*
    This function handles input in the department form group and will filter recipients
    if a valid department is inputted
  */
  handleDepartmentInput(event) {
    var input = document.getElementById("department").value;
    if (input) {
      this.setState(
        { department: input },
        function() {
          if (this.state.departments.indexOf(this.state.department) !== -1) {
            this.loadUsersFromDepartmentsFromServer(this.state.department);
          }
        }
      );
    } else {
      this.setState({department: "", filteredUsers:[]});
    }
  }

  /*
    This function handles input in the acknowledger form group and will display an image of the
    acknowledger if a valid user is inputted
  */
  handleAcknowlegerInput(event) {
    var input = document.getElementById("acknowledger").value;
    if (input) {
      this.setState({
        acknowledger: input
      });
    } else {
      this.setState({
        acknowledger: ""
      });
    }
  }

  /*
    This function handles input in the acknowledger form group and will filter the departments
    if a valid user is inputted
  */
  handleRecipientInput(event) {
    var input = document.getElementById("recipient").value;
    if (input) {
      this.setState({
        recipient: input
       },
        function() {
          if (this.state.users.some(function(user) {
              return user.fullName === input;
            })
          ) {
            this.setState({
              filteredUsers: [{fullName: input}]
            });
            if (this.state.departments.indexOf(this.state.departments) === -1) {
              this.loadDepartmentFromUserFromServer(this.state.recipient);
            }
            this.loadImageFromRecipientFromServer(this.state.recipient);
          }else {
			      this.setState({chosenRecipientImg: "", filteredUsers: []});
            if (this.state.departments.indexOf(this.state.departments) === -1) {
              document.getElementById("department").value = "";
              this.loadDepartmentsFromServer();
            }
          }
        }
      );
    } else {
      this.setState({
        recipient: "",
        filteredUsers: [],
        chosenRecipientImg: ""
      });
      this.loadDepartmentsFromServer();
      if (!this.state.departments.indexOf(this.state.departments)) {
        document.getElementById("department").value = "";
      }
    }
  }

  /*
    This function handles input in the description form group
  */
  handleDescriptionInput(event) {
    if (document.getElementById("description").value) {
      this.setState({
        description: document.getElementById("description").value
      });
    } else {
      this.setState({
        description: ""
      });
    }
  }

  /*
    This function handles preset input in the description form group
  */
  handlePresetInput(event) {
    if (document.getElementById("presetMessages").value) {
      this.setState({
        description: document.getElementById("description").value.concat(" ")
      });
      this.setState({
        description: document.getElementById("description").value.concat(document.getElementById("presetMessages").value)
      });
      document.getElementById("description").value = document.getElementById("description").value.concat(" ");
      document.getElementById("description").value = document.getElementById("description").value.concat(document.getElementById("presetMessages").value);
      document.getElementById("presetMessages").value = "";
    }
  }

  /*
    This function validates the input in the acknowledger form group
    and returns "success" which is needed for react-boostrap if the input is valid
    and "error" if it is not
  */
  validateAcknowledger() {
    var acknowledger = this.state.acknowledger;
    if (acknowledger === "") {
      return null;
    }
    if (document.getElementById("acknowledger")) {
      if (
        !this.state.users.some(function(user) {
          return user.fullName === acknowledger;
        })
      ) {
        return "error";
      }
    }
    return "success";
  }

  /*
    This function validates the input in the recipient form group
    and returns "success" which is needed for react-boostrap if the input is valid
    and "error" if it is not
  */
  validateRecipient() {
    var recipient = this.state.recipient;
    if (recipient === "") {
      return null;
    }
    if (document.getElementById("recipient")) {
      if (this.state.filteredUsers.length > 0) {
        if (!this.state.filteredUsers.some(function(user) {
            return user.fullName === recipient;
          })
        ) {
          return "error";
        }
      } else {
        if (!this.state.users.some(function(user) {
            return user.fullName === recipient;
          })
        ) {
          return "error";
        }
      }
    }
    return "success";
  }

  /*
    This function validates the input in the description form group
    and returns "success" which is needed for react-boostrap if the input is valid
    and "error" if it is not
  */
  validateDescription() {
    if (this.state.description === "") {
      return null;
    }
    if (document.getElementById("description")) {
      if (document.getElementById("description").value.includes('?')) {
        return "error";
      } else if (document.getElementById("description").value.includes('/')) {
        return "error";
      }
    }
    return "success";
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
    if (document.getElementById("department")) {
      if (!this.state.departments.includes(this.state.department)) {
        return "error";
      }
    }
    return "success";
  }

  previewAcknowledgerName (){
    var validAcknowledger = this.validateAcknowledger();
    if(validAcknowledger === "success"){
  		return (
  			<NavLink className="accomplishment-user profile" style={{clear:'both'}} to={'/profile/'+this.state.acknowledger} activeClassName="active">
          {this.state.acknowledger}
        </NavLink>
  		)
  	} else {
  		return "Your Name"
  	}
  }

  previewRecipient (){
    var validRecipient = this.validateRecipient();
    if(validRecipient === "success"){
  		return (
  			<Thumbnail className="user-thumbnail preview-recipient" src={'/images/'+this.state.chosenRecipientImg} alt={this.state.chosenRecipientImg} >
        	<NavLink className="accomplishment-user profile recipient-caption" style={{clear:'both'}} to={'/profile/'+this.state.recipient} activeClassName="active">
              {this.state.recipient}
          </NavLink>
        </Thumbnail>
  		)
  	} else {
  		return (
  			<Thumbnail className="user-thumbnail preview-recipient" src={'/images/abstract-user-flat-3.png'} alt="Anonymous" >
          Recipient
        </Thumbnail>
  		)
  	}
  }

  previewDesciption (){
    var validDescription = this.validateDescription();
    if(validDescription === "success"){
  		return this.state.description
  	} else {
  		return "Description"
  	}
  }

  /*
    This function validates every field, makes sure every field is valid, and if every field is
    creates the accomplishment and resets the fields to the default, otherwise corresponding
    notifications will be provided
  */
  handleSubmit(event) {
    event.preventDefault();
    var validAcknowledger = this.validateAcknowledger();
    var validRecipient = this.validateRecipient();
    var validDepartment = this.validateDepartment();
    var validDescription = this.validateDescription();
    var validRecipientImg = this.state.chosenRecipientImg !== "";

    var valid =
      validAcknowledger === "success" &&
      validRecipient === "success" &&
      validDepartment === "success" &&
      validDescription === "success" &&
      validRecipientImg;

    if (valid === true) {
      axios
        .post("http://localhost:9002/api/accomplishments", {
          acknowledger: this.state.acknowledger,
          department: this.state.department,
          acknowledged: this.state.recipient,
          acknowledgedImg: this.state.chosenRecipientImg,
          message: this.state.description
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(err => {
            console.log(err); this.props.history.push('/error')
        });
      this.props.handleSuccessNotification("Thank You For Your Submission!");
      this.setState(initialState)
      this.setState({acknowledger: this.props.user.fullName});
      document.getElementById("recipient").value = "";
      document.getElementById("department").value = "";
      document.getElementById("description").value = "";
      this.loadDepartmentsFromServer();
      this.loadUsersFromServer();
    }else{
      var field = "";
      if (validAcknowledger !== "success" ){
        field = "your name";
      } else if (validDepartment !== "success" ){
        field = "the recipient's department";
      } else if (validRecipient !== "success" ){
        field = "the recipient's name";
      } else {
        field = "the description";
      }
      this.props.handleFailNotification("Please review "+ field + ".");
    }
  }

  handleCancel() {
    if(document.getElementById("acknowledger")){
      document.getElementById("acknowledger").value = "";
    }
    if(document.getElementById("recipient")){
      document.getElementById("recipient").value = "";
    }
    if(document.getElementById("department")){
      document.getElementById("department").value = "";
    }
    if(document.getElementById("description")){
      document.getElementById("description").value = "";
    }
    this.setState(initialState);
  }
  render() {
    /*
      This page is also used to edit acknowledgments
    */
    var departmentPlaceholder = "";
    var recipientPlaceholder = "";
    var descriptionPlaceholder = "";

    /*
      If parameters are passed into the page, auto fill the collapsible with the parameters
    */
    /*if (Object.keys(this.props.match.params).length === 7){
      departmentPlaceholder = this.props.match.params.department;
      recipientPlaceholder = this.props.match.params.acknowledged;
      descriptionPlaceholder = this.props.match.params.message;
    }*/
	  return (
	  	<Panel eventKey="newpost" expanded={this.state.open} onToggle={() => {}}>
        <Panel.Heading onClick={() => this.setState({ open: !this.state.open })}>
          <Panel.Title toggle>
	          CREATE A NEW ACKNOWLEDGEMENT
	          <i className="fa fa-thumbs-up"></i>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body collapsible className="collapsible-body" >
          <Row>
            <Col md={6}>
              <FormGroup
                controlId="acknowledger"
                validationState={this.validateAcknowledger()}
              >
                <ControlLabel>
                  Your Name <font color="red">*</font>
                </ControlLabel>
                <FormControl
                  bsClass="form-control"
                  list="dlAutoCompleteUsers"
                  type="text"
                  placeholder="Your Name"
                  defaultValue={this.props.user.fullName}
                  onChange={this.handleAcknowlegerInput.bind(this)}
                  required
                  disabled
                />
                {this.AutoCompleteUsers()}
                <HelpBlock>Please enter a existing user</HelpBlock>
              </FormGroup>
              <FormGroup
                controlId="department"
                validationState={this.validateDepartment()}
              >
                <ControlLabel>Recipient's Department (Filter)</ControlLabel>
                <FormControl
                  bsClass="form-control"
                  list="dlAutoCompleteDepartments"
                  type="text"
                  placeholder="Recipient's Department"
                  defaultValue={departmentPlaceholder}
                  onChange={this.handleDepartmentInput.bind(this)}
                  required
                />
                {this.AutoCompleteDepartments()}
                <HelpBlock>Please enter a valid department</HelpBlock>
              </FormGroup>
              <FormGroup
                controlId="recipient"
                validationState={this.validateRecipient()}
              >
                <ControlLabel>
                  Recipient's Name <font color="red">*</font>
                </ControlLabel>
                <FormControl
                  bsClass="form-control"
                  list="dlAutoCompleteRecipients"
                  type="text"
                  placeholder="Recipient's Name"
                  defaultValue={recipientPlaceholder}
                  onChange={this.handleRecipientInput.bind(this)}
                  required
                />
                {this.AutoCompleteRecipients()}
                <HelpBlock>Please enter a existing user</HelpBlock>
              </FormGroup>
              <FormGroup controlId="description" validationState={this.validateDescription()}>
                <ControlLabel>
                  Details on the Recognitions <font color="red">*</font>
                </ControlLabel>
                <FormControl
                  rows="5"
                  componentClass="textarea"
                  bsClass="form-control"
                  placeholder="Please provide a short description about the recognition for the recipient."
                  defaultValue={descriptionPlaceholder}
                  onChange={this.handleDescriptionInput.bind(this)}
                  required
                />
                <HelpBlock>The description cannot include a question mark or forward slash (?, /)</HelpBlock>
              </FormGroup>
              <FormGroup
                controlId="presetMessages"
              >
                <ControlLabel>
                  Preset Messages
                </ControlLabel>
                <FormControl
                  bsClass="form-control"
                  list="dlAutoCompleteMessages"
                  type="text"
                  placeholder="Choose a preset message"
                  onChange={this.handlePresetInput.bind(this)}
                />
                {this.AutoCompleteMessages()}
              </FormGroup>
            </Col>
            <Col md={6} className="preview">
            	<Row>
	            	<div className="preview-acknowledger">
                  {this.previewAcknowledgerName()}
	            	</div>
	            	<h4 style={{textAlign: 'center'}}>
	            		WANTS TO THANK:
	            	</h4>
            	</Row>
            	<Row className="recipient-img">
            		{this.previewRecipient()}
              </Row>
              <Row>
              	<div className="preview-message">
              		{this.previewDesciption()}
              	</div>
              </Row>
              <Row>
                <button
                  type="submit"
                  className="btn-fill btn btn-info pull-right btn-submit btn-thank"
                  onClick={this.handleSubmit}
                >
                  Thank You For Your Submission!
                  <i className="fa fa-thumbs-up" />
                </button>
                <button
                  type="submit"
                  className=" btn btn-info pull-left btn-submit btn-cancel"
                  onClick={this.handleCancel}
                >
                  Cancel
                </button>
              </Row>
            </Col>
          </Row>
        </Panel.Body>
      </Panel>
	  );
	}
}

export default Collapsible;
