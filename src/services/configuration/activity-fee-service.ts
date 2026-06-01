import { CardSchemeChangeStatus } from "../../models/configuration/CardSchemeModel";
import { AxiosResponse } from "axios";
import request from "../request";
import {
  ActivityFeesChargeDetailModel,
  ActivityFeesPackage,
  ActivityFeesPackageChargeModel,
  ActivityFeesPackageDefinationModel,
  ActivityFeesRecordModel,
  IChargeMethod,
  IFrequency,
  IIssuer,
} from "../../models/configuration/ActivityFeesPackageModel";
import { EntityListModel } from "../../models/entityManagement/EntityModel";

export const ActivityFeesPackagesService = {
  getAllActivityFeePackages: async (): Promise<
    AxiosResponse<ActivityFeesPackage[], any>
  > => {
    return await request.get<ActivityFeesPackage[]>("/activityfeepackage");
  },

  getActiveActivityPackageByInstitutionId: async (
    id: string
  ): Promise<AxiosResponse<ActivityFeesPackage[], any>> => {
    return await request.get<ActivityFeesPackage[]>(
      "/activityfeepackage/active-activitypackage/" + id
    );
  },
  getActivityByInstitutionId: async (
    id: string
  ): Promise<AxiosResponse<ActivityFeesPackage[], any>> => {
    return await request.get<ActivityFeesPackage[]>(
      "/activityfeepackage/institution/" + id
    );
  },
  getActivityFeePackageById: async (
    id: string
  ): Promise<AxiosResponse<ActivityFeesPackage>> => {
    return await request.get<ActivityFeesPackage>(`/activityfeepackage/${id}`);
  },
  deleteActivityFeePackage: async (
    id: number
  ): Promise<AxiosResponse<ActivityFeesPackage, any>> => {
    return await request.delete<ActivityFeesPackage>(
      `/activityfeepackage/${id}`
    );
  },
  changeStatus: async (
    model: CardSchemeChangeStatus
  ): Promise<AxiosResponse<ActivityFeesPackage, any>> => {
    return await request.post<ActivityFeesPackage>(
      `/activityfeepackage/status-change`,
      model
    );
  },
  saveOrUpdateActivityFeePackage: async (
    model: any
  ): Promise<AxiosResponse<ActivityFeesPackage, any>> => {
    return await request.post<ActivityFeesPackage>(
      `/activityfeepackage`,
      model
    );
  },
  getAllActivityFeePackagesDefination: async (
    id: string,instId:string
  ): Promise<AxiosResponse<ActivityFeesPackageDefinationModel>> => {
    return await request.get<ActivityFeesPackageDefinationModel>(
      `/activityfeepackagedefination/activitypackage/${id}/${instId}`
    );
  },
  deleteActivityFeePackageDefination: async (
    id: number
  ): Promise<AxiosResponse<any, any>> => {
    return await request.delete<String>(
      `/activityfeepackagedefination/${id}`
    );
  },
  changeStatusDefination: async (
    model: CardSchemeChangeStatus
  ): Promise<AxiosResponse<ActivityFeesPackageDefinationModel, any>> => {
    return await request.post<ActivityFeesPackageDefinationModel>(
      `/activityfeepackagedefination/status-change`,
      model
    );
  },
  saveOrUpdateActivityFeePackageDefination: async (
    model: any
  ): Promise<AxiosResponse<ActivityFeesPackageDefinationModel, any>> => {
    return await request.post<ActivityFeesPackageDefinationModel>(
      `/activityfeepackagedefination`,
      model
    );
  },
  getActivityFeePackageDetailByIdDefination: async (
    id: number
  ): Promise<AxiosResponse<ActivityFeesRecordModel>> => {
    return await request.get<ActivityFeesRecordModel>(
      `/activityfeepackagedefination/packagedetailid/${id}`
    );
  },
  getFrequencyList: async (): Promise<AxiosResponse<IFrequency[], any>> => {
    return await request.get<IFrequency[]>(`/frequency`);
  },
  getChargeList: async (): Promise<AxiosResponse<IChargeMethod[], any>> => {
    return await request.get<IChargeMethod[]>(`/chargeMethod`);
  },
  saveOrUpdateActivityFeePackageChargeDetails: async (
    model: any
  ): Promise<AxiosResponse<ActivityFeesChargeDetailModel, any>> => {
    return await request.post<ActivityFeesChargeDetailModel>(
      `/activityfeepackagechargedetail`,
      model
    );
  },
  getIssuerList: async (): Promise<AxiosResponse<IIssuer[], any>> => {
    return await request.get<IIssuer[]>(`/issuer`);
  },
  saveOrUpdateActivityFeePackageCharge: async (
    model: any
  ): Promise<AxiosResponse<ActivityFeesPackageChargeModel, any>> => {
    return await request.post<ActivityFeesPackageChargeModel>(
      `/activityfeepackagechargedetail`,
      model
    );
  },
  deleteActivityFeePackageCharge: async (
    id: number
  ): Promise<AxiosResponse<ActivityFeesPackageChargeModel, any>> => {
    return await request.delete<ActivityFeesPackageChargeModel>(
      `/activityfeepackagechargedetail/${id}`
    );
  },
  getActivityFeePackageDetailByIdCharge: async (
    id: number
  ): Promise<AxiosResponse<ActivityFeesPackageChargeModel, any>> => {
    return await request.get<ActivityFeesPackageChargeModel>(
      `/activityfeepackagechargedetail/packagetier/${id}`
    );
  },
  getActivityFeePackageDetailCharge: async (
    id: number
  ): Promise<AxiosResponse<ActivityFeesPackageChargeModel[], any>> => {
    return await request.get<ActivityFeesPackageChargeModel[]>(
      `/activityfeepackagechargedetail/packagedetail/${id}`
    );
  },
  mapPackageWithEntity: async (
    model: any
  ): Promise<AxiosResponse<any[], any>> => {
    return await request.post<any[]>(
      "/activityfeepackage/assignment", model
    );
  },
  getAllMappedEntities: async (
    id: string,instId:string
  ): Promise<AxiosResponse<EntityListModel[], any>> => {
    return await request.get<EntityListModel[]>(
      `/activityfeepackage/mapped-entities/${id}/${instId}`
    );
  },
};
