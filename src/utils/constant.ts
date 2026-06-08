import { env as envInject } from "../env";

export const ModuleDescription = {
  Card_Management: "Card Management",
  Settings: "Settings",
  Other: "Other",
  Reports: "Reports",
  Utilities: "Utilities",
  Configuration: "Configuration",
  Notifications: "Notifications",
  Routing: "Routing",
  Security: "Security",
  Dashboards: "Dashboards",
  AuditReports: "Audit Reports"
};

export const ConfigurationActivities = {
  AT_MNG: "AT_MNGE",
  CA_TXNVAL: "CA_TXNVAL",
  BN_MNGE: "BN_MNGE",
  RD_BLKLIST: "RD_BLKLIST",
  BR_MNGE: "BR_MNGE",
  CT_MNGE: "CT_MNGE",
  CO_MNGE: "CO_MNGE",
  CY_MNGE: "CY_MNGE",
  CC_MNGE: "CC_MNGE",
  TC_MNGE: "TC_MNGE",
  EC_MNGE: "EC_MNGE",
  EL_MNGE: "EL_MNGE",
  FDR_MNGE: "FDR_MNGE",
  GP_MNGE: "GP_MNGE",
  IN_MNGE: "IN_MNGE",
  ML_MNGE: "ML_MNGE",
  AI_MKCHECK: "AI_MKCHECK",
  NE_MNGE: "NE_MNGE",
  BD_MNGE: "BD_MNGE",
  OR_MNGE: "OR_MNGE",
  ST_MNGE: "ST_MNGE",
  MT_MNGE: "MT_MNGE",
  OT_MNGE: "OT_MNGE",
  FL_LAYOUT: "FL_LAYOUT",
  SC_MNGE: "SC_MNGE",
  SC_MAP: "SC_MAP",
  TXN_SECDEF: "TXN_SECDEF",
  NC_NETCON: "NC_NETCON",
  CH_MNGE: "CH_MNGE",
  CA_STTSRES: "CA_STTSRES",
  CA_STATUS: "CA_STATUS",
  CA_STTS: "CA_STTS",
  MF_MNGE: "MF_MNGE",
  BT_MNGE: "BT_MNGE", // VP: check once added in module activities response
  BALTYPE: "BALTYPE",
  LM_PR: "LM_PR",
  MP_DB:"MP_DB",
  FDR_PROM: "FDR_PROM",
  SEGMENT: "SEGMENT",
  SEGSETUP: "SEGSETUP",
  LR_LIMIT: "LR_LIMIT",
  IP_WHITLST: "IP_WHITLST",
  AT_PCODE: "AT_PCODE",
  MY_ACCOUNT: "MY_ACCT",
  ABOUT: "ABOUT",
  CUJ_MNG: "CUJ_MNG",
  // ── Confirmed DB activity codes ──────────────────────────────────
  APPRV_ENT:     "APPRV_ENT",
  MAKER_CHECKER: "MAKER_CHECKER",
  CURNCY:        "CURNCY",
  BLKD_IP:       "Blocked IP",
  CNTRY:         "CNTRY",
  CITY:          "CITY",
  MCC_SCREEN:    "MCC",
  CARDSCH:       "CARDSCH",
  INST:          "INST",
  TRNINQ:        "TRNINQ",
  MANTRANS:      "MANTRANS",
  MNNONACTFEE:   "MNNONACTFEE",
  NONACFEEINQ:   "NONACFEEINQ",
  MNGUSERS:      "MNGUSERS",
  MNGROLES:      "MNGROLES",
  SYS_CODES:     "SYSCD",
  CRNCY_CONV:    "CVCN",
  CRNCY_RATE:    "CVRT",
  BNKCD:         "BNKCD",
  ISSPR:         "ISSPR",
  DFTX:          "DFTX",
  TXN_GROUP:     "TXGRP",
  TERM_TYPE:     "TRMTP",
  EMPLOYEES:     "EMP",
  ENTITIES:      "ENT",
  ACT_FEE_PKG:   "ACTPK",
  NONACT_FEE_PKG:"NACTPK",
  FILES_SCREEN:  "FILES",
  LAYOUT_SCREEN: "LAYOUT",
};

export const StatusCode = {
    Success: 200,
    Created: 201,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    Conflict: 409,
    InternalServer: 500
};

export const ApplicationLanguage = {
    ENGLISH: "English",
    ARABIC: "Arabic"
}

