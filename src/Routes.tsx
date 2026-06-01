import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import Dashboard from "../src/pages/Dashboard";
import InstitutionsListing from "./pages/InstitutionsListing";
import InstitutionsDefinition from "../src/pages/InstitutionsDefinition";
import TransactionGroupsListing from "./pages/TransactionGroups";
import Currency from "../src/pages/Currency";
import CardScheme from "./pages/CardSchemeListing";
import CardSchemeDefinition from "./pages/CardSchemeDefinition";
import ProtectedRoute from "./components/ProtectedRoute";
import ActivityProtectedRoute from "./components/ActivityProtectedRoute";
import CurrencyConversion from "./pages/CurrencyConversion";
import TerminalType from "./pages/TerminalType";
import CurrencyRate from "./pages/CurrencyRate";
import CountriesListing from "./pages/CountriesListing";
import CitiesListing from "./pages/CitiesListing";
import Mcc from "./pages/MCC";
import EntitiesListing from "./pages/EntitiesListing";
import Employees from "./pages/Employees";
import ActivityFeesPackagesListing from "./pages/ActivityFeesPackagesListing";
import ActivityFeesPackageDefinition from "./pages/ActivityFeesPackagesDefinition";
import NonActivityFeesPackagesDefinition from "./pages/NonActivityFeesPackagesDefinition";
import NonActivityFeesPackagesListing from "./pages/NonActivityFeesPackagesListing";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import EntitiesDefinition from "./pages/EntitiesDefinition";
import MerchantTransacionDefinition from "./pages/MerchantTransactionDefinition";
import MerchantTransactionListing from "./pages/MerchantTransactionListing";
import ManualNonActivityFeesListing from "./pages/ManualNonActivityFeesTransactionListing";
import ManualNonActivityFeesDefinition from "./pages/ManualNonActivityFeesTransactionDefinition";
import NonActivityFeeQuery from "./pages/NonActivityFeeQuery";
import NotFound from "./components/NotFound";
import PendingActivities from "./pages/PendingActivity";

