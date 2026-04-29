import apiService from "./apiService.js";
import {ApiUrls} from "./index.js";


const searchUserConnections = (data) => {
    return apiService.post(ApiUrls.getSaleIdConnectionList, data);
};

export default searchUserConnections;