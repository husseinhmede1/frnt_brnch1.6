export class EmployeeModel {
    employeeId!: number;
    institutionId!: string;
    institutionName!: string;
    employeeName!: string;
    employeeRoleId!: number;
    employeeRoleName!: string;
    employeePhone!: string;
    employeeExt!: string;
    status!: string;
    employeeRoleSystemCodeId!: number;
    employeeRoleCodeSuffix!: string;
    employeeRoleCodePrefix!: string;
    employeeRoleCodeValue!: string;
    employeeRoleCodeDescription!: string;
}

export class EmployeeChangeStatusModel {
    id!: number;
    status!: string
}