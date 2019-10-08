import axios from "axios";
import {apiUrl} from "../../config/api";

export const addChannel = (accessToken) => {
    return axios.post(`${apiUrl}/facebook/channels/add`, {
                access_token: accessToken,
            }).then((response) => {
                return response.data;
            });
};

export const getAccounts = () => {
    return axios.get(`${apiUrl}/facebook/channels/accounts`)
    .then((response) => {
                return response.data;
            });
};

export const getInfoById = (channelId, id, simple=false) => {
    return axios.get(`${apiUrl}/facebook/user/info?channelId=${channelId}&id=${id}&simple=${simple}`)
    .then((response) => {
                return response.data;
            });
};

export const saveAccounts = (accounts) => {
    return axios.post(`${apiUrl}/facebook/channels/accounts/save`, {
                accounts
            }).then((response) => {
                return response.data;
            });
};

export const searchPages = (channelId, query) => {
    return axios.get(`${apiUrl}/facebook/pages/search?channelId=${channelId}&query=${query}`).then((response) => {
                return response.data;
            });
};

export const getAnalytics = (id, days=1) => {
    return axios.get(`${apiUrl}/facebook/analytics?id=${id}&days=${days}`)
        .then((response) => {
            return response.data;
        });
};

export const pageInsights = (id, startDate, endDate) => {
    return axios.get(`${apiUrl}/facebook/insights/page?id=${id}&startDate=${startDate}&endDate=${endDate}`)
        .then((response) => {
            return response.data;
        });
};

export const pageInsightsByType = (id, startDate, endDate, type) => {
    return axios.get(`${apiUrl}/facebook/insights/page/${type}?id=${id}&startDate=${startDate}&endDate=${endDate}`)
        .then((response) => {
            return response.data;
        });
};

export const like = (objectId, channelId) => {
    return axios.post(`${apiUrl}/facebook/post/like`, {
        objectId,
        channelId
    }).then((response) => {
        return response.data;
    });
}

export const unlike = (objectId, channelId) => {
    return axios.post(`${apiUrl}/facebook/post/unlike`, {
        objectId,
        channelId
    }).then((response) => {
        return response.data;
    });
}

export const comment = (objectId, channelId, message, image = "") => {
    return axios.post(`${apiUrl}/facebook/post/comment`, {
        objectId,
        channelId,
        message,
        image
    }).then((response) => {
        return response.data;
    });
}

export const getComments = (objectId, channelId) => {
    return axios.get(`${apiUrl}/facebook/get/comments?objectId=${objectId}&channelId=${channelId}`).then((response) => {
        return response.data;
    });
}

export const post = (channelId, message = "", objectId = "") => {
    return axios.post(`${apiUrl}/facebook/post`, {
        objectId,
        channelId,
        message
    }).then((response) => {
        return response.data;
    });
}

export const deletePost = (channelId, postId) => {
    return axios.post(`${apiUrl}/facebook/post/delete`, {
        postId,
        channelId
    }).then((response) => {
        return response.data;
    });
}

export const sendMessage = (message, conversationId, channelId) => {
    return axios.post(`${apiUrl}/facebook/message/send`, {
        conversationId,
        channelId,
        message
    }).then((response) => {
        return response.data;
    });
}