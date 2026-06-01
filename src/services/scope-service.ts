import ScopeModel from "../models/configuration/ScopeModel";
import request from "../services/request";
import { getType2, getType4, getVersion } from "../utils/constant";
import { AxiosResponse } from "axios"

export const scopeUrl: string = `${getVersion()}/${getType2()}/scopes`;
export const lookupScopeUrl: string = `${getVersion()}/${getType2()}/lookup-scopes`;
export const promotionUrl: string = `${getVersion()}/${getType4()}/fee-definition`;
export const ScopeService = {
    getAllScopes: async (): Promise<AxiosResponse<ScopeModel[], any>> => {
        return await request.get<ScopeModel[]>(`/${scopeUrl}`);
    },

    getScopeById: async (id: number): Promise<AxiosResponse<ScopeModel, any>> => {
        return await request.get<ScopeModel>(`/${scopeUrl}/${id}`);
    },

    getActiveScopes: async (): Promise<AxiosResponse<ScopeModel[], any>> => {
        return await request.get<ScopeModel[]>(`/${scopeUrl}/active`);
    },

    getActiveDropdownScopes: async (): Promise<AxiosResponse<ScopeModel[], any>> => {
        return await request.get<ScopeModel[]>(`/${scopeUrl}/active/dropdown`);
    },

    getScopeByScopeAbbrev: async (scopeAbbrev: string): Promise<AxiosResponse<ScopeModel, any>> => {
        return await request.get<ScopeModel>(`/${scopeUrl}/abbrev/${scopeAbbrev}`);
    },

    getActiveDropdownLookupScopes: async (): Promise<AxiosResponse<ScopeModel[], any>> => {
        return await request.get<ScopeModel[]>(`/${lookupScopeUrl}/active`);
    },
    getActiveLookupScopesByActivity: async (activityCode: string): Promise<AxiosResponse<ScopeModel[], any>> => {
        return await request.get<ScopeModel[]>(`/${lookupScopeUrl}/activity/${activityCode}`);
    }
}

export const PromotionService = {
    savePromotion: async (model: any): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/${promotionUrl}/promotion`, model);
    },
}