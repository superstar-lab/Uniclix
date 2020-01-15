import axios from "axios";
import { apiUrl } from "../config/api";

export const getChannels = () => {
    return axios.get(`${apiUrl}/channels`)
        .then((response) => {
            return response.data;
        });
};

export const selectChannel = (id) => {
    return axios.patch(`${apiUrl}/channels/select/${id}`)
        .then((response) => {
            return response.data;
        });
};

export const publish = (post) => {
    return axios.post(`${apiUrl}/post/store`, {
        post
    })
        .then((response) => {
            return response.data;
        });
};

export const postNow = (postId) => {
    return axios.post(`${apiUrl}/post/${postId}`)
        .then((response) => {
            return response.data;
        });
};

export const destroyPost = (postId) => {
    return axios.delete(`${apiUrl}/post/${postId}`)
        .then((response) => {
            return response.data;
        });
};


export const approvePost = (postId) => {
    return axios.patch(`${apiUrl}/post/${postId}`)
        .then((response) => {
            return response.data;
        });
};

export const unapprovedPosts = (page = 1) => {
    return axios.get(`${apiUrl}/scheduled/unapproved?page=${page}`)
        .then((response) => {
            return response.data;
        });
};

export const scheduledPosts = (page = 1) => {
    return axios.get(`${apiUrl}/scheduled/posts?page=${page}&to_date=2022-01-16&from_date=2019-01-16`)
        .then((response) => {
            return response.data;
        });
};

export const pastScheduled = (page) => {
    return axios.get(`${apiUrl}/scheduled/past?page=${page}`)
        .then((response) => {
            return response.data;
        });
};

export const destroyChannel = (channelId) => {
    return axios.delete(`${apiUrl}/channels/delete/${channelId}`)
        .then((response) => {
            return response.data;
        });
}

export const getCategories = () => {
    return axios.get(`${apiUrl}/post/category`)
        .then((response) => {
            return response.data;
        });
};