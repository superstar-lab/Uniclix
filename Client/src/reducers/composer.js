const defaultState = {
		isOpen: false,
		id: '',
    publishChannels: undefined,
		showSelectAccounts: false,
		content: '',
		pictures: [],
		videos: [],
		category: undefined,
		date: undefined,
		type: 'store',
		articleId: undefined,

		startsAt: undefined,
		selectedTimezone: '',
		postNow: false,
		postAtBestTime: false,
		postCalendar: 'Week'
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
		case 'SET_COMPOSER_TO_EDIT':
			const { postData } = action;
			return {
				...defaultState,
				...postData,
				type: 'edit',
				isOpen: true
			};
		case 'SET_COMPOSER_FOR_MONITOR_ACTIVITY':
		case 'SET_COMPOSER_FOR_ARTICLE':
			const { postData: articleData } = action;
			return {
				...defaultState,
				...articleData,
				isOpen: true
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
		case 'SET_VIDEOS':
			return { ...state, videos: action.videos };
		case 'SET_CATEGORY':
			return { ...state, category: action.category };
		case 'SET_DATE':
			return { ...state, date: action.date };
		case 'SET_POST_AT_BEST_TIME':
			return { ...state, postAtBestTime: action.postAtBestTime };
		case 'SET_POST_NOW':
			return {...state, postNow: action.postNow };
		case 'SET_POST_CALENDAR':
			return { ...state, postCalendar: action.postCalendar };
		default:
			return state;    
	}
};