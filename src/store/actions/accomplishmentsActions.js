import axios from 'axios';

export function fetchRecentAccomplishments(department) {
    return function(dispatch) {
        dispatch({
            type: "RETRIEVE_RECENT_ACCOMPLISHMENTS",
            payload: department
        });
        axios.get("http://localhost:9002/api/recentaccomplishments/" + department)
            .then((response) => {
                dispatch({
                    type: "RETRIVE_RECENT_ACCOMPLISHMENTS_FULFILLED",
                    payload: response.data
                })
            })
            .catch((err) => {
                dispatch({
                    type: "RETRIEVE_RECENT_ACCOMPLISHMENTS_REJECTED",
                    payload: err
                })
            })
    }
}

export function editAccomplishment(accomplishment) {
    return function(dispatch) {
        dispatch({
            type: "EDIT_ACCOMPLISHMENT",
            payload: accomplishment
        });
    }
}