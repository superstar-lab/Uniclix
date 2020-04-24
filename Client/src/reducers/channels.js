const channelsInitialState = {
    list: [],
    loading: false
}

export default (state = channelsInitialState, action) => {
    switch(action.type){
        case "SET_CHANNELS":
            return {
                list: action.list,
                loading: state.loading
            };
        case "SET_CHANNELS_LOADING":
            return {
                list: state.list,
                loading: action.loading
            }
        default:
            return state;    
    }
};