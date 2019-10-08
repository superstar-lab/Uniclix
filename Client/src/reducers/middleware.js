export default (state = {}, action) => {
    switch(action.type){
        case "SET_MIDDLEWARE":
            return {
                step: action.middleware
            };
        default:
            return state;    
    }
};