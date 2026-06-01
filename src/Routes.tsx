import React, { useEffect } from "react";
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
import NonActivityFeeQuery from "./pages/NonActivityFeeQuery"
import NotFound from "./components/NotFound";

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
import { RoleMainModel } from "./models/security/RoleModel";
import { AssignRoles, selectedInst } from "./services/request";
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
// import Campaigns from "./merchantPortal/campaign/DesignerCampaigns";
// import CampaignDefinition from "./merchantPortal/campaign/Campaigndefinition";
// import Newsletters from "./merchantPortal/newsletters/DesignerNewsletter";
// import NewsletterDefinition from "./merchantPortal/newsletters/Newsletterdefinition";
// import Services from "./merchantPortal/services/DesignerServices";
// import ServicesDefinition from "./merchantPortal/services/Servicesdefinition";
// import Registrations from "./merchantPortal/registrationApproval/DesignerRegistrationApproval";
import Jobs from "./pages/Jobs/Jobs";
import TaskBatchSize from "./pages/TaskBatchSize/TaskBatchSize";
import JobMonitoring from "./pages/JobMonitoring/JobMonitoring";
import JobExecutionLog from "./pages/JobMonitoring/JobExecutionLog";
import JobDefinition from "./pages/JobDefinition/JobDefinition";
import FilesLayout from "./pages/FilesLayout";
import AddEditFileLayout from "./pages/NewFileLayout";
import DesignerMakerCheckerConfiguration from "./pages/MakerCheckerConfiguration";

