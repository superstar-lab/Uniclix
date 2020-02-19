import {createStore, combineReducers, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import authReducer from "../reducers/auth";
import channelReducer from "../reducers/channels";
import postReducer from "../reducers/posts";
import composerReducer from "../reducers/composer";
import profileReducer from "../reducers/profile";
import middlewareReducer from "../reducers/middleware";
import generalReducer from '../reducers/general';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default () => {
    const store = createStore(
        combineReducers({
            auth: authReducer,
            middleware: middlewareReducer,
            profile: profileReducer,
            channels: channelReducer,
            posts: postReducer,
            composer: composerReducer,
            general: generalReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );

    return store;
}
