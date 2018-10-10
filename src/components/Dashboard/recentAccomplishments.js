/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

import React, { Component } from 'react';
import {
    Row,
    Col,
    Image,
    DropdownButton,
    MenuItem
} from 'react-bootstrap';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

import { editAccomplishment } from "./../../store/actions/accomplishmentsActions";

const moment = require('moment');

export class RecentAccomplishments extends Component{
    constructor(props) {
        super(props);
        this.state = { data: [] };
        this.loadAccomplishmentsFromServer = this.loadAccomplishmentsFromServer.bind(this);
        this.handleAccomplishmentDelete = this.handleAccomplishmentDelete.bind(this);
        this.handleAccomplishmentEdit = this.handleAccomplishmentEdit.bind(this);
    }

    /*
        This function loads the accomplishments upon rendering the component
        and reloads the accomplishments every 5 seconds
    */
    componentDidMount() {
        this.loadAccomplishmentsFromServer();
        //refresh list every 5 seconds
        setInterval(this.loadAccomplishmentsFromServer, 5000);
    }

    /*
        This function grabs the 10 most recent accomplishments that were submitted
    */
    loadAccomplishmentsFromServer() {
        axios.get("http://localhost:9002/api/previewrecentaccomplishments")
            .then(res => {
                this.setState({
                    data: res.data
                });
            })
            .catch(err => {
                console.log(err); this.props.history.push('/error')
            });
    }

    /*
        This function deletes an accomplishment if the delete button is pressed
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

    /*
        This function edits an accomplishment if the edits button is pressed
    */
    handleAccomplishmentEdit(accomplishment) {
        this.props.dispatch(editAccomplishment(accomplishment))
        this.props.history.push('/editpost')
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


    render(){
        let accomplishmentNodes = this.state.data.map((accomplishment, index) => {
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
                                        <NavLink className="accomplishment-user profile accomplishment-acknowledged" style={{clear:'both'}} to={'/profile/'+accomplishment.acknowledged} activeClassName="active">
                                            <b>{accomplishment.acknowledged}</b>
                                        </NavLink>
                                    </Row>
                                    <Row>
                                        <Col className="accomplishment-details accomplishment-acknowledger">
                                            Was recognized by&nbsp;
                                            <NavLink className="accomplishment-user profile" style={{clear:'both'}} to={'/profile/'+accomplishment.acknowledger} activeClassName="active">
                                                {accomplishment.acknowledger}
                                            </NavLink>
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
            <tbody>
                {accomplishmentNodes}
            </tbody>
        );
    }
}

export default RecentAccomplishments;

