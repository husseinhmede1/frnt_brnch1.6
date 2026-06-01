import { RoleMasterModel } from "../../models/configuration/RoleMasterModel";
import { AxiosResponse } from "axios";
import request from "../request";

export const RoleMasterService = {
    getAll: async (): Promise<AxiosResponse<RoleMasterModel[], any>> => {
        return await request.get<RoleMasterModel[]>("/roleMaster")
    }
}