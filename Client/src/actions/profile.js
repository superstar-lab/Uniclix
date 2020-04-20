import {getProfile} from "../requests/profile";
import setAuthorizationHeader from "../utils/setAuthorizationHeader";
import {logout} from "./auth";

export const setProfile = (profile) => ({
    type: "SET_PROFILE",
    profile
});

export const startSetProfile = () => {
    return (dispatch) => {
        return getProfile().then((response) => {
                localStorage.setItem("profile", JSON.stringify(response));
                dispatch(setProfile(response));
                return Promise.resolve(response);
            }).catch((error) => {
                console.log(error);
                localStorage.setItem("token", undefined);
                dispatch(logout());
                setAuthorizationHeader(undefined);
                return Promise.reject(error);
            });
    };
};

export const addTopic = (topic) => ({
    type: 'ADD_TOPIC',
    topic
});

export const removeTopic = (topic) => ({
    type: 'REMOVE_TOPIC',
    topic
});

export const setAccessLevel = (accessLevel) => ({
    type: 'SET_ACCESS_LEVEL',
    accessLevel
});

export const setTimezone = (selectedTimezone) => ({
    type: 'SET_TIMEZONE',
    selectedTimezone
})
