import { RoleMainModel } from "../security/RoleModel";
import { UserMainModel } from "../security/UserModel";

export interface IInstitution {
    institutionId: string;
    institutionName: string;
    institutionTypeAlt: string;
    status: string;
}
export interface ILoginModel {
    username: string;
    password: string;
}

export interface ILoginResponse {
    refreshToken: string;
    token: string;
    user: UserMainModel;
};

