import { BkdServiceModel } from "../models/jobs/BkdServiceModel"
import { FileTypesModule } from "../models/jobs/FileTypesModule"
import request from "../services/request";
import { getType1, getVersion } from "../utils/constant";
import { Axios, AxiosResponse } from "axios"

const bkdserviceUrl: string = `${getType1()}/bkd-service`;

export const BkdService = {
    getallBkdServices: async (): Promise<AxiosResponse<BkdServiceModel[], any>> => {
        return await request.get<BkdServiceModel[]>(`/${bkdserviceUrl}`)
    },
    updateBkdServicesBatchSize: async (model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${bkdserviceUrl}/batch-size`, model);
    },
    getParameterName: async (parameterServiceId: number): Promise<AxiosResponse<string, any>> => {
        return await request.get<string>(`/${bkdserviceUrl}/parameter/${parameterServiceId}`)
    },
    getFileType: async (): Promise<AxiosResponse<FileTypesModule, any>> => {
        return await request.get<FileTypesModule>(`/${bkdserviceUrl}/file-type`)
    }
}