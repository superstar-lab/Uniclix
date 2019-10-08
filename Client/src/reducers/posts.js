export default (state = {}, action) => {
    switch(action.type){
        case "SET_POST":
            return {
                post: action.post
            };
        case "SET_POSTED_ARTICLE":
            return {
                article: action.article
            };
        default:
            return state;    
    }
};