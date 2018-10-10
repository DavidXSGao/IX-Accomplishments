import axios from 'axios';

export function fetchUser(email) {
    return function(dispatch) {
        dispatch({
            type: "RETRIEVE_USER",
            payload: email
        });
        axios.get("http://localhost:9002/api/getuserbyemail/"+email)
            .then((response) => {
                dispatch({
                    type: "RETRIVE_USER_FULFILLED",
                    payload: response.data[0]
                })
            })
            .catch((err) => {
                dispatch({
                    type: "RETRIVE_USER_REJECTED",
                    payload: err
                })
            })
    }
}

export function changeProfile(name) {
    return function(dispatch) {
        dispatch({
            type: "CHANGE_PROFILE",
            payload: name
        });
    }
}

export function createUser(user) {
    return function(dispatch) {
        axios.post('http://localhost:9002/api/users', {
                firstName: user.firstName,
                lastName: user.lastName,
                department: user.department,
                email: user.email
            })
            .then(function (response) {
                dispatch({
                    type: "CREATE_USER",
                    payload: user
                })
            })
            .catch((err) => {
                dispatch({
                    type: "RETRIVE_USER_REJECTED",
                    payload: err
                })
            })
    }
}

export function userLogout() {
    return function(dispatch) {
        dispatch({
            type: "USER_LOGOUT"
        })
    }
}