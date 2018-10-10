export default function reducer(state={
	editAccomplishment: {},
	recentAccomplishments: [],
	recentAccomplishmentsDepartment: "",
	recentAccomplishmentsPreview: [],
	recentRecognized:[],
	recentRecognizedPreview:[],
	mostRecognized:[],
	mostRecognizedPreview:[],
	fetching: false,
    fetched: false,
    error: null,
}, action) {
	switch (action.type) {
		case "EDIT_ACCOMPLISHMENT": {
	        return {...state, editAccomplishment: action.payload }
		}
		case "DELETE_ACCOMPLISHMENTS": {
	        return {...state,
	        	recentAccomplishments:
	        		state.recentAccomplishments.filter(accomplishment => accomplishment.id !== action.payload)}
		}
		case "RETRIEVE_RECENT_ACCOMPLISHMENTS": {
	        return {...state, fetching: true, recentAccomplishmentsDepartment: action.payload}
      	}
      	case "RETRIVE_RECENT_ACCOMPLISHMENTS_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_RECENT_ACCOMPLISHMENTS_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        recentAccomplishments: action.payload,
	        }
	    }
	    case "RETRIEVE_RECENT_ACCOMPLISHMENTS_PREVIEW": {
	        return {...state, fetching: true}
      	}
      	case "RETRIVE_RECENT_ACCOMPLISHMENTS_PREVIEW_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_RECENT_ACCOMPLISHMENTS_PREVIEW_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        recentAccomplishmentsPreview: action.payload,
	        }
	    }
	    case "RETRIEVE_RECENT_RECOGNIZED": {
	        return {...state, fetching: true}
      	}
      	case "RETRIVE_RECENT_RECOGNIZED_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_RECENT_RECOGNIZED_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        recentRecognized: action.payload,
	        }
	    }
	    case "RETRIEVE_RECENT_RECOGNIZED_PREVIEW": {
	        return {...state, fetching: true}
      	}
      	case "RETRIVE_RECENT_RECOGNIZED_PREVIEW_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_RECENT_RECOGNIZED_PREVIEW_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        recentRecognizedPreview: action.payload,
	        }
	    }
	    case "RETRIEVE_MOST_RECOGNIZED": {
	        return {...state, fetching: true}
      	}
      	case "RETRIVE_MOST_RECOGNIZED_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_MOST_RECOGNIZED_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        mostRecognized: action.payload,
	        }
	    }
	    case "RETRIEVE_MOST_RECOGNIZED_PREVIEW": {
	        return {...state, fetching: true}
      	}
      	case "RETRIVE_MOST_RECOGNIZED_PREVIEW_REJECTED": {
	        return {...state, fetching: false, error: action.payload}
	     }
	    case "RETRIVE_MOST_RECOGNIZED_PREVIEW_FULFILLED": {
	        return {
		        ...state,
		        fetching: false,
		        fetched: true,
		        mostRecognizedPreview: action.payload,
	        }
	    }
	    default: {
      		return state
	    }

	}
}