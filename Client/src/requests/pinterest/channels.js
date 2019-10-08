import axios from "axios";
import {apiUrl} from "../../config/api";

export const addChannel = (accessToken) => {
    return axios.post(`${apiUrl}/pinterest/channels/add`, {
                access_token: accessToken,
            }).then((response) => {
                return response.data;
            });
};

export const getBoards = (id) => {
    return axios.get(`${apiUrl}/pinterest/channels/boards?id=${id}`).then((response) => {
                return response.data;
            });
};