// UI
import DesignerLogin from "../src/pages/UI/Login/index";
import DesignerReset from "../src/pages/UI/Login/changed-pass";
import DesignerForgot from "../src/pages/UI/Login/forgot-pass";
import DesignerInstitutionList from "../src/pages/UI/Institution-Management/List";
import DesignerInstitutionAdd from "../src/pages/UI/Institution-Management/add";
import DesignerCurrencyList from "../src/pages/UI/Currency-management/List";
import DesignerCardSchemeList from "../src/pages/UI/Card-Scheme-Management/List";
import DesignerCardSchemeAdd from "../src/pages/UI/Card-Scheme-Management/add";
import DesignerTransactionGrp from "../src/pages/UI/Transaction-Groups/List";
import DesignerTerminalType from "../src/pages/UI/Terminal-type/List";
import DesignerActivityFeesPackagesList from "../src/pages/UI/Activity-Fees-Packages/List";
import DesignerActivityFeesPackageDefinition from "../src/pages/UI/Activity-Fees-Packages/ActivityFeesPackageDefinition";
import DesignerNonActivityFeesPackagesList from "../src/pages/UI/Non-Activity-Fees-Packages/List";
import DesignerNonActivityFeesPackageDefinition from "../src/pages/UI/Non-Activity-Fees-Packages/NonActivityFeesPackageDefinition";
import DesignerCurrencyConversion from "../src/pages/UI/Currency-conversion/List";
import DesignerCurrencyRate from "../src/pages/UI/Currency-rate/List";
import DesignerEmployees from "../src/pages/UI/Employees/Employees";
import DesignerContacts from "../src/pages/UI/Contacts/Contacts";
import DesignerMcc from "../src/pages/UI/Mcc/List";
import DesignerManageCountry from "../src/pages/UI/Manage-countries/List";
import DesignerLanding from "./pages/UI/Landing-page";
import DesignerChangePass from "../src/pages/UI/Login/changed-password";
import DesignerEntities from "../src/pages/UI/Entities/List";
import DesignerAddEntities from "../src/pages/UI/Entities/AddUpdate";
import DesignerAcquiringTransactions from "../src/pages/UI/Acquiring-Transactions/List";
import DesignerManualMerchantTransactionList from "./pages/UI/Manual-Merchant-Transaction/List";
import DesignerManualMerchantTransactionAdd from "./pages/UI/Manual-Merchant-Transaction/add";
import DesignerManualNonActivityFeeTransactionList from "./pages/UI/Manual-non-Activity-fee-transaction/List";
import DesignerManualNonActivityFeeTransactionAdd from "./pages/UI/Manual-non-Activity-fee-transaction/add";
import DesignerNonActivityFeeQuery from "./pages/UI/Non-Activity-Fee-Query/List";
import AcquiringTransactions from "./pages/AcquiringTransactionsListing";
import Users from "./pages/Users";
import UserDefinition from "./pages/UserDefinition";
import Roles from "./pages/Roles";
import RoleDefinition from "./pages/RoleDefinition";
import BlockedIp from "./pages/BlockedIp/index";
import Transactions from "./pages/Transactions";
import SystemCodes from "./pages/SystemCodes";
import UnauthorisedPage from "./components/UnauthorisedPage";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "./utils/helper";
import IssuerProfile from "./pages/IssuerProfile";
import RangeDefinition from "./pages/RangeDefinition";
import IssuerRelation from "./pages/IssuerRelation";
import BankInfo from "./pages/BankInfo";
import TaskExecution from "./pages/TaskExecution";
import InstitutionAccounts from "./pages/InstitutionAccounts";
import InstitutionAccountsDefinition from "./pages/InstitutionAccountsDefinition";
import AccountingTemplatesHDR from "./pages/AccountingTemplatesHDR";
import AccountingTemplateDetails from "./pages/AccountingTemplateDetails";
import OutputFileTemplateHdr from "./pages/OutputFileTemplateHdr";
import OutputFileTemplateDetails from "./pages/OutputFileTemplateDetails";
import TaskExecutionLog from "./pages/TaskExecutionLog";
import AccountingTemplateBank from "./pages/AccountingTemplateBank";
import ImportMerchants from "./pages/ImportMerchants";
import SmartMdrReport from './pages/SmartMdrReport';
import SmartCicoReport from './pages/SmartCicoReport';
import SmartMerchantDetailsReport from './pages/SmartMerchantDetailsReport';
import Jobs from "./pages/Jobs/Jobs";
import TaskBatchSize from "./pages/TaskBatchSize/TaskBatchSize";
import JobMonitoring from "./pages/JobMonitoring/JobMonitoring";
import JobExecutionLog from "./pages/JobMonitoring/JobExecutionLog";
import JobDefinition from "./pages/JobDefinition/JobDefinition";
import FilesLayout from "./pages/FilesLayout";
import AddEditFileLayout from "./pages/NewFileLayout";
import DesignerMakerCheckerConfiguration from "./pages/MakerCheckerConfiguration";
import { ConfigurationActivities } from "./utils/constant";

// Shorthand helpers to keep JSX concise
const AP = (code: string, child: React.ReactNode) => (
    <ActivityProtectedRoute activityCode={code}>{child}</ActivityProtectedRoute>
);
const PR = (child: React.ReactNode) => (
    <ProtectedRoute>{child}</ProtectedRoute>
);

