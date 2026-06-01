import { AxiosResponse } from "axios";
import request from "../request";
import { getVersion } from "../../utils/constant";
import {
    PageablePendingActivityResponse,
    PendingActivitySearchRequest,
} from "../../models/pending/PendingActivityModel";

const baseUrl = `${getVersion()}/checker/pending-activities`;

export const PendingActivityService = {
    search: (model: PendingActivitySearchRequest): Promise<AxiosResponse<PageablePendingActivityResponse>> =>
        request.post<PageablePendingActivityResponse>(`/${baseUrl}/search`, model),

    approve: (id: number): Promise<AxiosResponse<string>> =>
        request.post<string>(`/${baseUrl}/${id}/approve`, {}),

    reject: (id: number, note: string): Promise<AxiosResponse<string>> =>
        request.post<string>(`/${baseUrl}/${id}/reject`, { note }),
};
