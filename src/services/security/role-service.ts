import { AxiosResponse } from "axios";
import {
  Activity,
  RoleMainModel,
  RoleModel,
} from "../../models/security/RoleModel";
import { UserChangeStatus } from "../../models/security/UserModel";
import request from "../request";

let roleList = [
  {
    roleId: 2,
    roleName: "celine",
    roleDesc: "celine role",
    status: "1",
  },
  {
    roleId: 3,
    roleName: "carmen",
    roleDesc: "carmen role",
    status: "1",
  },
  {
    roleId: 4,
    roleName: "alaa",
    roleDesc: "alaa role",
    status: "1",
  },
  {
    roleId: 5,
    roleName: "roy",
    roleDesc: "roy role",
    status: "1",
  },
  {
    roleId: 6,
    roleName: "clara",
    roleDesc: "clara role",
    status: "1",
  },
  {
    roleId: 7,
    roleName: "fado",
    roleDesc: "fadi role",
    status: "1",
  },
  {
    roleId: 8,
    roleName: "tarek test",
    roleDesc: "tarek role test",
    status: "1",
  },
  {
    roleId: 9,
    roleName: "tarek tes t",
    roleDesc: "tarek role  test",
    status: "1",
  },
  {
    roleId: 10,
    roleName: "tarek tes  t",
    roleDesc: "tarek role  test",
    status: "1",
  },
  {
    roleId: 11,
    roleName: "Lazy",
    roleDesc: "lazy",
    status: "1",
  },
  {
    roleId: 12,
    roleName: "inst",
    roleDesc: "inst",
    status: "1",
  },
];

export const RoleService = {
  getAllRoles: async (): Promise<AxiosResponse<RoleMainModel[], any>> => {
    return await request.get<RoleMainModel[]>(`/roles`);
  },
  saveRole: async (
    model: RoleMainModel
  ): Promise<AxiosResponse<RoleMainModel, any>> => {
    return await request.post<any>(`/roles`, model);
  },
  getRoleById: async (
    id: number
  ): Promise<AxiosResponse<RoleMainModel, any>> => {
    return await request.get<RoleMainModel>(`roles/${id}`);
  },
  deleteRole: async (id: number): Promise<AxiosResponse<any, any>> => {
    return await request.delete<any>(`roles/${id}`);
  },
  getActiveRolesByInstitution: async (): Promise<
    AxiosResponse<RoleMainModel[], any>
  > => {
    return await request.get<RoleMainModel[]>(`/roles/active`);
  },
  changeRoleStatus: async (
    model: UserChangeStatus
  ): Promise<AxiosResponse<any>> => {
    return await request.post<any>(`/roles/status-change`, model);
  },
};

export const ActivityService = {
  getAllActivities: async (): Promise<AxiosResponse<Activity[], any>> => {
    return await request.get<Activity[]>(`/activity`);
  },
  getActivityById: async (id: number): Promise<AxiosResponse<Activity[], any>> => {
    return await request.get<Activity[]>(`/activity/${id}`);
  }
};
