import { AxiosResponse } from "axios";
import request from "../request";
import { EntityChangeStatusModel, EntityDefinitionModel, EntityLevelModel, EntityListByLevelModel,EntitySearchCriteria, EntityListModel, EntitySearchRequestModel, TransactionsMerchantList } from "../../models/entityManagement/EntityModel";
import { BusinessTypeModel } from "../../models/configuration/BusinessTypeModel";
import { PageResponseModel } from "../../models/configuration/PageResponseModel";

export const EntityService = {
  getByInstituteId: async (id: string): Promise<AxiosResponse<any, any>> => {
    return await request.post<any>(`/entities/institution`, { institutionId: id });
  },
  getAll: async (): Promise<AxiosResponse<EntityListModel[], any>> => {
    return await request.get<EntityListModel[]>("/entities");
  },
  getAllActiveEntities: async (): Promise<AxiosResponse<EntityListModel[], any>> => {
    return await request.get<EntityListModel[]>("/entities/active-entities");
  },
  getById: async (id: string,instId:any): Promise<AxiosResponse<EntityDefinitionModel>> => {
    return await request.get<EntityDefinitionModel>(`/entities/${id}/${instId}`)
  },
  getByInstitutionId: async (id: string): Promise<AxiosResponse<EntityListModel[], any>> => {
    return await request.get<EntityListModel[]>(`/entities/institution/${id}`)
  },
  getAllEntityLevel: async (): Promise<AxiosResponse<EntityLevelModel[], any>> => {
    return await request.get<EntityLevelModel[]>("/entitylevels");
  },
  getAllEntityLevelsByInstitutionId: async (instId: string): Promise<AxiosResponse<EntityLevelModel[], any>> => {
    return await request.get<EntityLevelModel[]>(`/entitylevels/institution/${instId}`)
  },
  getAllBusinessType: async (): Promise<AxiosResponse<BusinessTypeModel[], any>> => {
    return await request.get<BusinessTypeModel[]>("/businesstype");
  },
  saveOrUpdate: async (model: any): Promise<AxiosResponse<EntityDefinitionModel, any>> => {
    return await request.post<EntityDefinitionModel>(`/entities`, model);
  },
  saveCloneEntity: async (model: any,id: any): Promise<AxiosResponse<EntityDefinitionModel, any>> => {
    return await request.post<EntityDefinitionModel>(`/entities/save-clone/${id}`, model);
  },
  changeStatus: async (model: any,instId:any): Promise<AxiosResponse<EntityListModel, any>> => {
    return await request.post<EntityListModel>(`/entities/status-change/${instId}`, model);
  },
  hasChildrenEntities: async (id: any): Promise<AxiosResponse<Boolean, any>> => {
    return await request.get<Boolean>(`/entities/has-children/${id}`);
  },
  deleteById: async (
    id: string
    ,instId:any
  ): Promise<AxiosResponse<any, any>> => {
    return await request.delete<any>(`/entities/${id}/${instId}`);
  },
  search: async (model: EntitySearchRequestModel): Promise<AxiosResponse<PageResponseModel<EntityListModel>, any>> => {
    return await request.post<PageResponseModel<EntityListModel>>(`/entities/search`, model);
  },
  searchCriteria: async (model: EntitySearchCriteria): Promise<AxiosResponse<PageResponseModel<EntityListModel>, any>> => {
    return await request.post<PageResponseModel<EntityListModel>>(`/entities/search`, model);
  },
  cloneEntity: async (id: string,instId:string): Promise<AxiosResponse<EntityDefinitionModel>> => {
    return await request.get<EntityDefinitionModel>(`/entities/clone/${id}/${instId}`)

  },
  getEntitiesByEntityLevelAndInstitution: async (model: EntityListByLevelModel): Promise<AxiosResponse<EntityListModel[], any>> => {
    return await request.post<EntityListModel[]>("/entities/entitylevel/institution", model);
  },
  getEntitiesByEntityLevelNameAndInstitution: async (model: EntityListByLevelModel): Promise<AxiosResponse<EntityListModel[], any>> => {
    return await request.post<EntityListModel[]>("/entities/outlet", model);
  },
  getEntitiesBySearchCriteria: async (model: any): Promise<AxiosResponse<EntityListModel[], any>> => {
    return await request.post<EntityListModel[]>(`/entities/filter`, model);
  },
  getTransactionsEntityNames: async (instId: any): Promise<AxiosResponse<TransactionsMerchantList[], any>> => {
    return await request.get<TransactionsMerchantList[]>(`/entities/transaction-merchant-names/${instId}`);
  },
}
