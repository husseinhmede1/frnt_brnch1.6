/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import {
  down_arrow_icon,
  inventory_management,
  inventory_management_active,
  lockIcon,
  lockIcon_gray,
  logo,
  reportIconGray,
  reportIcon,
  setting_icon,
  setting_icon_active,
  userIcon,
} from "../../assets/images";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Link,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { roleActivities, RoleMainModel } from "../../models/security/RoleModel";
import { AssignRoles, selectedInst } from "../../services/request";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { ROLE_ACTIVITY } from "../../utils/constant";
import { Widgets } from "@mui/icons-material";

function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();
  const [roleActivity, setRoleActivity] = React.useState<RoleMainModel>();
  const [systemcoConfiguration, setSystemcoConfiguration] = React.useState<boolean>(false);
  const [institutionConfiguration, setInstitutionConfiguration] = React.useState<boolean>(false);
  const [transactionManagement, setTransactionManagement] = React.useState<boolean>(false);
  const [security, setSecurity] = React.useState<boolean>(false);
  const [accountingTemplate, setAccountingTemplate] = React.useState<boolean>(false);
  const [jobs, setJobs] = React.useState<boolean>(false);
  const [actType7, setActType7] = React.useState<boolean>(false);
  const handleMenuClick = (e: any, link: string) => {
    e.preventDefault();
    if (e.ctrlKey) {
      window.open(link, "_blank")
    } else {
      navigate(link)
    }
  }

  useEffect(() => {
    const userStr = getLocalStorage(LOCALSTORAGE_KEYS.USER);
    if (userStr != null) {
      const assignRole: RoleMainModel = AssignRoles?.find((role: RoleMainModel) => role.instId === selectedInst);
      if (assignRole !== undefined) {
        console.log("assignRole", assignRole);
        
        setRoleActivity(assignRole);
        assignRole.roleActivities.map((roleactivity: roleActivities) => {
    
    
    
          if (roleactivity.activity?.activityType === "1" && roleactivity?.accessView === "1") {
            setSystemcoConfiguration(true);
          }

          if (roleactivity.activity?.activityType === "2" && roleactivity?.accessView === "1") {
            setInstitutionConfiguration(true);
          }

          if (roleactivity.activity?.activityType === "3" && roleactivity?.accessView === "1") {
            setTransactionManagement(true);
          }

          if (roleactivity.activity?.activityType === "4" && roleactivity?.accessView === "1") {
            setSecurity(true);
          }

          if (roleactivity.activity?.activityType === "5" && roleactivity?.accessView === "1") {
            setAccountingTemplate(true);
          }

          if (roleactivity.activity?.activityType === "6" && roleactivity?.accessView === "1") {
            setJobs(true);
          }

        })
      }
    }

  }, [selectedInst]);


  return (
    <>
      <nav className="main-navigation">
        <a href="/dashboard" title="MAS Prime" className="logo">
          <img src={logo} alt="Logo" />
        </a>

        <div className="menu-wrapper">
          {systemcoConfiguration &&
            <Accordion>
              <AccordionSummary
                expandIcon={<img src={down_arrow_icon} alt="down_arrow_icon" />}
                className="has-submenu"
              >
                <a href="#" title="System Configuration" className="menu-link">
                  <em className="thumb-i">
                    <img src={setting_icon} alt="inventory_management" />
                    <img
                      src={setting_icon_active}
                      alt="inventory_management"
                      className="overlap"
                    />
                  </em>
                  <span>
                    {intl.formatMessage({
                      id: "Sidemenu.systemConfiguration",
                      defaultMessage: "System Configuration",
                    })}
                  </span>
                </a>
              </AccordionSummary>
              <AccordionDetails>
                <ul className="sub-menu">
                  <li style={{ cursor: "pointer" }}>
                        <a
                          onClick={(e) => handleMenuClick(e, "/file-layouts")}
                          href="file-layouts"
                          title="File Layouts"
                          className={
                            pathname.includes("file-layouts")
                              ? "active menu-link"
                              : "menu-link"
                          }
                        >
                          {intl.formatMessage({
                            id: "Sidemenu.fileLayouts",
                            defaultMessage: "File Layouts",
                          })}
                        </a>
                  </li>
                </ul>
                
                <ul className="sub-menu">
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Country) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Country)?.accessView === "1") &&
                    <li>
                      <a
                        onClick={(e) => handleMenuClick(e, "/country")}
                        href="#"
                        title="Country"
                        className={
                          pathname.includes("country")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.country",
                          defaultMessage: "Country",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Maker_Checker_Configuration) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Maker_Checker_Configuration)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/maker-checker-configuration")}
                        href="/maker-checker-configuration"
                        title="Maker Checker Configuration"
                        className={
                          pathname.includes("maker-checker-configuration")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "SystemCodes.makerCheckerConfiguration",
                          defaultMessage: "Maker Checker Configuration",
                        })}

                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.City) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.City)?.accessView === "1") &&
                    <li>
                      <a
                        onClick={(e) => handleMenuClick(e, "/city")}
                        href="#"
                        title="City"
                        className={
                          pathname.includes("city")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.city",
                          defaultMessage: "City",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Currency) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Currency)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/currency")}
                        title="Currency"
                        className={
                          pathname.endsWith("currency")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.currency",
                          defaultMessage: "Currency",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.MCC) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.MCC)?.accessView === "1") &&
                    <li>
                      <a
                        onClick={(e) => handleMenuClick(e, "/mcc")}
                        href="#"
                        title="MCC"
                        className={
                          pathname.includes("mcc")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.mcc",
                          defaultMessage: "MCC",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Card_Scheme) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Card_Scheme)?.accessView === "1") &&
                    <li>
                      <a
                        href="#"
                        title="Card Scheme"
                        onClick={(e) => handleMenuClick(e, "/card-scheme")}
                        className={
                          pathname.includes("card-scheme")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.cardScheme",
                          defaultMessage: "Card Scheme",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Institutions)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/institutions-listing")}
                        title="Institutions"
                        className={
                          pathname.includes("institution")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.institutions",
                          defaultMessage: "Institutions",
                        })}
                      </a>
                    </li>
                  }
                  {/* <li>
                  <a href="#" title="Issuer" className="menu-link">
                    {intl.formatMessage({
                      id: "Sidemenu.issuer",
                      defaultMessage: "Issuer",
                    })}
                  </a>
                </li> */}
                </ul>
              </AccordionDetails>
            </Accordion>
          }
          {institutionConfiguration &&
            <Accordion>
              <AccordionSummary
                expandIcon={<img src={down_arrow_icon} alt="down_arrow_icon" />}
                className="has-submenu"
              >
                <a href="#" title="Instituion Configuration" className="menu-link">
                  <em className="thumb-i">
                    <img src={setting_icon} alt="inventory_management" />
                    <img
                      src={setting_icon_active}
                      alt="inventory_management"
                      className="overlap"
                    />
                  </em>
                  <span>
                    {intl.formatMessage({
                      id: "Sidemenu.institutionConfiguration",
                      defaultMessage: "Instituion Configuration",
                    })}
                  </span>
                </a>
              </AccordionSummary>
              <AccordionDetails>
                <ul className="sub-menu">
                {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.System_Codes) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.System_Codes)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/system-codes")}
                        href="/system-codes"
                        title="System Codes"
                        className={
                          pathname.includes("system-codes")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "SystemCodes.systemcodes",
                          defaultMessage: "System Codes",
                        })}

                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Currency_Conversion) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Currency_Conversion)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/currency-conversion")}
                        title="Currency Conversion"
                        className={
                          pathname.endsWith("currency-conversion")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.currencyConversion",
                          defaultMessage: "Currency Conversion",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Currency_Rate) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Currency_Rate)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/currency-rate")}
                        title="Currency Rate"
                        className={
                          pathname.endsWith("currency-rate")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.currencyRate",
                          defaultMessage: "Currency Rate",
                        })}
                      </a>
                    </li>
                  }
                  <li style={{ cursor: "pointer" }}>
                    <a
                      onClick={(e) => handleMenuClick(e, "/bankcode")}
                      href="/bankcode"
                      title="Entities"
                      className={
                        pathname.includes("bankcode")
                          ? "active menu-link"
                          : "menu-link"
                      }
                    >
                      {intl.formatMessage({
                        id: "Sidemenu.bankInfo",
                        defaultMessage: "Banks",
                      })}
                    </a>
                  </li>
                  <li style={{ cursor: "pointer" }}>
                    <a
                      onClick={(e) => handleMenuClick(e, "/issuer-profile")}
                      href="/issuer-profile"
                      title="Entities"
                      className={
                        pathname.includes("issuer-profile")
                          ? "active menu-link"
                          : "menu-link"
                      }
                    >
                      {intl.formatMessage({
                        id: "Sidemenu.issuerProfile",
                        defaultMessage: "Card Ranges Profile",
                      })}
                    </a>
                  </li>
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/transactions-definition")}
                        href="/transactions-definition"
                        title="Transactions"
                        className={
                          pathname.includes("transactions-definition")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Transactions.transactions",
                          defaultMessage: "Transactions",
                        })}

                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transaction_Group) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transaction_Group)?.accessView === "1") &&
                    <li>
                      <a
                        onClick={(e) => handleMenuClick(e, "/transaction-groups-listing")}
                        href="#"
                        title="Transaction Group"
                        className={
                          pathname.includes("transaction-groups-listing")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.transactionGroup",
                          defaultMessage: "Transaction Group",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Terminal_Type) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Terminal_Type)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/terminal-type")}
                        title="Terminal Types"
                        className={
                          pathname.includes("terminal-type")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.terminalType",
                          defaultMessage: "Terminal Types",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Employees) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Employees)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/employees")}
                        title="Employees"
                        className={
                          pathname.endsWith("employees")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.employees",
                          defaultMessage: "Employees",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Entities) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Entities)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/entities-listing")}
                        href="/entities-listing"
                        title="Entities"
                        className={
                          pathname.includes("entities-listing") || pathname.includes("entities-definition")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.entitiesListing",
                          defaultMessage: "Entities",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Activity_Fees_Pkgs) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Activity_Fees_Pkgs)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/activity-fees-packages")}
                        title="Activity Fees Pkgs"
                        className={
                          pathname.includes("/activity-fees-packages")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.activityFeesPkgss",
                          defaultMessage: "Activity Packages",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Non_Activity_Fees_Pkgs) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Non_Activity_Fees_Pkgs)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        title="Non Activity Fees Pkg"
                        onClick={(e) => handleMenuClick(e, "/non-activity-fees-packages")}
                        className={
                          pathname.includes("/non-activity-fees-packages")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.nonActivityFeesPkgss",
                          defaultMessage: "Non Activity Packages",
                        })}
                      </a>
                    </li>
                  }
                </ul>
              </AccordionDetails>
            </Accordion>
          }
          {transactionManagement &&
            <Accordion>
              <AccordionSummary
                expandIcon={<img src={down_arrow_icon} alt="down_arrow_icon" />}
                className="has-submenu"
              >
                <a href="#" title="Transaction Management" className="menu-link">
                  <em className="thumb-i">
                    <img src={inventory_management} alt="inventory_management" />
                    <img
                      src={inventory_management_active}
                      alt="inventory_management"
                      className="overlap"
                    />
                  </em>
                  <span>
                    {intl.formatMessage({
                      id: "Sidemenu.transactionManagement",
                      defaultMessage: "Transaction Management",
                    })}
                  </span>
                </a>
              </AccordionSummary>
              <AccordionDetails>
                <ul className="sub-menu">
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions_Inquiry) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Transactions_Inquiry)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/acquiring-transactions")}
                        title="Acquiring Transactions"
                        className={
                          pathname.includes("acquiring-transactions")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.acquiringTransactions",
                          defaultMessage: "Acquiring Transactions",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Manual_Transactions) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Manual_Transactions)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/merchant-transaction-listing")}
                        href="/merchant-transaction-listing"
                        title="Merchant Transactions"
                        className={
                          pathname.includes("merchant-transaction-listing")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.manualMerchantTransactions",
                          defaultMessage: "Manual Transactions",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Manual_non_Activity_Fees) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Manual_non_Activity_Fees)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/manual-non-activity-fees-transaction-listing")}
                        href="/manual-non-activity-fees-transaction-listing"
                        title="Manual Non Activity Fees Transactions"
                        className={
                          pathname.includes("manual-non-activity-fees-transaction-listing")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.manualNonActivityFeesTransactions",
                          defaultMessage: "Manual Non Activity Fees Transactions",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Non_Activity_Fees_Inquiry) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Non_Activity_Fees_Inquiry)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/non-activity-fee-query")}
                        href="/non-activity-fee-query"
                        title="Non Activity Fee Query"
                        className={
                          pathname.includes("non-activity-fee-query")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Sidemenu.nonActivityFeeQuery",
                          defaultMessage: "Non Activity Fee Query",
                        })}

                      </a>
                    </li>
                  }
                </ul>
              </AccordionDetails>
            </Accordion>
          }
          {/* <Accordion className="not-expanded">
            <AccordionSummary>
              <a href="#" title="Security" className="menu-link">
                <em className="thumb-i">
                  <img src={lockIcon_gray} alt="inventory_management" />
                  <img
                    src={lockIcon}
                    alt="inventory_management"
                    className="overlap"
                  />
                </em>
                <span>
                  {intl.formatMessage({
                    id: "Sidemenu.security",
                    defaultMessage: "Security",
                  })}
                </span>
              </a>
            </AccordionSummary>
          </Accordion> */}
          {accountingTemplate &&
            <Accordion>
              <AccordionSummary
                expandIcon={<img src={down_arrow_icon} alt="down_arrow_icon" />}
                className="has-submenu"
              >
                <a href="#" title="Accounting Module" className="menu-link">
                  <em className="thumb-i">
                    <img src={inventory_management} alt="inventory_management" />
                    <img
                      src={inventory_management_active}
                      alt="inventory_management"
                      className="overlap"
                    />
                  </em>
                  <span>
                    {intl.formatMessage({
                      id: "Sidemenu.accountingModule",
                      defaultMessage: "Accounting Module",
                    })}
                  </span>
                </a>
              </AccordionSummary>
              <AccordionDetails>
                <ul className="sub-menu">
                  <li style={{ cursor: "pointer" }}>
                    <a
                      onClick={(e) => handleMenuClick(e, "/institution-accounts")}
                      href="/institution-accounts"
                      title="Institution Accounts"
                      className={
                        pathname.includes("institution-accounts")
                          ? "active menu-link"
                          : "menu-link"
                      }
                    >
                      {intl.formatMessage({
                        id: "Sidemenu.institutionAccounts",
                        defaultMessage: "Institution Accounts",
                      })}
                    </a>
                  </li>
                  <li style={{ cursor: "pointer" }}>
                    <a
                      onClick={(e) => handleMenuClick(e, "/accounting-template")}
                      href="/accounting-template"
                      title="Accounting Template"
                      className={
                        pathname.includes("accounting-template")
                          ? "active menu-link"
                          : "menu-link"
                      }
                    >
                      {intl.formatMessage({
                        id: "Sidemenu.accountingTemplate",
                        defaultMessage: "Accounting Template",
                      })}
                    </a>
                  </li>
                  <li style={{ cursor: "pointer" }}>
                    <a
                      onClick={(e) => handleMenuClick(e, "/output-template")}
                      href="/output-template"
                      title="Output Templates"
                      className={
                        pathname.includes("output-template")
                          ? "active menu-link"
                          : "menu-link"
                      }
                    >
                      {intl.formatMessage({
                        id: "Sidemenu.outputFileTemplate",
                        defaultMessage: "Output File Template",
                      })}
                    </a>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          }
          {jobs &&
            <Accordion >
              <AccordionSummary
                expandIcon={<img src={down_arrow_icon} alt="down_arrow_icon" />}
                className="has-submenu"
              >
                <a href="#" title="Jobs" className="menu-link">
                  <em className="thumb-i">
                    <img src={lockIcon_gray} alt="inventory_management" />
                    <img
                      src={lockIcon}
                      alt="inventory_management"
                      className="overlap"
                    />
                  </em>
                  <span>
                    {intl.formatMessage({
                      id: "Sidemenu.jobs",
                      defaultMessage: "Jobs",
                    })}
                  </span>
                </a>
              </AccordionSummary>
              <AccordionDetails>
             <ul className="sub-menu">
                  <li style={{ cursor: "pointer" }}>
                    <a
                      onClick={(e) => handleMenuClick(e, "/jobs")}
                      href="/jobs"
                      title="Jobs"
                      className={
                        pathname.includes("jobs")
                          ? "active menu-link"
                          : "menu-link"
                      }
                    >
                      {intl.formatMessage({
                        id: "Sidemenu.jobs",
                        defaultMessage: "Jobs",
                      })}
                    </a>
                  </li>
                </ul>
                             <ul className="sub-menu">

                  <li style={{ cursor: "pointer" }}>
                    <a
                      onClick={(e) => handleMenuClick(e, "/job-monitoring")}
                      href="/job-monitoring"
                      title="Job Monitoring"
                      className={
                        pathname.includes("job-monitoring")
                          ? "active menu-link"
                          : "menu-link"
                      }
                    >
                      {intl.formatMessage({
                        id: "Sidemenu.jobMonitoring",
                        defaultMessage: "Job Monitoring",
                      })}
                    </a>
                  </li>
                  </ul>
             <ul className="sub-menu">
                  <li style={{ cursor: "pointer" }}>
                    <a
                      onClick={(e) => handleMenuClick(e, "/task-batch-size")}
                      href="/task-batch-size"
                      title="Task Batch Size"
                      className={
                        pathname.includes("task-batch-size")
                          ? "active menu-link"
                          : "menu-link"
                      }
                    >
                      {intl.formatMessage({
                        id: "Sidemenu.taskBatchSize",
                        defaultMessage: "Task Batch Size",
                      })}
                    </a>
                  </li>
                </ul>

                <ul className="sub-menu">
                  <li style={{ cursor: "pointer" }}>
                    <a
                      onClick={(e) => handleMenuClick(e, "/processing-events")}
                      href="/processing-events"
                      title="Entities"
                      className={
                        pathname.includes("processing-events")
                          ? "active menu-link"
                          : "menu-link"
                      }
                    >
                      {intl.formatMessage({
                        id: "Sidemenu.processingEvents",
                        defaultMessage: "Task Execution",
                      })}
                    </a>
                  </li>
                </ul>
                <ul className="sub-menu">
                  <li style={{ cursor: "pointer" }}>
                    <a
                      onClick={(e) => handleMenuClick(e, "/task-execution-log")}
                      href="/task-execution-log"
                      title="Task Execution Log"
                      className={
                        pathname.includes("task-execution-log")
                          ? "active menu-link"
                          : "menu-link"
                      }
                    >
                      {intl.formatMessage({
                        id: "Sidemenu.taskExecutionLog",
                        defaultMessage: "Task Execution Log",
                      })}
                    </a>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          }
          {/* {actType5 &&
            <Accordion >
              <AccordionSummary
                expandIcon={<img src={down_arrow_icon} alt="down_arrow_icon" />}
                className="has-submenu"
              >
                <a href="#" title="Tasks" className="menu-link">
                  <em className="thumb-i">
                    <img src={lockIcon_gray} alt="inventory_management" />
                    <img
                      src={lockIcon}
                      alt="inventory_management"
                      className="overlap"
                    />
                  </em>
                  <span>
                    {intl.formatMessage({
                      id: "Sidemenu.Tasks",
                      defaultMessage: "Tasks",
                    })}
                  </span>
                </a>
              </AccordionSummary>
              <AccordionDetails>
                <ul className="sub-menu">
                  <li style={{ cursor: "pointer" }}>
                    <a
                      onClick={(e) => handleMenuClick(e, "/import-merchants")}
                      href="/import-merchants"
                      title="Import Jobs"
                      className={
                        pathname.includes("import-merchants")
                          ? "active menu-link"
                          : "menu-link"
                      }
                    >
                      {intl.formatMessage({
                        id: "Sidemenu.import-merchants",
                        defaultMessage: "Import Jobs",
                      })}
                    </a>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          } */}

          {security &&
            <Accordion >
              <AccordionSummary
                expandIcon={<img src={down_arrow_icon} alt="down_arrow_icon" />}
                className="has-submenu"
              >
                <a href="#" title="Security" className="menu-link">
                  <em className="thumb-i">
                    <img src={lockIcon_gray} alt="inventory_management" />
                    <img
                      src={lockIcon}
                      alt="inventory_management"
                      className="overlap"
                    />
                  </em>
                  <span>
                    {intl.formatMessage({
                      id: "Sidemenu.security",
                      defaultMessage: "Security",
                    })}
                  </span>
                </a>
              </AccordionSummary>
              <AccordionDetails>
                <ul className="sub-menu">
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Users) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Users)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/users-listing")}
                        title="Users list"
                        className={
                          pathname.includes("users-listing") || pathname.includes("users-definition")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Users.users",
                          defaultMessage: "Users",
                        })}
                      </a>
                    </li>
                  }
                  {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Roles) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.Roles)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/roles-listing")}
                        title="Roles List"
                        className={
                          pathname.includes("roles-listing") || pathname.includes("roles-definition")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "Roles.roles",
                          defaultMessage: "Roles",
                        })}
                      </a>
                    </li>
                  }
                   {/* {(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.BlockedIP) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.BlockedIP)?.accessView === "1") &&
                    <li style={{ cursor: "pointer" }}>
                      <a
                        onClick={(e) => handleMenuClick(e, "/blocked-ips-listing")}
                        title="Roles List"
                        className={
                          pathname.includes("blocked-ip")
                            ? "active menu-link"
                            : "menu-link"
                        }
                      >
                        {intl.formatMessage({
                          id: "BlockedIp.blockedIp",
                          defaultMessage: "Blocked IPs",
                        })}
                      </a>
                    </li>
                  } */}
                </ul>
              </AccordionDetails>
            </Accordion>
          }
        </div>
                <div className="sidebar-footer" style={{marginLeft: '30%', marginTop: '88%'}}>
                    <Typography style={{color: 'orange'}} variant="body1">
                        {intl.formatMessage({
                            id: "Sidebar.version1.0",
                            defaultMessage: "Version 1.0",
                        })}
                    </Typography>
                </div>
      </nav>
    </>
  );
}

export default Sidebar;
