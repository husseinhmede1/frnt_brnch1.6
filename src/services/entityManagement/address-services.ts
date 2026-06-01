import { AxiosResponse } from "axios";
  import request from "../request";
import { CityByCountryIdModel, ContactDefinationModel, EntityAddressModel } from "../../models/entityManagement/EntityModel";
import { CountryModel } from "../../models/configuration/CountryModel";
  
  export const AddressServices = {
    getAll: async (): Promise<AxiosResponse<EntityAddressModel[], any>> => {
      return await request.get<EntityAddressModel[]>("/address");
    },
    getByEntityId: async (id: string): Promise<AxiosResponse<EntityAddressModel>> => {
        return await request.get<EntityAddressModel>(`/address/entities/${id}`)
    },
    deleteById: async (id: number | undefined): Promise<AxiosResponse<EntityAddressModel, any>> => {
        return await request.delete<EntityAddressModel>(`/address/${id}`);
    },
    saveOrUpdate:  async (address: EntityAddressModel): Promise<AxiosResponse<EntityAddressModel, any>> => {
        return await request.post<ContactDefinationModel>(`/address`, address);
    },
    getAllCitiesByCountryId: async (id: number): Promise<AxiosResponse<CityByCountryIdModel[]>> => {
        return await request.get<CityByCountryIdModel[]>(`/address/country/${id}`)
    },
    getAllCountry: async (): Promise<AxiosResponse<CountryModel[]>> => {
        return await request.get<CountryModel[]>("/address/countries")
    },
  }