function RouteList() {
    return (
        <Routes>
            {/* ── Designer / UI preview routes (no auth needed) ── */}
            <Route path="/designer/login"                         element={<DesignerLogin />} />
            <Route path="/designer/forgot"                        element={<DesignerForgot />} />
            <Route path="/designer/reset"                         element={<DesignerReset />} />
            <Route path="/designer/change-password"               element={<DesignerChangePass />} />
            <Route path="/designer/home"                          element={<DesignerLanding />} />
            <Route path="/designer/institution/list"              element={<DesignerInstitutionList />} />
            <Route path="/designer/institution/add"               element={<DesignerInstitutionAdd />} />
            <Route path="/designer/currency/list"                 element={<DesignerCurrencyList />} />
            <Route path="/designer/card-scheme/list"              element={<DesignerCardSchemeList />} />
            <Route path="/designer/card-scheme/add"               element={<DesignerCardSchemeAdd />} />
            <Route path="/designer/transaction-group"             element={<DesignerTransactionGrp />} />
            <Route path="/designer/terminal-type"                 element={<DesignerTerminalType />} />
            <Route path="/designer/activity-fees-packages/list"   element={<DesignerActivityFeesPackagesList />} />
            <Route path="/designer/package-definition"            element={<DesignerActivityFeesPackageDefinition />} />
            <Route path="/designer/non-activity-fees-packages/list" element={<DesignerNonActivityFeesPackagesList />} />
            <Route path="/designer/non-package-definition"        element={<DesignerNonActivityFeesPackageDefinition />} />
            <Route path="/designer/currency-conversion"           element={<DesignerCurrencyConversion />} />
            <Route path="/designer/currency-rate"                 element={<DesignerCurrencyRate />} />
            <Route path="/designer/employees"                     element={<DesignerEmployees />} />
            <Route path="/designer/contacts"                      element={<DesignerContacts />} />
            <Route path="/designer/mcc"                           element={<DesignerMcc />} />
            <Route path="/designer/manage-countries"              element={<DesignerManageCountry />} />
            <Route path="/designer/entities"                      element={<DesignerEntities />} />
            <Route path="/designer/add-entities"                  element={<DesignerAddEntities />} />
            <Route path="/designer/acquiring-transactions"        element={<DesignerAcquiringTransactions />} />
            <Route path="/designer/merchant-transaction/list"     element={<DesignerManualMerchantTransactionList />} />
            <Route path="/designer/merchant-transaction/add"      element={<DesignerManualMerchantTransactionAdd />} />
            <Route path="/designer/non-merchant-transaction/list" element={<DesignerManualNonActivityFeeTransactionList />} />
            <Route path="/designer/non-merchant-transaction/add"  element={<DesignerManualNonActivityFeeTransactionAdd />} />
            <Route path="/designer/non-activity-fee-query"        element={<DesignerNonActivityFeeQuery />} />
            <Route path="/designer/campaigns"                     element={<DesignerNonActivityFeeQuery />} />

            {/* ── Public routes ── */}
            <Route path="/"                element={<Login />} />
            <Route path="/login/root"      element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/not-found"       element={<NotFound />} />
            <Route path="*"                element={<NotFound />} />

            {/* ── Auth-only (no specific activity check needed) ── */}
            <Route path="/dashboard"        element={PR(<Dashboard />)} />
            <Route path="/change-password"  element={PR(<ChangePassword />)} />
            <Route path="/unauthorised-access" element={PR(<UnauthorisedPage />)} />

            {/* ── Activity-guarded listing screens ── */}
            <Route path="/institutions-listing"                         element={AP(ConfigurationActivities.INST,           <InstitutionsListing />)} />
            <Route path="/currency"                                     element={AP(ConfigurationActivities.CURNCY,         <Currency />)} />
            <Route path="/currency-rate"                                element={AP(ConfigurationActivities.CRNCY_RATE,     <CurrencyRate />)} />
            <Route path="/currency-conversion"                          element={AP(ConfigurationActivities.CRNCY_CONV,     <CurrencyConversion />)} />
            <Route path="/terminal-type"                                element={AP(ConfigurationActivities.TERM_TYPE,      <TerminalType />)} />
            <Route path="/card-scheme"                                  element={AP(ConfigurationActivities.CARDSCH,        <CardScheme />)} />
            <Route path="/country"                                      element={AP(ConfigurationActivities.CNTRY,          <CountriesListing />)} />
            <Route path="/city"                                         element={AP(ConfigurationActivities.CITY,           <CitiesListing />)} />
            <Route path="/mcc"                                          element={AP(ConfigurationActivities.MCC_SCREEN,     <Mcc />)} />
            <Route path="/file-layouts"                                 element={AP(ConfigurationActivities.FILES_SCREEN,   <FilesLayout />)} />
            <Route path="/employees"                                    element={AP(ConfigurationActivities.EMPLOYEES,      <Employees />)} />
            <Route path="/activity-fees-packages"                       element={AP(ConfigurationActivities.ACT_FEE_PKG,    <ActivityFeesPackagesListing />)} />
            <Route path="/non-activity-fees-packages"                   element={AP(ConfigurationActivities.NONACT_FEE_PKG, <NonActivityFeesPackagesListing />)} />
            <Route path="/entities-listing"                             element={AP(ConfigurationActivities.ENTITIES,       <EntitiesListing />)} />
            <Route path="/merchant-transaction-listing"                 element={AP(ConfigurationActivities.MANTRANS,       <MerchantTransactionListing />)} />
            <Route path="/manual-non-activity-fees-transaction-listing" element={AP(ConfigurationActivities.MNNONACTFEE,    <ManualNonActivityFeesListing />)} />
            <Route path="/non-activity-fee-query"                       element={AP(ConfigurationActivities.NONACFEEINQ,    <NonActivityFeeQuery />)} />
            <Route path="/acquiring-transactions"                       element={AP(ConfigurationActivities.TRNINQ,         <AcquiringTransactions />)} />
            <Route path="/users-listing"                                element={AP(ConfigurationActivities.MNGUSERS,       <Users />)} />
            <Route path="/roles-listing"                                element={AP(ConfigurationActivities.MNGROLES,       <Roles />)} />
            <Route path="/transactions-definition"                      element={AP(ConfigurationActivities.TRNINQ,         <Transactions />)} />
            <Route path="/system-codes"                                 element={AP(ConfigurationActivities.SYS_CODES,      <SystemCodes />)} />
            <Route path="/maker-checker-configuration"                  element={AP(ConfigurationActivities.MAKER_CHECKER,  <DesignerMakerCheckerConfiguration />)} />
            <Route path="/blocked-ips-listing"                          element={AP(ConfigurationActivities.BLKD_IP,        <BlockedIp />)} />
            <Route path="/transaction-groups-listing"                   element={AP(ConfigurationActivities.TXN_GROUP,      <TransactionGroupsListing />)} />
            <Route path="/pending-activities"                           element={AP(ConfigurationActivities.APPRV_ENT,      <PendingActivities />)} />

            {/* ── Definition / sub-pages: inherit parent auth, no extra activity check ── */}
            <Route path="/institutions-definition"                      element={PR(<InstitutionsDefinition />)} />
            <Route path="/institutions-definition/:id"                  element={PR(<InstitutionsDefinition />)} />
            <Route path="/institutions-definition/:id/:institutionControlId" element={PR(<InstitutionsDefinition />)} />
            <Route path="/card-scheme-definition"                       element={PR(<CardSchemeDefinition />)} />
            <Route path="/card-scheme-definition/:id"                   element={PR(<CardSchemeDefinition />)} />
            <Route path="/card-scheme-definition/:id/:recordSequenceNumber" element={PR(<CardSchemeDefinition />)} />
            <Route path="/add-edit-filelayout"                          element={PR(<AddEditFileLayout />)} />
            <Route path="/add-edit-filelayout/:layoutId"                element={PR(<AddEditFileLayout />)} />
            <Route path="/activity-fees-packages-definition"            element={PR(<ActivityFeesPackageDefinition />)} />
            <Route path="/activity-fees-packages-definition/:id"        element={PR(<ActivityFeesPackageDefinition />)} />
            <Route path="/non-activity-fees-packages-definition"        element={PR(<NonActivityFeesPackagesDefinition />)} />
            <Route path="/non-activity-fees-packages-definition/:id"    element={PR(<NonActivityFeesPackagesDefinition />)} />
            <Route path="/entities-definition"                          element={PR(<EntitiesDefinition />)} />
            <Route path="/entities-definition/:id"                      element={PR(<EntitiesDefinition />)} />
            <Route path="/entities-definition-clone/:id"                element={PR(<EntitiesDefinition />)} />
            <Route path="/merchant-transaction-definition"              element={PR(<MerchantTransacionDefinition />)} />
            <Route path="/merchant-transaction-definition/:id"          element={PR(<MerchantTransacionDefinition />)} />
            <Route path="/manual-non-activity-fees-transaction-definition"     element={PR(<ManualNonActivityFeesDefinition />)} />
            <Route path="/manual-non-activity-fees-transaction-definition/:id" element={PR(<ManualNonActivityFeesDefinition />)} />
            <Route path="/users-definition"                             element={PR(<UserDefinition />)} />
            <Route path="/users-definition/:id"                         element={PR(<UserDefinition />)} />
            <Route path="/user-profile/:id"                             element={PR(<UserDefinition />)} />
            <Route path="/roles-definition"                             element={PR(<RoleDefinition />)} />
            <Route path="/roles-definition/:id"                         element={PR(<RoleDefinition />)} />
            <Route path="/issuer-profile"                               element={PR(<IssuerProfile />)} />
            <Route path="/range-definition"                             element={PR(<RangeDefinition />)} />
            <Route path="/range-definition/:id/:issuerAcqProfile"       element={PR(<RangeDefinition />)} />
            <Route path="/range-definition/:issuerAcqProfile"           element={PR(<RangeDefinition />)} />
            <Route path="/issuer-relation/:institutionId"               element={PR(<IssuerRelation />)} />
            <Route path="/issuer-relation/:id/:issuerAcqProfile/:institutionId" element={PR(<IssuerRelation />)} />
            <Route path="/bankcode"                                     element={PR(<BankInfo />)} />
            <Route path="/processing-events"                            element={PR(<TaskExecution />)} />
            <Route path="/institution-accounts"                         element={PR(<InstitutionAccounts />)} />
            <Route path="/institution-accs-details/:id/:issuerAcqProfile/:cardSchemeId/:currencyCode/:bankCode" element={PR(<InstitutionAccountsDefinition />)} />
            <Route path="/institution-accs-details"                     element={PR(<InstitutionAccountsDefinition />)} />
            <Route path="/institution-accs-details/:institutionId"      element={PR(<InstitutionAccountsDefinition />)} />
            <Route path="/accounting-template"                          element={PR(<AccountingTemplatesHDR />)} />
            <Route path="/accounting-details/add/:institutionId"        element={PR(<AccountingTemplateBank />)} />
            <Route path="/accounting-details/:id"                       element={PR(<AccountingTemplateBank />)} />
            <Route path="/accounting-subheader-details/:instId/:headerId" element={PR(<AccountingTemplateDetails />)} />
            <Route path="/accounting-subheader-details/:instId/:headerId/:subId/:bankCode/:desc" element={PR(<AccountingTemplateDetails />)} />
            <Route path="/output-template"                              element={PR(<OutputFileTemplateHdr />)} />
            <Route path="/output-details"                               element={PR(<OutputFileTemplateDetails />)} />
            <Route path="/output-details/:institutionId"                element={PR(<OutputFileTemplateDetails />)} />
            <Route path="/output-details/:id/:sumPerAccount/:merchantSubSummary/:outputFormat/:outputFileType/:bankCode/:bankFilesOutputId/:institutionId" element={PR(<OutputFileTemplateDetails />)} />
            <Route path="/output-details/:id/:sumPerAccount/:merchantSubSummary/:outputFormat/:outputFileType/:institutionId/:instSubSummary" element={PR(<OutputFileTemplateDetails />)} />
            <Route path="/task-execution-log"                           element={PR(<TaskExecutionLog />)} />
            <Route path="/jobs"                                         element={PR(<Jobs />)} />
            <Route path="/job-definition"                               element={PR(<JobDefinition />)} />
            <Route path="/job-definition/:id"                           element={PR(<JobDefinition />)} />
            <Route path="/job-monitoring"                               element={PR(<JobMonitoring />)} />
            <Route path="/job-execution-log/:id"                        element={PR(<JobExecutionLog />)} />
            <Route path="/task-batch-size"                              element={PR(<TaskBatchSize />)} />
            <Route path="/import-merchants"                             element={PR(<ImportMerchants />)} />
            <Route path="/bm-mdr-report"                                element={PR(<SmartMdrReport />)} />
            <Route path="/cico-mdr-report"                              element={PR(<SmartCicoReport />)} />
            <Route path="/merchant-details-report"                      element={PR(<SmartMerchantDetailsReport />)} />
        </Routes>
    );
}

export default RouteList;
