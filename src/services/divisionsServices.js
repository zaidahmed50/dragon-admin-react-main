import apiService from "./apiService.js";
import {ApiUrls} from "./index.js";

class DivisionServices  {

    static async getAllDivisions (){
        return await apiService.get(ApiUrls.getAllDivisions);
    }

}

export default DivisionServices;