const defaultState = {
    isOpen: false,
    publishChannels: undefined,
		showSelectAccounts: false,
		content: '',
		pictures: [],
		category: undefined,
		date: undefined,

		startsAt: undefined,
		selectedTimezone: '',
		postNow: false,
		postAtBestTime: false
};

export default (state = defaultState, action) => {
	switch(action.type){
		case 'SET_COMPOSER_MODAL':
			return {
				...defaultState,
				isOpen: true,
				startsAt: action.startsAt,
				selectedTimezone: action.selectedTimezone
			};
		case 'CLOSE_MODAL':
			return {
				...defaultState
			};
		case 'UPDATE_PUBLISH_CHANNELS':
			return {
				...state,
				publishChannels: action.publishChannels
			};
		case 'SET_SHOW_SELECT_ACCOUNTS':
			return { ...state, showSelectAccounts: action.showSelectAccounts };
		case 'SET_CONTENT':
			return { ...state, content: action.content };
		case 'SET_PICTURES':
			return { ...state, pictures: action.pictures };
		case 'SET_CATEGORY':
			return { ...state, category: action.category };
		case 'SET_DATE':
			return { ...state, date: action.date };
		case 'SET_POST_AT_BEST_TIME':
			return { ...state, postAtBestTime: action.postAtBestTime };
		case 'SET_POST_NOW':
			return {...state, postNow: action.postNow };
		default:
			return state;    
	}
};