import axios from "axios";
import {apiUrl} from "../config/api";

export const getTeams = () => {
    return axios.get(`${apiUrl}/team`)
            .then((response) => {
                return response.data;
            });
};

export const getTeamMembers = (teamId) => {
    return axios.get(`${apiUrl}/team/members?teamId=${teamId}`)
            .then((response) => {
                return response.data;
            });
};

export const updateTeamMember = (data) => {
    return axios.post(`${apiUrl}/team/members/update`, data)
            .then((response) => {
                return response.data;
            });
};

export const removeMember = (data) => {
    return axios.post(`${apiUrl}/team/members/remove`, data)
            .then((response) => {
                return response.data;
            });
};

export const getPendingMembers = (teamId) => {
    return axios.get(`${apiUrl}/team/members/pending?teamId=${teamId}`)
            .then((response) => {
                return response.data;
            });
}
