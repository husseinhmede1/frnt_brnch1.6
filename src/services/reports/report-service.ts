import axios, { AxiosResponse } from "axios";
import request from "../request";
import { env as envInject} from "../../env";

const reportsUrl: string = `report`;
const pre=envInject.REACT_APP_API_ROOT_URL ?? "";
 

export const ReportsService = {
    getReports: async (model: any): Promise<AxiosResponse<any>> => {
        console.log(`${reportsUrl}/report`)
        return await request.post<any>(`${reportsUrl}/report`, model);
    },
   getPDFReports: async (model: any): Promise<AxiosResponse<any>> => {
        console.log(`${reportsUrl}/report`)
        return await request.post<any>(`${reportsUrl}/report`, model,{ responseType: 'blob'});
    },
}