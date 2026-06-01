import { AxiosResponse } from "axios";
import request from "../request";
import { getType1, getVersion } from "../../utils/constant";
import { FileElementModel, InputOutputLayoutModel, LayoutModel } from "../../models/configuration/fileLayoutModel";

const fileOutputUrl: string = `${getVersion()}/${getType1()}/input-output`;
const layoutUrl: string = `${getVersion()}/input-output/layouts`;

export const FileLayoutService = {
    getAllFiles: async (): Promise<AxiosResponse<InputOutputLayoutModel[], any>> => {
        return await request.get<InputOutputLayoutModel[]>(`/${fileOutputUrl}`);
    },
    getAllelementsbyFileID: async (fileId: number): Promise<AxiosResponse<FileElementModel, any>> => {
        return await request.get<FileElementModel>(`/${fileOutputUrl}/${fileId}`);
    },
    getallActiveFiles: async (): Promise<AxiosResponse<InputOutputLayoutModel[], any>> => {
        return await request.get<InputOutputLayoutModel[]>(`/${fileOutputUrl}/active`);
    }
}

export const LayoutService = {
    saveLayout: async (model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${layoutUrl}`, model);
    },
    getLayoutbyID: async (id: number): Promise<AxiosResponse<LayoutModel, any>> => {
        return await request.get<LayoutModel>(`/${layoutUrl}/${id}`);
    },
    deleteLayout: async (id: number): Promise<AxiosResponse<any>> => {
        return await request.delete<any>(`/${layoutUrl}/${id}`);
    },
    getAllactiveLayouts: async (): Promise<AxiosResponse<LayoutModel[], any>> => {
        return await request.get<LayoutModel[]>(`/${layoutUrl}/active`);
    },
    getallLayouts: async (model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${layoutUrl}/all`, model);
    },
    changeLayoutStatus: async (model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${layoutUrl}/status-change`, model);
    },
    getLayoutsbyFileID: async (fileId: number): Promise<AxiosResponse<any>> => {
        return await request.get<any>(`/${layoutUrl}/file/${fileId}`);
    },
    getFileTypesbyFileType: async (fileType: string): Promise<AxiosResponse<any>> => {
        return await request.get<any>(`/${layoutUrl}/file-type/${fileType}`);
    }
}