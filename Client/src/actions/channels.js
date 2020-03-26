import { getChannels, selectChannel as selectGlobalChannel } from "../requests/channels";
import { selectChannel as selectTwitterChannel, addChannel as addTwitterChannel } from "../requests/twitter/channels";
import { addChannel as addFacebookChannel } from "../requests/facebook/channels";
import { addChannel as addLinkedinChannel } from "../requests/linkedin/channels";
import { addChannel as addPinterestChannel } from "../requests/pinterest/channels";
import { setMiddleware } from "./middleware";

export const setChannels = (list = []) => ({
    type: "SET_CHANNELS",
    list
});

export const setChannelsLoading = (loading = false) => ({
    type: "SET_CHANNELS_LOADING",
    loading
}); 

export const startSetChannels = () => {
    return dispatch => {
        dispatch(setChannelsLoading(true));
        return getChannels()
                .then((response) => {
                    dispatch(setChannels(response));
                    localStorage.setItem("channels", JSON.stringify(response));
                    if(Array.isArray(response) && response.length < 1){
                        dispatch(setMiddleware("channels"));
                    }
                    
                    dispatch(setChannelsLoading(false));
                    return response;
                }).catch(error => {
                    dispatch(setChannelsLoading(false));
                    return Promise.reject(error);
                });
    };
};

export const startAddTwitterChannel = (accessToken, accessTokenSecret) => {
    return dispatch => {
        dispatch(setChannelsLoading(true));
        return addTwitterChannel(accessToken, accessTokenSecret)
                .then((response) => {
                    dispatch(setChannels(response));
                    localStorage.setItem("channels", JSON.stringify(response));
                    dispatch(setChannelsLoading(false));
                    return response;
                }).catch(error => {
                    dispatch(setChannelsLoading(false));
                    return Promise.reject(error);
                });
    };
}

export const startAddFacebookChannel = (accessToken) => {
    return dispatch => {
        dispatch(setChannelsLoading(true));
        return addFacebookChannel(accessToken)
                .then((response) => {
                    dispatch(setChannels(response));
                    localStorage.setItem("channels", JSON.stringify(response));
                    dispatch(setChannelsLoading(false));
                    return response;
                }).catch(error => {
                    dispatch(setChannelsLoading(false));
                    return Promise.reject(error);
                });
    };
}

export const startAddLinkedinChannel = (accessToken) => {
    return dispatch => {
        dispatch(setChannelsLoading(true));
        return addLinkedinChannel(accessToken)
                .then((response) => {
                    dispatch(setChannels(response));
                    localStorage.setItem("channels", JSON.stringify(response));
                    dispatch(setChannelsLoading(false));
                    return response;
                }).catch(error => {
                    dispatch(setChannelsLoading(false));
                    return Promise.reject(error);
                });
    };
}

export const startAddPinterestChannel = (accessToken) => {
    return dispatch => {
        dispatch(setChannelsLoading(true));
        return addPinterestChannel(accessToken)
                .then((response) => {
                    dispatch(setChannels(response));
                    localStorage.setItem("channels", JSON.stringify(response));
                    dispatch(setChannelsLoading(false));
                    return response;
                }).catch(error => {
                    dispatch(setChannelsLoading(false));
                    return Promise.reject(error);
                });
    };
}

export const setGlobalChannel = (id) => {
    return dispatch => {
        dispatch(setChannelsLoading(true));
        return selectGlobalChannel(id)
                .then((response) => {
                    dispatch(setChannels(response));
                    localStorage.setItem("channels", JSON.stringify(response));
                    dispatch(setChannelsLoading(false));
                    return response;
                }).catch(error => {
                    dispatch(setChannelsLoading(false));
                    return Promise.reject(error);
                });
    }
}

export const setTwitterChannel = (id) => {
    return dispatch => {
        dispatch(setChannelsLoading(true));
        return selectTwitterChannel(id)
                .then((response) => {
                    dispatch(setChannels(response));
                    localStorage.setItem("channels", JSON.stringify(response));
                    dispatch(setChannelsLoading(false));
                    return response;
                }).catch(error => {
                    dispatch(setChannelsLoading(false));
                    return Promise.reject(error);
                });
    }
}