export const fileLayoutSectionType = {
  Header: "H",
  Body: "B",
  Footer: "F"
}

export const LayoutDateElements = {
  DateOfBirth: "DATE_OF_BIRTH",
  ExpiryDate: "EXPIRY_DATE",
  IssueDate: "ISSUE_DATE",
  PassportNumberExpiryDate: "PASSPORT NUMBER EXPIRY DATE",
  NationalIdExpiryDate: "NATIONAL ID EXPIRY DATE",
  NationalExpiryDate :"NATIONAL_ID_EXPIRY_DATE",
  PassportExpiryDate : "PASSPORT_NUMBER_EXPIRY_DATE",
  FILLER : "FILLER"
}

export const fileFormatList = [
  {key: "2", value: "EXCEL"},
  {key: "3", value: "TEXT"},
  {key: "4", value: "CSV"},
  {key: "5", value: "DAT"}
]

export const InOut = {
  Input: "Input",
  Output: "Output"
}

export const CardActivities = {
  ApplyKYC: "Apply KYC",
  CardIssuance: "Card Issuance",
  CardActivation: "Card Activation",
  CardDelivery: "Card Delivery",
  CardStatusReset: "Card Status Reset",
  CardResetPINRetries: "Card Reset PIN Retries",
  OfflinePINReset: "Offline Reset Pin",
  CardEmbossing: "Card Embossing",
  CardStatus: "Card Status Reset",
  CardNonRenewal: "Card Non-Renewal",
  CardNonRenewalReset: "Card Non-Renewal Reset",
  CardUpdateServiceSet: "Card Update Service Set",
  CardActivityRenewal: "Card Activate Renewal",
  CallCenterActivityRenewal: "Call Center Activate Renewal",
  CardTerminate: "Card Terminate",
  CardBlock: "Card Block",
  CardPINReset: "Card PIN Reset",
  CardPINReIssue: "Card PIN Re-Issue",
  CardReplenishment: "Card Replenishment",
  CardDeplete: "Card Deplete",
  CardReEmbossing: "Card Re-Embossing",
  CardReplacement: "Card Replacement",
  CardReplacementFromStock: "Card Replacement Stock",
  CardSuspension: "Card Suspension",
  CardExceptionalRenewal: "Card Exceptional Renewal",
  CardRenewal: "Card Renewal",
  CardExceptionalEmbossing: "Card Exceptional Embossing",
  ResetOTP: "Reset OTP",
  CallCenterTermination: "Call Center Termination",
  CallCenterActivation: "Call Center Activation",
  Notification: "Notification",
  CardInstantIssuance: "Card Instant Issuance",
  CardHeritageReActivation: "Heritage Status Reset",
}

export const CodePrefix = {
    REPRESENT_RSN: "REPRESENT_RSN",
    REVERSAL_RSN: "REVERSAL_RSN",
    MAN_ACT_RSN: "MAN_ACT_RSN",
    MAN_NON_ACT_RSN: "MAN_NON_ACT_RSN",
    PREFERRED_LANGUAGE: "PREFERED_LANGUAGE",
    CHARGE_METHOD: "FEE_METHOD",
    CHARGE_TYPE_MASTER: "CHARGE_TYPE",
    FREQUENCY_MASTER: "MD_FREQUENCY_MASTER",
    INSTITUTION_TYPE: "INST_TYPE",
    MERCHANT_TYPE: "MERCHANT_TYPE",
    BUSINESS_TYPE: "BUSINESS_TYPE",
    ROLE_MASTER: "EMPLOYEE_ROLE",
    TRANS_FEE_TYPE: "TRANS_FEE_TYPE",
    TRANS_USAGE: "TRANS_USAGE",
    RATE_LIMIT: "RATE_LIMIT"
}

export const CodeSuffix = {
    GENERAL: "GENERAL",
    TRANS: "TRANS",
    FEE: "FEE",
    CAPACITY:"CAPACITY",
    DURATION_SEC:"DURATION_SEC"
}


