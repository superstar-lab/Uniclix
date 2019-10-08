import axios from "axios";
import {apiUrl} from "../config/api";


export const registerUser = (data) => {
    return axios.post(`${apiUrl}/oauth/password/register`, data)
            .then((response) => {
                return response.data;
            });
};

export const loginUser = (data) => {
    return axios.post(`${apiUrl}/oauth/password/login`, data)
            .then((response) => {
                return response.data;
            });
};