export default function reducer(state={
	userEmail: "",
	user: {},
	profile: "",
	fetching: false,
    fetched: false,
    error: null,
}, action) {
	switch (action.type) {
		case "USER_LOGOUT": {
	        return state={
				userEmail: "",
				user: {},
				profile: "",
				fetching: false,
			    fetched: false,
			    error: null,
			};
      	}
		case "RETRIEVE_USER": {
	        return {...state, fetching: true, userEmail: action.payload}
      	}
      	case "RETRIVE_USER_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_USER_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        user: action.payload,
	        }
	    }
	    case "CREATE_USER": {
	    	if(!state.user){
		        return {
			        ...state,
			        user: action.payload
		        }
		    } else {
		    	return state
		    }
	    }
	    case "CREATE_USER_REJECTED": {
	        return {...state, error: action.payload}
	     }
	    case "CHANGE_PROFILE": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        profile: action.payload,
	        }
	    }
	    default: {
      		return state
	    }
	}
}