function RouteList() {
    const [roleActivity, setRoleActivity] = React.useState<RoleMainModel>();

    useEffect(() => {
        const userStr = getLocalStorage(LOCALSTORAGE_KEYS.USER);
        if (userStr !== null) {
            const assignRole = AssignRoles?.find((role: RoleMainModel) => role.instId === selectedInst);
            if (assignRole !== undefined) {
                setRoleActivity(assignRole);
            }
        }
    }, [selectedInst]);

    return (
        <Routes>
            {/* Design Routes */}
            <Route path="/designer/login" element={<DesignerLogin />} />
            <Route path="/designer/forgot" element={<DesignerForgot />} />
            <Route path="/designer/reset" element={<DesignerReset />} />
            <Route path="/designer/change-password" element={<DesignerChangePass />} />
            <Route path="/designer/home" element={<DesignerLanding />} />
            <Route path="/designer/institution/list" element={<DesignerInstitutionList />} />
            <Route path="/designer/institution/add" element={<DesignerInstitutionAdd />} />
            <Route path="/designer/currency/list" element={<DesignerCurrencyList />} />
            <Route path="/designer/card-scheme/list" element={<DesignerCardSchemeList />} />
            <Route path="/designer/card-scheme/add" element={<DesignerCardSchemeAdd />} />
            <Route path="/designer/transaction-group" element={<DesignerTransactionGrp />} />
            <Route path="/designer/terminal-type" element={<DesignerTerminalType />} />
            <Route path="/designer/activity-fees-packages/list" element={<DesignerActivityFeesPackagesList />} />
            <Route path="/designer/package-definition" element={<DesignerActivityFeesPackageDefinition />} />
            <Route path="/designer/non-activity-fees-packages/list" element={<DesignerNonActivityFeesPackagesList />} />
            <Route path="/designer/non-package-definition" element={<DesignerNonActivityFeesPackageDefinition />} />
            <Route path="/designer/currency-conversion" element={<DesignerCurrencyConversion />} />
            <Route path="/designer/currency-rate" element={<DesignerCurrencyRate />} />
            <Route path="/designer/employees" element={<DesignerEmployees />} />
            <Route path="/designer/contacts" element={<DesignerContacts />} />
            <Route path="/designer/mcc" element={<DesignerMcc />} />
            <Route path="/designer/manage-countries" element={<DesignerManageCountry />} />
            <Route path="/designer/entities" element={<DesignerEntities />} />
            <Route path="/designer/add-entities" element={<DesignerAddEntities />} />
            <Route path="/designer/acquiring-transactions" element={<DesignerAcquiringTransactions />} />
            <Route path="/designer/merchant-transaction/list" element={<DesignerManualMerchantTransactionList />} />
            <Route path="/designer/merchant-transaction/add" element={<DesignerManualMerchantTransactionAdd />} />
            <Route path="/designer/non-merchant-transaction/list" element={<DesignerManualNonActivityFeeTransactionList />} />
            <Route path="/designer/non-merchant-transaction/add" element={<DesignerManualNonActivityFeeTransactionAdd />} />
            <Route path="/designer/non-activity-fee-query" element={<DesignerNonActivityFeeQuery />} />
            <Route path="/designer/campaigns" element={<DesignerNonActivityFeeQuery />} />

            {/* Development Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login/root" element={<Login />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/institutions-listing" element={<ProtectedRoute><InstitutionsListing /></ProtectedRoute>} />
            <Route path="/institutions-definition" element={<ProtectedRoute><InstitutionsDefinition /></ProtectedRoute>} />
            <Route path="/institutions-definition/:id" element={<ProtectedRoute><InstitutionsDefinition /></ProtectedRoute>} />
            <Route path="/institutions-definition/:id/:institutionControlId" element={<ProtectedRoute><InstitutionsDefinition /></ProtectedRoute>} />
            <Route path="/transaction-groups-listing" element={<ProtectedRoute><TransactionGroupsListing /></ProtectedRoute>} />
            <Route path="/currency" element={<ProtectedRoute><Currency /></ProtectedRoute>} />
            <Route path="/currency-rate" element={<ProtectedRoute><CurrencyRate /></ProtectedRoute>} />
            <Route path="/terminal-type" element={<ProtectedRoute><TerminalType /></ProtectedRoute>} />
            <Route path="/card-scheme" element={<ProtectedRoute><CardScheme /></ProtectedRoute>} />
            <Route path="/card-scheme-definition" element={<ProtectedRoute><CardSchemeDefinition /></ProtectedRoute>} />
            <Route path="/card-scheme-definition/:id" element={<ProtectedRoute><CardSchemeDefinition /></ProtectedRoute>} />
            <Route path="/card-scheme-definition/:id/:recordSequenceNumber" element={<ProtectedRoute><CardSchemeDefinition /></ProtectedRoute>} />
            <Route path="/currency-conversion" element={<ProtectedRoute><CurrencyConversion /></ProtectedRoute>} />
            <Route path="/country" element={<ProtectedRoute><CountriesListing /></ProtectedRoute>} />
            <Route path="/city" element={<ProtectedRoute><CitiesListing /></ProtectedRoute>} />
            <Route path="/mcc" element={<ProtectedRoute><Mcc /></ProtectedRoute>} />
            <Route path="/file-layouts" element={<ProtectedRoute><FilesLayout /></ProtectedRoute>} />
            <Route path="/add-edit-filelayout" element={<ProtectedRoute><AddEditFileLayout /></ProtectedRoute>} />
            <Route path="/add-edit-filelayout/:layoutId" element={<ProtectedRoute><AddEditFileLayout /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
            <Route path="/activity-fees-packages" element={<ProtectedRoute><ActivityFeesPackagesListing /></ProtectedRoute>} />
            <Route path="/activity-fees-packages-definition" element={<ProtectedRoute><ActivityFeesPackageDefinition /></ProtectedRoute>} />
            <Route path="/activity-fees-packages-definition/:id" element={<ProtectedRoute><ActivityFeesPackageDefinition /></ProtectedRoute>} />
            <Route path="/non-activity-fees-packages" element={<ProtectedRoute><NonActivityFeesPackagesListing /></ProtectedRoute>} />
            <Route path="/non-activity-fees-packages-definition" element={<ProtectedRoute><NonActivityFeesPackagesDefinition /></ProtectedRoute>} />
            <Route path="/non-activity-fees-packages-definition/:id" element={<ProtectedRoute><NonActivityFeesPackagesDefinition /></ProtectedRoute>} />
            <Route path="/entities-listing" element={<ProtectedRoute><EntitiesListing /></ProtectedRoute>} />
            <Route path="/merchant-transaction-listing" element={<ProtectedRoute><MerchantTransactionListing /></ProtectedRoute>} />
            <Route path="/merchant-transaction-definition" element={<ProtectedRoute><MerchantTransacionDefinition /></ProtectedRoute>} />
            <Route path="/merchant-transaction-definition/:id" element={<ProtectedRoute><MerchantTransacionDefinition /></ProtectedRoute>} />
            <Route path="/manual-non-activity-fees-transaction-listing" element={<ProtectedRoute><ManualNonActivityFeesListing /></ProtectedRoute>} />
            <Route path="/manual-non-activity-fees-transaction-definition" element={<ProtectedRoute><ManualNonActivityFeesDefinition /></ProtectedRoute>} />
            <Route path="/manual-non-activity-fees-transaction-definition/:id" element={<ProtectedRoute><ManualNonActivityFeesDefinition /></ProtectedRoute>} />
            <Route path="/non-activity-fee-query" element={<ProtectedRoute><NonActivityFeeQuery /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/entities-definition" element={<ProtectedRoute><EntitiesDefinition /></ProtectedRoute>} />
            <Route path="/entities-definition/:id" element={<ProtectedRoute><EntitiesDefinition /></ProtectedRoute>} />
            <Route path="/entities-definition-clone/:id" element={<ProtectedRoute><EntitiesDefinition /></ProtectedRoute>} />
            <Route path="/acquiring-transactions" element={<ProtectedRoute><AcquiringTransactions /></ProtectedRoute>} />
            <Route path="/users-listing" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/users-definition" element={<ProtectedRoute><UserDefinition /></ProtectedRoute>} />
            <Route path="/users-definition/:id" element={<ProtectedRoute><UserDefinition /></ProtectedRoute>} />
            <Route path="/user-profile/:id" element={<ProtectedRoute><UserDefinition /></ProtectedRoute>} />
            <Route path="/roles-listing" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
            <Route path="/roles-definition" element={<ProtectedRoute><RoleDefinition /></ProtectedRoute>} />
            <Route path="/roles-definition/:id" element={<ProtectedRoute><RoleDefinition /></ProtectedRoute>} />
            <Route path="/transactions-definition" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/system-codes" element={<ProtectedRoute><SystemCodes /></ProtectedRoute>} />
            <Route path="/maker-checker-configuration" element={<ProtectedRoute><DesignerMakerCheckerConfiguration /></ProtectedRoute>} />
            <Route path="/blocked-ips-listing" element={<ProtectedRoute><BlockedIp/></ProtectedRoute>}/>
            <Route path="/blocked-ips-listing" element={<ProtectedRoute><BlockedIp/></ProtectedRoute>} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/unauthorised-access" element={<ProtectedRoute><UnauthorisedPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
            <Route path="/issuer-profile" element={<ProtectedRoute><IssuerProfile /></ProtectedRoute>} />
            <Route path="/range-definition" element={<ProtectedRoute><RangeDefinition /></ProtectedRoute>} />
            <Route path="/range-definition/:id/:issuerAcqProfile" element={<ProtectedRoute><RangeDefinition /></ProtectedRoute>} />
            <Route path="/range-definition/:issuerAcqProfile" element={<ProtectedRoute><RangeDefinition /></ProtectedRoute>} />
            <Route path="/issuer-relation/:institutionId" element={<ProtectedRoute><IssuerRelation /></ProtectedRoute>} />
            <Route path="/issuer-relation/:id/:issuerAcqProfile/:institutionId" element={<ProtectedRoute><IssuerRelation /></ProtectedRoute>} />
            <Route path="/bankcode" element={<ProtectedRoute><BankInfo /></ProtectedRoute>} />
            <Route path="/processing-events" element={<ProtectedRoute><TaskExecution /></ProtectedRoute>} />
            <Route path="/institution-accounts" element={<ProtectedRoute><InstitutionAccounts /></ProtectedRoute>} />
            <Route path="/institution-accs-details/:id/:issuerAcqProfile/:cardSchemeId/:currencyCode/:bankCode" element={<ProtectedRoute><InstitutionAccountsDefinition /></ProtectedRoute>} />
            <Route path="/institution-accs-details" element={<ProtectedRoute><InstitutionAccountsDefinition /></ProtectedRoute>} />
            <Route path="/institution-accs-details/:institutionId" element={<ProtectedRoute><InstitutionAccountsDefinition /></ProtectedRoute>} />
            <Route path="/accounting-template" element={<ProtectedRoute><AccountingTemplatesHDR /></ProtectedRoute>} />
            <Route path="/accounting-details/add/:institutionId" element={<ProtectedRoute><AccountingTemplateBank /></ProtectedRoute>} />
            <Route path="/accounting-details/:id" element={<ProtectedRoute><AccountingTemplateBank /></ProtectedRoute>} />
            <Route path="/accounting-subheader-details/:instId/:headerId" element={<ProtectedRoute><AccountingTemplateDetails /></ProtectedRoute>} />
            <Route path="/accounting-subheader-details/:instId/:headerId/:subId/:bankCode/:desc" element={<ProtectedRoute><AccountingTemplateDetails /></ProtectedRoute>} />
            <Route path="/output-template" element={<ProtectedRoute><OutputFileTemplateHdr /></ProtectedRoute>} />
            <Route path="/output-details" element={<ProtectedRoute><OutputFileTemplateDetails /></ProtectedRoute>} />
            <Route path="/output-details/:institutionId" element={<ProtectedRoute><OutputFileTemplateDetails /></ProtectedRoute>} />
            <Route path="/output-details/:id/:sumPerAccount/:merchantSubSummary/:outputFormat/:outputFileType/:bankCode/:bankFilesOutputId/:institutionId" element={<ProtectedRoute><OutputFileTemplateDetails /></ProtectedRoute>} />
            <Route path="/output-details/:id/:sumPerAccount/:merchantSubSummary/:outputFormat/:outputFileType/:institutionId/:instSubSummary" element={<ProtectedRoute><OutputFileTemplateDetails /></ProtectedRoute>} />
            <Route path="/task-execution-log" element={<ProtectedRoute><TaskExecutionLog /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
            <Route path="/job-definition" element={<ProtectedRoute><JobDefinition /></ProtectedRoute>} />
            <Route path="/job-definition/:id" element={<ProtectedRoute><JobDefinition /></ProtectedRoute>} />
            <Route path="/job-monitoring" element={<ProtectedRoute><JobMonitoring /></ProtectedRoute>} />
            <Route path="/job-execution-log/:id" element={<ProtectedRoute><JobExecutionLog /></ProtectedRoute>} />
            <Route path="/task-batch-size" element={<ProtectedRoute><TaskBatchSize /></ProtectedRoute>} />
            <Route path="/import-merchants" element={<ProtectedRoute><ImportMerchants /></ProtectedRoute>} />
            <Route path="/bm-mdr-report" element={<ProtectedRoute><SmartMdrReport /></ProtectedRoute>} />
            <Route path="/cico-mdr-report" element={<ProtectedRoute><SmartCicoReport /></ProtectedRoute>} />
            <Route path="/merchant-details-report" element={<ProtectedRoute><SmartMerchantDetailsReport /></ProtectedRoute>} />
            {/* <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
            <Route path="/campaigns-definition" element={<ProtectedRoute><CampaignDefinition /></ProtectedRoute>} />
            <Route path="/campaigns-definition/:id" element={<ProtectedRoute><CampaignDefinition /></ProtectedRoute>} />
            <Route path="/newsletters" element={<ProtectedRoute><Newsletters /></ProtectedRoute>} />
            <Route path="/newsletter-definition" element={<ProtectedRoute><NewsletterDefinition /></ProtectedRoute>} />
            <Route path="/newsletter-definition/:id" element={<ProtectedRoute><NewsletterDefinition /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/service-definition" element={<ProtectedRoute><ServicesDefinition /></ProtectedRoute>} />
            <Route path="/service-definition/:id" element={<ProtectedRoute><ServicesDefinition /></ProtectedRoute>} />
            <Route path="/registration-approval" element={<ProtectedRoute><Registrations /></ProtectedRoute>} /> */}
        </Routes>
    );
}

export default RouteList;