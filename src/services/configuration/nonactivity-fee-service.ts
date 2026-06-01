import { CardSchemeChangeStatus } from "../../models/configuration/CardSchemeModel";
import { AxiosResponse } from "axios";
import request from "../request";
import { ActivityFeesPackage, ActivityFeesPackageDefinationModel, ChargeTypeMaster, NoNActivityFeesPackageDefinationModel } from "../../models/configuration/ActivityFeesPackageModel";
import { EntityListModel } from "../../models/entityManagement/EntityModel";

export const NonActivityFeesPackagesService = {
    getAllNonActivityFeePackages: async (): Promise<AxiosResponse<ActivityFeesPackage[], any>> => {
        return await request.get<ActivityFeesPackage[]>("/nonactivityfeepackage")
    },
    getActiveNonActivityPackagesByInstitutionId: async (id: string): Promise<AxiosResponse<ActivityFeesPackage[], any>> => {
        return await request.get<ActivityFeesPackage[]>("/nonactivityfeepackage/active-nonactivity-packages/" + id)
    },
    getNonActivityFeePackageById: async (id: string,instId:string): Promise<AxiosResponse<ActivityFeesPackage>> => {
        return await request.get<ActivityFeesPackage>(`/nonactivityfeepackage/${id}/${instId}`)
    },
    getNonActivityByInstitutionId: async (id: string): Promise<AxiosResponse<ActivityFeesPackage[], any>> => {
        return await request.get<ActivityFeesPackage[]>("/nonactivityfeepackage/institution/" + id);
    },
    deleteNonActivityFeePackage: async (id: string,instId:string): Promise<AxiosResponse<ActivityFeesPackage, any>> => {
        return await request.delete<ActivityFeesPackage>(`/nonactivityfeepackage/${id}/${instId}`);
    },
    changeStatus: async (model: CardSchemeChangeStatus): Promise<AxiosResponse<ActivityFeesPackage, any>> => {
        return await request.post<ActivityFeesPackage>(`/nonactivityfeepackage/status-change`, model);
    },
    saveOrUpdateNonActivityFeePackage: async (model: any): Promise<AxiosResponse<ActivityFeesPackage, any>> => {
        return await request.post<ActivityFeesPackage>(`/nonactivityfeepackage`, model);
    },
    getAllNonActivityFeePackagesDefination: async (): Promise<AxiosResponse<ActivityFeesPackageDefinationModel[], any>> => {
        return await request.get<ActivityFeesPackageDefinationModel[]>("/nonactivityfeepackagedetails")
    },
    getAllNonActivityPackageDetailsByPackageId: async (id: string):
        Promise<AxiosResponse<NoNActivityFeesPackageDefinationModel>> => {
        return await request.get<NoNActivityFeesPackageDefinationModel>(
            `/nonactivityfeepackagedetails/package/${id}`
        );
    },
    getNonActivityFeePackageByIdDefination: async (id: number): Promise<AxiosResponse<NoNActivityFeesPackageDefinationModel>> => {
        return await request.get<NoNActivityFeesPackageDefinationModel>(`/nonactivityfeepackagedetails/${id}`)
    },
    getNonActivityFeePackagesByIdDefination: async (id: string, instId: string): Promise<AxiosResponse<NoNActivityFeesPackageDefinationModel>> => {
        return await request.get<NoNActivityFeesPackageDefinationModel>(`/nonactivityfeepackagedetails/${instId}/${id}`)
    },
    deleteNonActivityFeePackageDefination: async (id: number): Promise<AxiosResponse<NoNActivityFeesPackageDefinationModel, any>> => {
        return await request.delete<NoNActivityFeesPackageDefinationModel>(`/nonactivityfeepackagedetails/${id}`);
    },
    changeStatusDefination: async (model: CardSchemeChangeStatus): Promise<AxiosResponse<NoNActivityFeesPackageDefinationModel, any>> => {
        return await request.post<NoNActivityFeesPackageDefinationModel>(`/nonactivityfeepackagedetails/status-change`, model);
    },
    saveOrUpdateNonActivityFeePackageDefination: async (model: any): Promise<AxiosResponse<NoNActivityFeesPackageDefinationModel, any>> => {
        return await request.post<NoNActivityFeesPackageDefinationModel>(`/nonactivityfeepackagedetails`, model);
    },
    getAllChargeTypeMaster: async (): Promise<AxiosResponse<ChargeTypeMaster[], any>> => {
        return await request.get<ChargeTypeMaster[]>("/chargetypemaster")
    },
    defaultTransactionId: async (): Promise<AxiosResponse<ChargeTypeMaster[], any>> => {
        return await request.get<ChargeTypeMaster[]>("/defaulttransactionid")
    },
    mapPackageWithEntity: async (
        model: any
      ): Promise<AxiosResponse<any[], any>> => {
        return await request.post<any[]>(
          "/nonactivityfeepackage/assignment", model
        );
      },
      getAllMappedEntities: async (
        id: string
      ): Promise<AxiosResponse<EntityListModel[], any>> => {
        return await request.get<EntityListModel[]>(
          `/nonactivityfeepackage/mapped-entities/${id}`
        );
      },
}