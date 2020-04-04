const profileInitialState = "";

export default (state = profileInitialState, action) => {
    switch(action.type){
        case "SET_PROFILE":
            const topics = action.profile.topics.map(topic => topic.topic);
            return {
                ...state, ...action.profile, topics
            };
        case 'ADD_TOPIC':
            state.topics.push(action.topic);
            return { ...state };
        case 'REMOVE_TOPIC':
            const topicIndex = state.topics.indexOf(action.topic);
            state.topics.splice(topicIndex, 1);
            return { ...state };
        case 'SET_ACCESS_LEVEL':
            return { ...state, accessLevel: action.accessLevel };
        default:
            return state;    
    }
};