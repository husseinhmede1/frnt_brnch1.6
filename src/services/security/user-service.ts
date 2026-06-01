import { AxiosResponse } from "axios";
import { ILoginModel } from "../../models/login/LoginModel";
import {
    ChangePasswordReqModel,
    ForgotPasswordModel,
    GetUserById,
    UserChangeStatus,
    UserMainModel,
    UserModel,
    UserUnblock,
} from "../../models/security/UserModel";
import request from "../request";

export const UserService = {
    changePassword: async (model: any): Promise<AxiosResponse<ChangePasswordReqModel, any>> => {
        return await request.post<ChangePasswordReqModel>("/users/password-change", model);
    },

    resetPassword: async (model: ForgotPasswordModel): Promise<AxiosResponse<ForgotPasswordModel, any>> => {
        return await request.post<ForgotPasswordModel>("/users/password-reset", model);
    },

    getAllUsers: async (): Promise<AxiosResponse<UserModel[], any>> => {
        return await request.get<UserModel[]>("/users");
    },

    deleteUser: async (id: number): Promise<AxiosResponse<any>> => {
        return await request.delete<any>(`/users/${id}`);
    },

    changeUserStatus: async (model: UserChangeStatus): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/users/status-change`, model);
    },  
    unblockUser: async (model: UserUnblock): Promise<AxiosResponse<any>> => {
        return await request.post<any>(`/users/unblock`, model);
    },
    saveUser: async (model: UserMainModel): Promise<AxiosResponse<UserMainModel, any>> => {
        return await request.post<UserMainModel>(`/users`, model);
    },

    getUserById: async (model: GetUserById): Promise<AxiosResponse<UserMainModel, any>> => {
        return await request.post<UserMainModel>(`/users/user`,model);
    },
    getUsersByInstitution: async(id: string): Promise<AxiosResponse<UserModel[], any>> => {
        return await request.get<UserModel[]>(`/users/${id}/users`)
    }
};
