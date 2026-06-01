import { AxiosResponse } from "axios";
import request, { _version } from "../request";

const jobUrl: string = `job`;

export const jobService = {
    uploadMerchantFiles: async(model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${jobUrl}/import-merchant`, model);
    },
    uploadTerminalFiles: async(model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${jobUrl}/import-terminal`, model);
    },
}