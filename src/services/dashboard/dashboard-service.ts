import {
  PageableListOfCardsResponseDto,
  PendingActivitiesModel,
  QuickLinkByInst,
  QuickLinkByUser,
  QuickLinkPost,
  QuickLinksDashboardDto,
  QuickLinksDashboardResponseDto,
  QuickSearchModel,
  QuickSearchPostModel,
} from "../../models/Dashboard/Dashboard";
import request from "../../services/request";
import { getType1, getType5, getVersion } from "../../utils/constant";
import { AxiosResponse } from "axios";

const QuickSearchUrl: string = `${getVersion()}/${getType5()}/quick-search`;
const QuickLinkUrl: string = `${getVersion()}/${getType1()}/quick-links`;
const pendingUrl: string = `${getVersion()}/checker/pending-activities`;
const pendingDashboardUrl: string = `${getVersion()}/dashboard/pending-activities`;

export const QuickSearchService = {
  getQuickSearchResult: async (model: QuickSearchPostModel): Promise<AxiosResponse<PageableListOfCardsResponseDto>> => {
    return await request.post<PageableListOfCardsResponseDto>(`/${QuickSearchUrl}`, model);
  },
};

export const QuickLinkService = {
  getQuickLinksByUser: async (): Promise<AxiosResponse<QuickLinkByUser[], any>> => {
    return await request.get<QuickLinkByUser[]>(`/${QuickLinkUrl}/user`);
  },
  addUserQuickLinks: async (model: QuickLinkPost): Promise<AxiosResponse<QuickLinkByUser[], any>> => {
    return await request.post<QuickLinkByUser[]>(`/${QuickLinkUrl}`, model);
  },
  getQuickLinksByInstId: async (): Promise<AxiosResponse<QuickLinkByInst[], any>> => {
    return await request.get<QuickLinkByInst[]>(`/${QuickLinkUrl}`);
  },
  getQuickLinksDashboard: async (): Promise<AxiosResponse<QuickLinksDashboardDto[], any>> => {
    // return await request.get<QuickLinksDashboardResponseDto>(`/${QuickLinkUrl}/dashboard`);
    return await request.get<QuickLinksDashboardDto[]>(`/${QuickLinkUrl}/dashboard`);
  },
};

export const PendingActivityService = {
  getPendingActivitybyID: async (id: number): Promise<AxiosResponse<any>> => {
    return await request.get<any>(`/${pendingUrl}/${id}`);
  },
  getPendingActivities: async (id: number): Promise<AxiosResponse<PendingActivitiesModel[], any>> => {
    return await request.get<PendingActivitiesModel[]>(`/${pendingUrl}/api/${id}`);
  },
  approve: async (model: any): Promise<AxiosResponse<any>> => {
    return await request.post<any>(`/${pendingUrl}/approve`, model);
  },
  getPendingActivitiesDashboard: async (model: any): Promise<AxiosResponse<any>> => {
    return await request.post<PendingActivitiesModel[]>(`/${pendingDashboardUrl}`, model);
  },
  discard: async (model: any): Promise<AxiosResponse<any>> => {
    return await request.post<any>(`/${pendingUrl}/discard`, model);
  },
  getFunctionsByScope: async (scopeId: any, financialValue: any): Promise<AxiosResponse<any>> => {
    return await request.get<String[]>(`/${pendingUrl}/function/${scopeId}/${financialValue}`);
  },
  getUsersByScope: async (scopeId: any): Promise<AxiosResponse<any>> => {
    return await request.get<String[]>(`/${pendingUrl}/users/${scopeId}`);
  },
  reject: async (model: any): Promise<AxiosResponse<any>> => {
    return await request.post<any>(`/${pendingUrl}/reject`, model);
  },
  returnToMaker: async (model: any): Promise<AxiosResponse<any>> => {
    return await request.post<any>(`/${pendingUrl}/return`, model);
  },
  getPendingActivitiesByScope: async (model: any): Promise<AxiosResponse<any>> => {
    return await request.post<PendingActivitiesModel[]>(`/${pendingUrl}/scope`, model);
  },
  getPendingActivitiesByStatus: async (id: number): Promise<AxiosResponse<PendingActivitiesModel[], any>> => {
    return await request.get<PendingActivitiesModel[]>(`/${pendingUrl}/status/${id}`);
  },
  getPendingActivitiesByUser: async (id: number): Promise<AxiosResponse<PendingActivitiesModel[], any>> => {
    return await request.get<PendingActivitiesModel[]>(`/${pendingUrl}/user/${id}`);
  }
};
