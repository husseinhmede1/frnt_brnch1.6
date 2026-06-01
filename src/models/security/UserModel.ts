import { NumbersOutlined } from "@mui/icons-material";
import { IInstitution } from "../login/LoginModel";
import { RoleMainModel } from "./RoleModel";

export class ChangePasswordReqModel {
    userId!: number;
    oldPassword!: string;
    newPassword!: string;
}

export class ChangePasswordModel {
    oldPassword!: string;
    newPassword!: string;
    confirmPassword!: string;
}

export class ForgotPasswordModel {
    userName!: string;
}

export class UserModel {
    email!: string;
    firstName!: string;
    instId!: string;
    instName!: string;
    lastName!: string;
    status!: string;
    userId!: number;
    username!: string;
    mobile!: string;
    preferedLanguage!: string;

}

export class UserChangeStatus {
    id!: number;
    idString!: string;
    status!: string;
}

export class UserUnblock {
    userId!: number;
}

export class GetUserById{
    userId!: Number;
    isUserProfile!: boolean;
}

export class RoleInst {
    institutionId!: string;
    institutionName!: string;
    roleId!: number;
    instName?: string;
    roleName?: string;
    status?: boolean;
}
export class UserMainModel {
    userId!: number;
    username!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    status!: string;
    lastLoginDate!: Date | string;
    userRoles?: RoleMainModel[];
    institution?: IInstitution[];
    preferedLanguage!: number;
    defaultInstitutionId!: string;
    defaultInstitutionName!: string;
    mobile!: string;
    institutionId?: string[];
    roleIds?: RoleInst[];
    preferedLanguageCodeDescription!: string;
    preferedLanguageCodePrefix!: string;
    preferedLanguageCodeSuffix!: string;
    preferedLanguageCodeValue!: string;
    preferedLanguageSystemCodeId!: number;
    isSystemAdmin!: boolean;
}

export class UserPaginationModel {
    asc!: boolean | string;
    offset!: number;
    pageSize!: number;
    sortBy!: string;
}