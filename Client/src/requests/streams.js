import axios from "axios";
import {apiUrl} from "../config/api";

export const getStreams = () => {
    return axios.get(`${apiUrl}/streams`)
            .then((response) => {
                return response.data;
            });
};

export const setRefreshRate = (data, refreshRate) => {
    return axios.post(`${apiUrl}/streams/tabs/refreshrate`, {data, refreshRate})
            .then((response) => {
                return response.data;
            });
};

export const selectTab = (data) => {
    return axios.post(`${apiUrl}/streams/tabs/select`, {data})
            .then((response) => {
                return response.data;
            });
};

export const positionTab = (data, key) => {
    return axios.post(`${apiUrl}/streams/tabs/position`, {data, key})
            .then((response) => {
                return response.data;
            });
};

export const addTab = (data) => {
    return axios.post(`${apiUrl}/streams/tabs/add`, {data})
            .then((response) => {
                return response.data;
            });
};

export const deleteTab = (data) => {
    return axios.post(`${apiUrl}/streams/tabs/delete`, {data})
            .then((response) => {
                return response.data;
            });
};

export const renameTab = (data) => {
    return axios.post(`${apiUrl}/streams/tabs/rename`, {data})
            .then((response) => {
                return response.data;
            });
};

export const addStream = (type, channelId, selectedTab, network, searchTerm = "") => {
    return axios.post(`${apiUrl}/streams/add`, {type, channelId, selectedTab, network, searchTerm})
            .then((response) => {
                return response.data;
            });
};

export const deleteStream = (streamId) => {
    return axios.post(`${apiUrl}/streams/delete`, {streamId})
            .then((response) => {
                return response.data;
            });
};

export const positionStream = (streamId, data) => {
    return axios.post(`${apiUrl}/streams/position`, {streamId, data})
            .then((response) => {
                return response.data;
            });
};

export const updateStream = (streamId, title) => {
    return axios.post(`${apiUrl}/streams/update`, {streamId, title})
            .then((response) => {
                return response.data;
            });
};

export const getStreamFeed = (type, network, channelId, query = "", nextPage = "") => {
    return axios.post(`${apiUrl}/${network}/streams/${type}`, {channelId, query, nextPage})
        .then((response) => {
            return response.data;
        });
};