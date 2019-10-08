import axios from "axios";
import {apiUrl} from "../../config/api";

export const like = (postId, channelId) => {
    return axios.patch(`${apiUrl}/twitter/like/post`, {postId, channelId})
    .then((response) => {
        return response.data;
    });
};

export const unlike = (postId, channelId) => {
    return axios.patch(`${apiUrl}/twitter/unlike/post`, {postId, channelId})
    .then((response) => {
        return response.data;
    });
};

export const retweet = (postId, channelId) => {
    return axios.patch(`${apiUrl}/twitter/retweet/post`, {postId, channelId})
    .then((response) => {
        return response.data;
    });
};

export const deleteTweet = (statusId, channelId) => {
    return axios.post(`${apiUrl}/twitter/tweet/delete`, {statusId, channelId})
    .then((response) => {
        return response.data;
    });
};
