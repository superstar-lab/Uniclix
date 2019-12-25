export default (state = {}, action) => {
    switch(action.type){
        case "SET_COMPOSER_MODAL":
            return {
                modal: action.modal,
                data: action.data
            };
        default:
            return state;    
    }
};