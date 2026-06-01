import { AxiosResponse } from "axios";
  import request from "../request";
import { CityByCountryIdModel, ContactDefinationModel, ContactGridModel } from "../../models/entityManagement/EntityModel";
import { CountryModel } from "../../models/configuration/CountryModel";
  
  export const ContactServices = {
    getAll: async (): Promise<AxiosResponse<ContactGridModel[], any>> => {
      return await request.get<ContactGridModel[]>("/contact");
    },
    getById: async (id: number): Promise<AxiosResponse<ContactGridModel>> => {
        return await request.get<ContactGridModel>(`/contact/${id}`)
    },
    deleteById: async (id: number | undefined): Promise<AxiosResponse<ContactGridModel, any>> => {
        return await request.delete<ContactGridModel>(`/contact/${id}`);
    },
    saveOrUpdate:  async (contact: ContactDefinationModel): Promise<AxiosResponse<ContactDefinationModel, any>> => {
        return await request.post<ContactDefinationModel>(`/contact`, contact);
    },
    getAllCitiesByCountryId: async (id: number): Promise<AxiosResponse<CityByCountryIdModel[]>> => {
        return await request.get<CityByCountryIdModel[]>(`/contact/country/${id}`)
    },
    getAllCountry: async (): Promise<AxiosResponse<CountryModel[]>> => {
        return await request.get<CountryModel[]>("/contact/countries")
    },
    getContactsByEntityId: async (id: string,instId:string): Promise<AxiosResponse<ContactGridModel[], any>> => {
      return await request.get<ContactGridModel[]>(`/contact/entities/${id}/${instId}`);
    },
  }