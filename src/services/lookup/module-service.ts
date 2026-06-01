import { AxiosResponse } from "axios";
import request from "../request";
import { getType2, getVersion } from "../../utils/constant";
import { ModuleActivityModel } from "../../models/configuration/ModuleModel";

const moduleUrl = `${getVersion()}/${getType2()}/modules`;

export const ModuleService = {
    getAllModulesByUser: async (): Promise<AxiosResponse<ModuleActivityModel[]>> =>
        request.get<ModuleActivityModel[]>(`/${moduleUrl}/user`),
};