export const Errors = {
    // ReferenceExists: "DataIntegrityViolationException",
    // institutionNotFound: "Institution Id not found",
    // uniqueCurrencyName: "Currency name already exists",
    // uniqueCurrencyCode: "Currency code already exists",
    // uniqueCurrencyNameAndCode: "Currency code and Currency name already exists!",
    uniqueEntity: "Entity Already Exists",
    // backDatedCurrencyRate: "Effective date can not be lesser than present day.",
    // ActivityAmountNotZero: "Fees Amount and % Amount both cannot be zero at the same time.",
    // uniqueInstitution: "Institution already exists!",
    // IdAlreadyExists: "Id Already exists",
    // representmentAlreadyDone: "Representment of this Transaction is already being done",
    // reversalAlreadyDone: "This transaction is already reversed",
    // transactionAlreadyProcessed: "This transaction is already processed",
    // incorrectUsername: "Username is Incorrect",

    // backDatedCurrencyRateErr: "Cannot Update back dated Entries.",
    // uniqueEntityDisplayErr: "Cannot Enable as Entity with same Name and Status Already Enabled",
    // NoDataFound: "No Data Found",
    // userDisable: "User is disabled",
    // userNameExist: "Username already exists!",
    // uniqueEmail: "Email already exists",
    // dataIntegrity: "DataIntegrityException",
    // defaultRole: "Default role is disabled",
    // RoleNameExist: "rolename already exist",
    // transIdNotFound: "TransId not found",
    // validInstId: "Enter Valid Institution Id",
    // invalidRole: "Invalid Role",
    // transactionGroupExists: "TransactionGroup Already Exists",
    // codeSuffixExists: "Code Suffix Already Exists!",
    // currencyConversionExists: "CurrencyConversion already exist with same data!",
    // currencyRateValueLarger:"value larger than specified precision allowed for column",
    // mccAlreadyExists:"MCC Already Exists with same card scheme!",
    // terminalTypeExists: "TerminalType Already Exists!",
    // uniqueIssuerProfile: "Issuer Profile already exists!",
    // uniqueIssuerRelation: "Issuer Relation already exists!",
    // uniquecBankInfo: "Bank Info already exists!"
}

export const TaskAbbrev = {
    IT: "IMPORT TASK",
    EP: "EOD PROCESSING",
    PAF: "PREPARE ACCOUTING FILE",
    EF: "EXPORT FILE",
    IM: "IMPORT MERCHANTS",
    ITER: "IMPORT TERMINALS"
};

export const TaskCmdNbr = {
    IT: 100,
    EP: 200,
    PAF: 300,
    EF: 400,
    IM: 500,
    ITER: 600,
    RLF: 700,
    REMC: 800,
    RAE: 900,
    LBF: 1000,
    PBF: 1100,
    REF: 1200,
};

export const TRANS_USAGE = {
    TRANS: "TRANS",
    ACTFEE: "FEE",
    NACT: "NACT"
}

export const ENTITY_LEVEL = {
    CHAIN: "CHAIN",
    MERCHANT: "MERCHANT",
    OUTLET: "OUTLET"
}

export type OptionType = {
    label?: string,
    value?: string,
    desc?: string,
}

export const ROLE_ACTIVITY = {
    Transactions_Inquiry: "Transactions Inquiry",
    Entities: "Entities",
    Manual_Transactions: "Manual Transactions",
    Manual_non_Activity_Fees: "Manual non Activity Fees",
    Non_Activity_Fees_Inquiry: "Non Activity Fees Inquiry",
    Institutions: "Institutions",
    Activity_Fees_Pkgs: "Activity Fees Pkgs",
    Non_Activity_Fees_Pkgs: "Non Activity Fees Pkgs",
    Employees: "Employees",
    Currency: "Currency",
    Currency_Conversion: "Currency Conversion",
    Currency_Rate: "Currency Rate",
    MCC: "MCC",
    Card_Scheme: "Card Scheme",
    Country: "Country",
    City: "City",
    Transaction_Group: "Transaction Group",
    Terminal_Type: "Terminal Type",
    Users: "Users",
    Roles: "Roles",
    System_Codes: "System Codes",
    Transactions: "Transactions",
    Issuer_Profile: "Issuer Profile",
    Bank_Info: "Bank Info",
    Institution_Accounts: "Institution Accounts",
    Accounting_Template: "Accounting Template",
    Output_File_Template: "Output File Template",
    Task_Execution: "Task Execution",
    Task_Execution_Log: "Task Execution Log",
    Import_Jobs: "Import Jobs",
    Campaigns:"Campaigns",
    Newsletters:"Newsletters",
    Services:"Services",
    ApprovingEntities:"ApprovingEntities",
    MPRoles: "MPRoles",
    BlockedIP: "Blocked IP",
    JOBS: "JOBS",
    JobsMonitoring: "JobsMonitoring",
    TaskBatchSize: "TaskBatchSize",
    File_Layouts: "Files",
    Layouts: "Layout",
    Maker_Checker_Configuration: "Maker Checker Configuration",
}
export const TransactionTypeForJob = {
  Annual_Fee:"Annual Fee",
  SMS_Fee:"SMS Fee"
}

