export default function reducer(state={
	users: [],
	filteredUsers: [],
	fullNames: [],
	departments: [],
	userDepartment: "",
	userImage: "",
	fetching: false,
    fetched: false,
    error: null,
}, action) {
	switch (action.type) {
		case "RETRIEVE_USERS": {
	        return {...state, fetching: true}
      	}
      	case "RETRIVE_USERS_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_USERS_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        users: action.payload,
	        }
	    }
	    case "RETRIEVE_FILTERED_USERS": {
	        return {...state, fetching: true}
      	}
      	case "RETRIVE_FILTERED_USERS_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_FILTERED_USERS_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        users: action.payload,
	        }
	    }
	    case "RETRIEVE_FULLNAMES": {
	        return {...state, fetching: true}
      	}
      	case "RETRIVE_FULLNAMES_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_FULLNAMES_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        fullNames: action.payload,
	        }
	    }
	    case "RETRIEVE_DEPARTMENTS": {
	        return {...state, fetching: true}
      	}
      	case "RETRIVE_DEPARTMENTS_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_DEPARTMENTS_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        departments: action.payload,
	        }
	    }
	    case "RETRIEVE_USER_DEPARTMENT": {
	        return {...state, fetching: true}
      	}
      	case "RETRIVE_USER_DEPARTMENT_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_USER_DEPARTMENT_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        userDepartment: action.payload,
	        }
	    }
	    case "RETRIEVE_USER_IMAGE": {
	        return {...state, fetching: true}
      	}
      	case "RETRIVE_USER_IMAGE_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_USER_IMAGE_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        userImage: action.payload,
	        }
	    }
	   	default: {
      		return state
	    }

	}
}