import axios from "axios";
import {oathTokenUrl, clientId, clientSecret} from "../config/api";
import setAuthorizationHeader from "../utils/setAuthorizationHeader";

export const login = (token) => ({
    type: "LOGIN",
    token
});

export const startLogin = (body, network = "twitter") => {
    return (dispatch) => {

        let accessToken = null;
        let accessTokenSecret = null;

        if(network == "twitter"){

            accessToken = body.oauth_token;
            accessTokenSecret = body.oauth_token_secret;

        }else{

            accessToken = body.accessToken;
        }

        return axios.post(oathTokenUrl, {
                grant_type: "social",
                client_id: clientId,
                client_secret: clientSecret,
                network,
                access_token: accessToken,
                access_token_secret: accessTokenSecret
            }).then((response) => {
                const token = response.data.access_token;
                localStorage.setItem("token", token);
                setAuthorizationHeader(token);
                dispatch(login(token));
                return Promise.resolve(token);
            }).catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
    };
};

export const initLogin = (token) => {
    return (dispatch) => {
        if(typeof token === "undefined") Promise.reject("Invalid token.");
        localStorage.setItem("token", token);
        setAuthorizationHeader(token);
        dispatch(login(token));
        return Promise.resolve(token);
    };
};

export const logout = () => ({
    type: "LOGOUT"
});

export const startLogout = () => {
    return (dispatch) => {
        localStorage.setItem("token", undefined);
        localStorage.setItem("channels", undefined);
        localStorage.setItem("profile", undefined);
        dispatch(logout());
    };
};