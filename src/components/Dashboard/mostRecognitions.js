/**
 * @author:    David Gao
 * @license:   UNLICENSED
 *
 */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
const moment = require('moment');

export class MostRecognitions extends Component{
    constructor(props) {
        super(props);
        this.state = { user: [] };
        this.loadUsersFromServer = this.loadUsersFromServer.bind(this);
    }

    /*
        This function loads the users upon rendering the component
        and reloads the users every 5 seconds
    */
    componentDidMount() {
        this.loadUsersFromServer();
        // refresh list every 5 seconds
        setInterval(this.loadUsersFromServer, 5000);
    }

    /*
        This function makes a server call depending on the prop passed in by dashboard to grab the
        corresponding users to display on the leaderboard section.
    */
    loadUsersFromServer() {
        if (this.props.call === "mostrecognitions"){
            axios.get("http://localhost:9002/api/previewmostrecognitions")
                .then(res => {
                    this.setState({
                        user: res.data
                    });
                })
                .catch(err => {
                  console.log(err); this.props.history.push('/error')
                });


        }else if (this.props.call === "mostrecognized"){
            axios.get("http://localhost:9002/api/previewmostrecognized")
                .then(res => {
                    this.setState({
                        user: res.data
                    });
                })
                .catch(err => {
                    console.log(err); this.props.history.push('/error')
                });
        }
    }

    /*
        This function returns the correct value for the last column of the leaderboards
    */
    Recognitions(prop){
        if (this.props.call === "mostrecognitions"){
            return <td>{prop.given}</td>;
        }else
            return <td>{prop.received}</td>;
    }

    /*
        This function returns the correct value for the last column title of the leaderboards
    */
    RecognitionsColumn(){
        if (this.props.call === "mostrecognitions"){
            return <th>Given</th>;
        }else
            return <th>Received</th>;
    }

    /*
        This function transforms the last updated dated stored in MongoDB for each user
        into minutes, hours, days, months from the current time
    */
    Updated(prop){
        return <td className="updated">{moment(prop.updated).fromNow()}</td>;
    }

    /*
        This function returns the correct heading for the leaderboard card based on the prop
        passed in from dashboard
    */
    LastUpdated(){
        if (this.props.call === "mostrecognitions"){
            return <th className="updated">Last Given</th>;
        }else
            return <th className="updated">Last Received</th>;
    }


    render(){
        let accomplishmentNodes = this.state.user.map((user, index) => {
          return (
            <tr key={index}>
                <td>{index+1}</td>
                <td>
                    <NavLink to={'/profile/'+user.fullName} className="profile" activeClassName="active">
                        {user.fullName}
                    </NavLink>
                </td>
                {this.Recognitions(user)}
                {/*this.Updated(user)*/}
            </tr>
          );
        });
        return (
            <tbody>
            <tr>
                <th>Rank</th>
                <th>User</th>
                {this.RecognitionsColumn()}
                {/*this.LastUpdated()*/}
            </tr>
                {accomplishmentNodes}
            </tbody>
        );
    }
}

export default MostRecognitions;
