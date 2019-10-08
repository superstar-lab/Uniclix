const profileInitialState = "";

export default (state = profileInitialState, action) => {
    switch(action.type){
        case "SET_PROFILE":
            return {
                ...action.profile
            };
        default:
            return state;    
    }
};