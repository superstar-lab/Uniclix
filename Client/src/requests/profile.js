import axios from "axios";
import { apiUrl } from "../config/api";


export const getProfile = (data) => {
    return axios.get(`${apiUrl}/profile`)
        .then((response) => {
            return response.data;
        });
};

export const updateProfile = (data) => {
    return axios.post(`${apiUrl}/profile`, { data })
        .then((response) => {
            return response.data;
        });
};

export const updateTimeZone = (data) => {
    return axios.post(`${apiUrl}/update-timezone`, data)
        .then((response) => {
            return response.data;
        });
};

export const saveOnBoardingQuestions = (data) => {
    return axios.post(`${apiUrl}/profile/on-boarding-questions`, data)
        .then((response) => {
            return response.data;
        });
}
