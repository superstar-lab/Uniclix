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

export const upload = (post, onUploadProgress) => {
  return axios.post(`${apiUrl}/post/upload`, {post}, {
      onUploadProgress: onUploadProgress
    })
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

export const scheduledPosts = (from_date = null, to_date = null) => {
    return axios.get(`${apiUrl}/scheduled/posts?from_date=${from_date}&to_date=${to_date}`)
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
        })
        .catch(() => {
            getCategories();
        });
};

export const schedulingTimes = () => {
  return axios.get(`${apiUrl}/scheduling/times`)
    .then((response) => {
      return response.data;
    });
};

export const schedulingStore = (times) => {
  return axios.post(`${apiUrl}/scheduling/store`, {
    times
  })
    .then((response) => {
      return response.data;
    });
};

export const schedulingEdit = (timeId, schedulingTime) => {
  return axios.get(`${apiUrl}/scheduling/edit?time_id=${timeId}&schedule_time=${schedulingTime}`)
    .then((response) => {
      return response.data;
    });
};

export const destroyTime = (timeId) => {
  return axios.delete(`${apiUrl}/scheduling/delete/${timeId}`)
    .then((response) => {
      return response.data;
    });
};

export const clearAll = () => {
  return axios.delete(`${apiUrl}/scheduling/clear`)
    .then((response) => {
      return response.data;
    });
};

export const schedulingCount = () => {
  return axios.get(`${apiUrl}/scheduling/count`)
    .then((response) => {
      return response.data;
    });
};