export const jobMonitoringStatus = {
  NonSchedule: "Non Scheduled",
  InProgress: "In Progress",
  Schedule: "Scheduled"
}

export const JobTaskParams = {
  Bin: "Bin",
  Layout: "Layout",
  Merchant: "Merchant",
  Outlet: "Outlet",
  CardType: "Card Type",
  StockId: "Stock Id",
  CardTypeType: "Card Type Type",
  Range: "Range",
  SourceFolder: "Source Folder",
  DestinationFolder: "Destination Folder",
  AckFolder: "Acknowledgment Folder",
  BINSubRange: "Range",
  ProductType: "Product Type",
  DaysInterval: "Time Interval",
  FromDate: "From Date",
  ToDate:"To Date",
  ReconType: "Recon Type",
  ChannelCode: "Channel Code",
  ExpiryDate: "Expiry Date",
  CardStatus: "Card Status",
  InitialNormal: "Initial/Normal",
  AllowActivities: "Allow Activities",
  MonthYear: "Month Year",
  Branch: "Branch",
  fromTime: "From Time",
  toTime: "To Time",
  MonthDuration: "Month Duration",
  CardSubType: "Card Sub Type",
  FileId: "File Id",
  ExecutionId: "Execution Id",
  BankCode: "Bank Code",
  TransactionIds:"Transaction Id List",
  OutputFileType:"Output File Type",
  OutputFileTypeAbbrev:"Output File Type Abbrev",

}

export const ScopeAbbrev = {
  CT: "CT",
  CU: "CU",
  IN: "IN",
  CA: "CA",
  CO: "CO",
  BN: "BN",
  TC: "TC",
  CAScopeId: 1,
  CTScopeId: 2,
  CUScopeId: 3,
};

export const rowsPerPageOptionsConst = [10, 20, 50]

let envCache: Record<string, string> | null = null;

const getEnvCache = () => {
  if (!envCache) {
    envCache = {
      REACT_APP_VERSION: envInject.REACT_APP_VERSION ?? "",
      REACT_APP_TYPE1: envInject.REACT_APP_TYPE1 ?? "",
      REACT_APP_TYPE2: envInject.REACT_APP_TYPE2 ?? "",
      REACT_APP_TYPE3: envInject.REACT_APP_TYPE3 ?? "",
      REACT_APP_TYPE4: envInject.REACT_APP_TYPE4 ?? "",
      REACT_APP_TYPE5: envInject.REACT_APP_TYPE5 ?? "",
      REACT_APP_TYPE6: envInject.REACT_APP_TYPE6 ?? "",
      REACT_APP_TYPE7: envInject.REACT_APP_TYPE7 ?? "",
      REACT_APP_TYPE8: envInject.REACT_APP_TYPE8 ?? "",
      REACT_APP_TYPE9: envInject.REACT_APP_TYPE9 ?? "",
      REACT_APP_TYPE10: envInject.REACT_APP_TYPE10 ?? "",
      REACT_APP_TYPE11: envInject.REACT_APP_TYPE11 ?? "",
    };
  }
  return envCache;
};


export const getVersion = () => getEnvCache().REACT_APP_VERSION ?? "";
export const getType1 = () => getEnvCache().REACT_APP_TYPE1 ?? "";
export const getType2 = () => getEnvCache().REACT_APP_TYPE2 ?? "";
export const getType3 = () => getEnvCache().REACT_APP_TYPE3 ?? "";
export const getType4 = () => getEnvCache().REACT_APP_TYPE4 ?? "";
export const getType5 = () => getEnvCache().REACT_APP_TYPE5 ?? "";
export const getType6 = () => getEnvCache().REACT_APP_TYPE6 ?? "";
export const getType7 = () => getEnvCache().REACT_APP_TYPE7 ?? "";
export const getType8 = () => getEnvCache().REACT_APP_TYPE8 ?? "";
export const getType9 = () => getEnvCache().REACT_APP_TYPE9 ?? "";
export const getType10 = () => getEnvCache().REACT_APP_TYPE10 ?? "";
export const getType11 = () => getEnvCache().REACT_APP_TYPE11 ?? "";


export const hoursConst = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
export const minutesConst = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]
export const rowsPerPageOptions = [25, 50, 100]