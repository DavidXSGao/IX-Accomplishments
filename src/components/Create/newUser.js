/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

import React, { Component } from 'react';
import {
    Grid, Row, Col,
    FormGroup, ControlLabel, FormControl, HelpBlock
} from 'react-bootstrap';
import axios from 'axios';
import { connect } from "react-redux";

import {Card} from './../Card/card.js';
import {FormInputs} from './../FormInputs/FormInputs.js';

import { createUser } from "./../../store/actions/userActions";

const initialState = { departments: [], department: "", newDepartment: "", email: ""};

function mapStateToProps(store) {
  return {
    user: store.user.user,
    userEmail: store.user.userEmail
  }
}

class NewUser extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.loadDepartmentsFromServer = this.loadDepartmentsFromServer.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /*
        This function loads the departments upon rendering the component
    */
    componentDidMount() {
        this.loadDepartmentsFromServer();
        if (!this.props.user) {
            this.setState({
                email: this.props.userEmail
            });
        }
    }

    /*
        This function calls the server to get a list of all the departments that have users in MongoDB
    */
    loadDepartmentsFromServer() {
        axios.get("http://localhost:9002/api/departments")
            .then(res => {
                this.setState({
                    departments: res.data
                });
            })
            .catch(err => {
                console.log(err); this.props.history.push('/error')
            });
    }

    /*
        This function returns a datalist with all the options being the departments of the users
    */
    AutoCompleteDepartments () {
        const departments = this.state.departments;
        const listItems = departments.map((department, index) =>
            <option key={index}>
                {department}
            </option>
        );
        return (
            <datalist id="dlAutoCompleteDepartments">{listItems}</datalist>
        );
    }

    /*
        This function handles input in the department form group
    */
    handleDepartmentInput (event) {
        if(document.getElementById('department').value){
            this.setState({department: document.getElementById('department').value});
        }
    }

    /*
        This function handles input in the newDepartment form group
    */
    handleNewDepartmentInput (event) {
        if(document.getElementById('newDepartment').value){
            this.setState({newDepartment: document.getElementById('newDepartment').value});
        }
    }

    /*
        This function handles input in the email form group
    */
    handleEmailInput (event) {
        if(document.getElementById('email').value){
            this.setState({email: document.getElementById('email').value});
        }
    }

    /*
        This function validates the input in the department form group
        and returns "success" which is needed for react-boostrap if the input is valid
        and "error" if it is not
    */
    validateDepartment () {
        if (this.state.department === ""){
            return null;
        }
        if(document.getElementById('department')){
            if(!this.state.departments.includes(this.state.department)){
                return 'error';
            }
        }
        return 'success';
    }

    /*
        This function validates the input in the email form group
        and returns "success" which is needed for react-boostrap if the input is valid
        and "error" if it is not
    */
    validateEmail () {
        var emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$");
        if (this.state.email === ""){
            return null;
        }
        if(document.getElementById('email')){
            if(!emailRegex.test(this.state.email)){
                return 'error';
            }
        }
        return 'success';
    }

    /*
        This function validates every field, makes sure every field is valid, and if every field is
        creates the accomplishment and resets the fields to the default, otherwise corresponding
        notifications will be provided
    */
    handleSubmit (event){
        event.preventDefault();

        var validFirstName = (document.getElementById('firstName').value !== "");
        var validLastName = (document.getElementById('lastName').value !== "");
        var validDepartment = this.validateDepartment();
        var validNewDepartment = (this.state.newDepartment !== "");
        var validEmail = this.validateEmail();

        var valid = (validFirstName && validLastName && (validDepartment === 'success' || validNewDepartment) && validEmail === 'success');

        if (valid === true){
            var department = "";
            if(validDepartment){
                department = this.state.department;
            }else{
                department = this.state.newDepartment;
            }
            const new_user = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                fullName: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
                department: department,
                email:  this.state.email
            }
            this.props.dispatch(createUser(new_user))
            this.props.handleSuccessNotification("User Successfully Added!");
            this.props.handleSuccessNotification("The user now have access to the rest of the application.");
            this.setState(initialState);
            document.getElementById('firstName').value = "";
            document.getElementById('lastName').value = "";
            document.getElementById('department').value = "";
            document.getElementById('newDepartment').value = "";
            document.getElementById('email').value = "";
            this.loadDepartmentsFromServer();
        }else{
            var field = "";
            if (!validFirstName){
                field = "first name";
            } else if (!validLastName){
                field = "last name";
            } else if (validDepartment !== 'success' && !validNewDepartment){
                field = "department";
            } else {
                field = "email";
            }
            this.props.handleFailNotification("Please review the user's "+ field + ".");
        }
    }

    render() {
        var newEmail = ""
        if (!this.props.user) {
            newEmail = this.props.userEmail
        }
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col lg={12}>
                            <Card
                                title="New User"
                                content={
                                    <form>
                                        <FormInputs
                                            ncols = {["col-md-6" , "col-md-6"]}
                                            proprieties = {[
                                                {
                                                 label : "User's First Name *",
                                                 type : "text",
                                                 bsClass : "form-control",
                                                 placeholder : "First Name",
                                                 id : "firstName"
                                                },
                                                {
                                                 label : "Last name *",
                                                 type : "text",
                                                 bsClass : "form-control",
                                                 placeholder : "Last Name",
                                                 id : "lastName"
                                                }
                                            ]}
                                            required
                                        />
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup controlId="department" validationState={this.validateDepartment()}>
                                                    <ControlLabel>User's Department </ControlLabel>
                                                    <FormControl bsClass="form-control" list="dlAutoCompleteDepartments" type="text" placeholder="User's Department" onChange={this.handleDepartmentInput.bind(this)}/>
                                                    {this.AutoCompleteDepartments() }
                                                    <HelpBlock>Please enter a valid department or enter the new department in the New Department Field</HelpBlock>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup controlId="newDepartment">
                                                    <ControlLabel>New Department (optional)</ControlLabel>
                                                    <FormControl bsClass="form-control" type="text" placeholder="New Department's Name (Optional)" onChange={this.handleNewDepartmentInput.bind(this)}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup controlId="email" validationState={this.validateEmail()}>
                                                    <ControlLabel>User's Email *</ControlLabel>
                                                    <FormControl
                                                        bsClass="form-control"
                                                        type="text"
                                                        placeholder="User's Email"
                                                        defaultValue={newEmail}
                                                        onChange={this.handleEmailInput.bind(this)}
                                                    />
                                                    <HelpBlock>Please enter a valid email (e.g. firstName.lastName@indexexchange.com)</HelpBlock>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <font color="red">Note:</font> The user's picture has to be manually inserted into public/images otherwise a default picture will be used
                                            </Col>
                                        </Row>
                                        <button type="submit" className="btn-fill btn btn-info pull-right btn-submit" onClick={this.handleSubmit}>
                                            Create New User
                                        </button>
                                        <div className="clearfix"></div>
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

export default connect(mapStateToProps)(NewUser);

