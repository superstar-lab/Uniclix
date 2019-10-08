export default (state = {}, action) => {
    switch(action.type){
        case "SET_COMPOSER_MODAL":
            return {
                modal: action.modal
            };
        default:
            return state;    
    }
};