import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configStore from "./store/configStore";
import AppRouter from "./routes/AppRouter";
import "normalize.css/normalize.css";
import "./styles/styles.scss";
import { login, logout } from "./actions/auth";
import setAuthorizationHeader from "./utils/setAuthorizationHeader";
import { setProfile, startSetProfile } from "./actions/profile";
import { setChannels, startSetChannels } from "./actions/channels";
import { setMiddleware } from "./actions/middleware";
import { startGeneral } from './actions/general';
import 'antd/dist/antd.css';

const store = configStore();

const Root = () => (
    <div>
        <Provider store={store}>
            <AppRouter />
        </Provider>    
    </div>
);


let hasRendered = false;

const renderApp = () => {
    if(!hasRendered){
        ReactDOM.render(<Root />, document.getElementById("app"));
        hasRendered = true;
    }
};


const setAuthentication = () => {
    let token = localStorage.getItem("token") || undefined;

    token = token == "undefined" || typeof(token) === "undefined" ? undefined : token;

    store.dispatch(login(token));
    store.dispatch(setMiddleware("loading"));
    setAuthorizationHeader(token);

    if(token && token !== "undefined"){
        let channels;
        let profile;

        try {
            let channels = localStorage.getItem("channels");
            channels = channels ? JSON.parse(channels) : [];
        } catch (error) {
            channels = [];
        }

        try {
            profile = localStorage.getItem("profile");
            profile = profile ? JSON.parse(profile) : "";
        } catch (error) {
            profile = "";
        }

        if(!profile){
            localStorage.setItem("token", undefined);
            store.dispatch(logout());
            setAuthorizationHeader(undefined);
        }

        new Promise(function(resolve, reject) {
            store.dispatch(setProfile(profile));
            store.dispatch(setChannels(channels));
            return resolve(true);
        }).then(() => {
            store.dispatch(startSetProfile());
            store.dispatch(startSetChannels());
        }).then(() => {
            // store.dispatch(startGeneral());
        });
    }

    renderApp();
};

setAuthentication();
