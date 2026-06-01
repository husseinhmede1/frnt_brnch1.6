import { AxiosResponse } from "axios";
import request from "../request";
import {BlockedIpResponse,PaginationRequestDto} from '../../models/security/BlockedIpModel';


export const BlockedIpService = {
    getAllBlockedIps: async (): Promise<AxiosResponse<BlockedIpResponse[], any>> => {
        return await request.get<BlockedIpResponse[]>(`/blocked-ip/all`);
    },
    unblockIp: async (id: string): Promise<AxiosResponse<String, any>> => {
        return await request.post<string>(`/blocked-ip/unblock/${id}`);
    },
}