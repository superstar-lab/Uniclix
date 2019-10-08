export default (state = {}, action) => {
    switch(action.type){
        case "LOGIN":
            return {
                token: action.token
            };
        case "LOGOUT":
            return {};
        default:
            return state;    
    }
};