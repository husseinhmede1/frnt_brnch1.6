/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import {
  down_arrow_icon,
  inventory_management,
  inventory_management_active,
  lockIcon,
  lockIcon_gray,
  logo,
  setting_icon,
  setting_icon_active,
} from "../../assets/images";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useIntl } from "react-intl";
import { ConfigurationActivities } from "../../utils/constant";
import { getActivityPermissions } from "../../utils/permissionUtils";

function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();

  const handleMenuClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    if (e.ctrlKey) {
      window.open(link, "_blank");
    } else {
      navigate(link);
    }
  };

  // Compute all permissions once — reads from localStorage["modules"]
  const perm = useMemo(() => ({
    country:        getActivityPermissions(ConfigurationActivities.CNTRY),
    makerChecker:   getActivityPermissions(ConfigurationActivities.MAKER_CHECKER),
    city:           getActivityPermissions(ConfigurationActivities.CITY),
    currency:       getActivityPermissions(ConfigurationActivities.CURNCY),
    mcc:            getActivityPermissions(ConfigurationActivities.MCC_SCREEN),
    cardScheme:     getActivityPermissions(ConfigurationActivities.CARDSCH),
    institutions:   getActivityPermissions(ConfigurationActivities.INST),
    fileLayouts:    getActivityPermissions(ConfigurationActivities.FILES_SCREEN),
    systemCodes:    getActivityPermissions(ConfigurationActivities.SYS_CODES),
    currencyConv:   getActivityPermissions(ConfigurationActivities.CRNCY_CONV),
    currencyRate:   getActivityPermissions(ConfigurationActivities.CRNCY_RATE),
    transactions:   getActivityPermissions(ConfigurationActivities.TRNINQ),
    txnGroup:       getActivityPermissions(ConfigurationActivities.TXN_GROUP),
    terminalType:   getActivityPermissions(ConfigurationActivities.TERM_TYPE),
    employees:      getActivityPermissions(ConfigurationActivities.EMPLOYEES),
    entities:       getActivityPermissions(ConfigurationActivities.ENTITIES),
    actFeesPkgs:    getActivityPermissions(ConfigurationActivities.ACT_FEE_PKG),
    nonActFeesPkgs: getActivityPermissions(ConfigurationActivities.NONACT_FEE_PKG),
    manualTrans:    getActivityPermissions(ConfigurationActivities.MANTRANS),
    manualNonAct:   getActivityPermissions(ConfigurationActivities.MNNONACTFEE),
    nonActFeeInq:   getActivityPermissions(ConfigurationActivities.NONACFEEINQ),
    users:          getActivityPermissions(ConfigurationActivities.MNGUSERS),
    roles:          getActivityPermissions(ConfigurationActivities.MNGROLES),
    pendingAct:     getActivityPermissions(ConfigurationActivities.APPRV_ENT),
    blockedIp:      getActivityPermissions(ConfigurationActivities.BLKD_IP),
  }), []);

  // Section visibility — show a group only if at least one item inside is visible
  const show = useMemo(() => {
    const v = (p: { accessView: string }) => p.accessView === "1";
    return {
      systemConfig:
        v(perm.country) || v(perm.city) || v(perm.currency) ||
        v(perm.mcc) || v(perm.cardScheme) || v(perm.institutions) ||
        v(perm.makerChecker) || v(perm.fileLayouts),

      institutionConfig:
        v(perm.systemCodes) || v(perm.currencyConv) || v(perm.currencyRate) ||
        v(perm.txnGroup) || v(perm.terminalType) || v(perm.employees) ||
        v(perm.entities) || v(perm.actFeesPkgs) || v(perm.nonActFeesPkgs) ||
        v(perm.transactions),

      transactionMgmt:
        v(perm.transactions) || v(perm.manualTrans) ||
        v(perm.manualNonAct) || v(perm.nonActFeeInq),

      security:
        v(perm.users) || v(perm.roles) || v(perm.pendingAct) || v(perm.blockedIp),
    };
  }, [perm]);

  const link = (path: string) =>
    pathname.includes(path) ? "active menu-link" : "menu-link";

  return (
    <nav className="main-navigation">
      <a href="/dashboard" title="MAS Prime" className="logo">
        <img src={logo} alt="Logo" />
      </a>

      <div className="menu-wrapper">

        {/* ── System Configuration ── */}
        {show.systemConfig && (
          <Accordion>
            <AccordionSummary
              expandIcon={<img src={down_arrow_icon} alt="" />}
              className="has-submenu"
            >
              <a href="#" className="menu-link">
                <em className="thumb-i">
                  <img src={setting_icon} alt="" />
                  <img src={setting_icon_active} alt="" className="overlap" />
                </em>
                <span>{intl.formatMessage({ id: "Sidemenu.systemConfiguration", defaultMessage: "System Configuration" })}</span>
              </a>
            </AccordionSummary>
            <AccordionDetails>
              <ul className="sub-menu">

                {perm.fileLayouts.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/file-layouts")} href="/file-layouts" className={link("file-layouts")}>
                      {intl.formatMessage({ id: "Sidemenu.fileLayouts", defaultMessage: "File Layouts" })}
                    </a>
                  </li>
                )}

                {perm.country.accessView === "1" && (
                  <li>
                    <a onClick={(e) => handleMenuClick(e, "/country")} href="#" className={link("country")}>
                      {intl.formatMessage({ id: "Sidemenu.country", defaultMessage: "Country" })}
                    </a>
                  </li>
                )}

                {perm.city.accessView === "1" && (
                  <li>
                    <a onClick={(e) => handleMenuClick(e, "/city")} href="#" className={link("city")}>
                      {intl.formatMessage({ id: "Sidemenu.city", defaultMessage: "City" })}
                    </a>
                  </li>
                )}

                {perm.currency.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/currency")} className={pathname.endsWith("currency") ? "active menu-link" : "menu-link"}>
                      {intl.formatMessage({ id: "Sidemenu.currency", defaultMessage: "Currency" })}
                    </a>
                  </li>
                )}

                {perm.mcc.accessView === "1" && (
                  <li>
                    <a onClick={(e) => handleMenuClick(e, "/mcc")} href="#" className={link("mcc")}>
                      {intl.formatMessage({ id: "Sidemenu.mcc", defaultMessage: "MCC" })}
                    </a>
                  </li>
                )}

                {perm.cardScheme.accessView === "1" && (
                  <li>
                    <a href="#" onClick={(e) => handleMenuClick(e, "/card-scheme")} className={link("card-scheme")}>
                      {intl.formatMessage({ id: "Sidemenu.cardScheme", defaultMessage: "Card Scheme" })}
                    </a>
                  </li>
                )}

                {perm.institutions.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/institutions-listing")} className={link("institution")}>
                      {intl.formatMessage({ id: "Sidemenu.institutions", defaultMessage: "Institutions" })}
                    </a>
                  </li>
                )}

                {perm.makerChecker.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/maker-checker-configuration")} href="/maker-checker-configuration" className={link("maker-checker-configuration")}>
                      {intl.formatMessage({ id: "SystemCodes.makerCheckerConfiguration", defaultMessage: "Maker Checker Configuration" })}
                    </a>
                  </li>
                )}

              </ul>
            </AccordionDetails>
          </Accordion>
        )}

        {/* ── Institution Configuration ── */}
        {show.institutionConfig && (
          <Accordion>
            <AccordionSummary
              expandIcon={<img src={down_arrow_icon} alt="" />}
              className="has-submenu"
            >
              <a href="#" className="menu-link">
                <em className="thumb-i">
                  <img src={setting_icon} alt="" />
                  <img src={setting_icon_active} alt="" className="overlap" />
                </em>
                <span>{intl.formatMessage({ id: "Sidemenu.institutionConfiguration", defaultMessage: "Institution Configuration" })}</span>
              </a>
            </AccordionSummary>
            <AccordionDetails>
              <ul className="sub-menu">

                {perm.systemCodes.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/system-codes")} href="/system-codes" className={link("system-codes")}>
                      {intl.formatMessage({ id: "SystemCodes.systemcodes", defaultMessage: "System Codes" })}
                    </a>
                  </li>
                )}

                {perm.currencyConv.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/currency-conversion")} className={pathname.endsWith("currency-conversion") ? "active menu-link" : "menu-link"}>
                      {intl.formatMessage({ id: "Sidemenu.currencyConversion", defaultMessage: "Currency Conversion" })}
                    </a>
                  </li>
                )}

                {perm.currencyRate.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/currency-rate")} className={pathname.endsWith("currency-rate") ? "active menu-link" : "menu-link"}>
                      {intl.formatMessage({ id: "Sidemenu.currencyRate", defaultMessage: "Currency Rate" })}
                    </a>
                  </li>
                )}

                {/* Bank Info & Issuer Profile have no activity code yet — always show if section is visible */}
                <li style={{ cursor: "pointer" }}>
                  <a onClick={(e) => handleMenuClick(e, "/bankcode")} href="/bankcode" className={link("bankcode")}>
                    {intl.formatMessage({ id: "Sidemenu.bankInfo", defaultMessage: "Banks" })}
                  </a>
                </li>

                <li style={{ cursor: "pointer" }}>
                  <a onClick={(e) => handleMenuClick(e, "/issuer-profile")} href="/issuer-profile" className={link("issuer-profile")}>
                    {intl.formatMessage({ id: "Sidemenu.issuerProfile", defaultMessage: "Card Ranges Profile" })}
                  </a>
                </li>

                {perm.transactions.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/transactions-definition")} href="/transactions-definition" className={link("transactions-definition")}>
                      {intl.formatMessage({ id: "Transactions.transactions", defaultMessage: "Transactions" })}
                    </a>
                  </li>
                )}

                {perm.txnGroup.accessView === "1" && (
                  <li>
                    <a onClick={(e) => handleMenuClick(e, "/transaction-groups-listing")} href="#" className={link("transaction-groups-listing")}>
                      {intl.formatMessage({ id: "Sidemenu.transactionGroup", defaultMessage: "Transaction Group" })}
                    </a>
                  </li>
                )}

                {perm.terminalType.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/terminal-type")} className={link("terminal-type")}>
                      {intl.formatMessage({ id: "Sidemenu.terminalType", defaultMessage: "Terminal Types" })}
                    </a>
                  </li>
                )}

                {perm.employees.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/employees")} className={pathname.endsWith("employees") ? "active menu-link" : "menu-link"}>
                      {intl.formatMessage({ id: "Sidemenu.employees", defaultMessage: "Employees" })}
                    </a>
                  </li>
                )}

                {perm.entities.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/entities-listing")} href="/entities-listing"
                      className={pathname.includes("entities-listing") || pathname.includes("entities-definition") ? "active menu-link" : "menu-link"}>
                      {intl.formatMessage({ id: "Sidemenu.entitiesListing", defaultMessage: "Entities" })}
                    </a>
                  </li>
                )}

                {perm.actFeesPkgs.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/activity-fees-packages")} className={link("/activity-fees-packages")}>
                      {intl.formatMessage({ id: "Sidemenu.activityFeesPkgss", defaultMessage: "Activity Packages" })}
                    </a>
                  </li>
                )}

                {perm.nonActFeesPkgs.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/non-activity-fees-packages")} className={link("/non-activity-fees-packages")}>
                      {intl.formatMessage({ id: "Sidemenu.nonActivityFeesPkgss", defaultMessage: "Non Activity Packages" })}
                    </a>
                  </li>
                )}

              </ul>
            </AccordionDetails>
          </Accordion>
        )}

        {/* ── Transaction Management ── */}
        {show.transactionMgmt && (
          <Accordion>
            <AccordionSummary
              expandIcon={<img src={down_arrow_icon} alt="" />}
              className="has-submenu"
            >
              <a href="#" className="menu-link">
                <em className="thumb-i">
                  <img src={inventory_management} alt="" />
                  <img src={inventory_management_active} alt="" className="overlap" />
                </em>
                <span>{intl.formatMessage({ id: "Sidemenu.transactionManagement", defaultMessage: "Transaction Management" })}</span>
              </a>
            </AccordionSummary>
            <AccordionDetails>
              <ul className="sub-menu">

                {perm.transactions.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/acquiring-transactions")} className={link("acquiring-transactions")}>
                      {intl.formatMessage({ id: "Sidemenu.acquiringTransactions", defaultMessage: "Acquiring Transactions" })}
                    </a>
                  </li>
                )}

                {perm.manualTrans.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/merchant-transaction-listing")} href="/merchant-transaction-listing" className={link("merchant-transaction-listing")}>
                      {intl.formatMessage({ id: "Sidemenu.manualMerchantTransactions", defaultMessage: "Manual Transactions" })}
                    </a>
                  </li>
                )}

                {perm.manualNonAct.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/manual-non-activity-fees-transaction-listing")} href="/manual-non-activity-fees-transaction-listing" className={link("manual-non-activity-fees-transaction-listing")}>
                      {intl.formatMessage({ id: "Sidemenu.manualNonActivityFeesTransactions", defaultMessage: "Manual Non Activity Fees Transactions" })}
                    </a>
                  </li>
                )}

                {perm.nonActFeeInq.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/non-activity-fee-query")} href="/non-activity-fee-query" className={link("non-activity-fee-query")}>
                      {intl.formatMessage({ id: "Sidemenu.nonActivityFeeQuery", defaultMessage: "Non Activity Fee Query" })}
                    </a>
                  </li>
                )}

              </ul>
            </AccordionDetails>
          </Accordion>
        )}

        {/* ── Security ── */}
        {show.security && (
          <Accordion>
            <AccordionSummary
              expandIcon={<img src={down_arrow_icon} alt="" />}
              className="has-submenu"
            >
              <a href="#" className="menu-link">
                <em className="thumb-i">
                  <img src={lockIcon_gray} alt="" />
                  <img src={lockIcon} alt="" className="overlap" />
                </em>
                <span>{intl.formatMessage({ id: "Sidemenu.security", defaultMessage: "Security" })}</span>
              </a>
            </AccordionSummary>
            <AccordionDetails>
              <ul className="sub-menu">

                {perm.users.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/users-listing")} className={pathname.includes("users-listing") || pathname.includes("users-definition") ? "active menu-link" : "menu-link"}>
                      {intl.formatMessage({ id: "Users.users", defaultMessage: "Users" })}
                    </a>
                  </li>
                )}

                {perm.roles.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/roles-listing")} className={pathname.includes("roles-listing") || pathname.includes("roles-definition") ? "active menu-link" : "menu-link"}>
                      {intl.formatMessage({ id: "Roles.roles", defaultMessage: "Roles" })}
                    </a>
                  </li>
                )}

                {perm.pendingAct.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/pending-activities")} href="/pending-activities" className={link("pending-activities")}>
                      {intl.formatMessage({ id: "PendingActivity.title", defaultMessage: "Pending Activities" })}
                    </a>
                  </li>
                )}

                {perm.blockedIp.accessView === "1" && (
                  <li style={{ cursor: "pointer" }}>
                    <a onClick={(e) => handleMenuClick(e, "/blocked-ips-listing")} className={link("blocked-ip")}>
                      {intl.formatMessage({ id: "BlockedIp.blockedIp", defaultMessage: "Blocked IPs" })}
                    </a>
                  </li>
                )}

              </ul>
            </AccordionDetails>
          </Accordion>
        )}

        {/* ── Accounting Module (no fine-grained activity codes yet — show if authenticated) ── */}
        <Accordion>
          <AccordionSummary
            expandIcon={<img src={down_arrow_icon} alt="" />}
            className="has-submenu"
          >
            <a href="#" className="menu-link">
              <em className="thumb-i">
                <img src={inventory_management} alt="" />
                <img src={inventory_management_active} alt="" className="overlap" />
              </em>
              <span>{intl.formatMessage({ id: "Sidemenu.accountingModule", defaultMessage: "Accounting Module" })}</span>
            </a>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="sub-menu">
              <li style={{ cursor: "pointer" }}>
                <a onClick={(e) => handleMenuClick(e, "/institution-accounts")} href="/institution-accounts" className={link("institution-accounts")}>
                  {intl.formatMessage({ id: "Sidemenu.institutionAccounts", defaultMessage: "Institution Accounts" })}
                </a>
              </li>
              <li style={{ cursor: "pointer" }}>
                <a onClick={(e) => handleMenuClick(e, "/accounting-template")} href="/accounting-template" className={link("accounting-template")}>
                  {intl.formatMessage({ id: "Sidemenu.accountingTemplate", defaultMessage: "Accounting Template" })}
                </a>
              </li>
              <li style={{ cursor: "pointer" }}>
                <a onClick={(e) => handleMenuClick(e, "/output-template")} href="/output-template" className={link("output-template")}>
                  {intl.formatMessage({ id: "Sidemenu.outputFileTemplate", defaultMessage: "Output File Template" })}
                </a>
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>

        {/* ── Jobs (no fine-grained activity codes yet — show if authenticated) ── */}
        <Accordion>
          <AccordionSummary
            expandIcon={<img src={down_arrow_icon} alt="" />}
            className="has-submenu"
          >
            <a href="#" className="menu-link">
              <em className="thumb-i">
                <img src={lockIcon_gray} alt="" />
                <img src={lockIcon} alt="" className="overlap" />
              </em>
              <span>{intl.formatMessage({ id: "Sidemenu.jobs", defaultMessage: "Jobs" })}</span>
            </a>
          </AccordionSummary>
          <AccordionDetails>
            <ul className="sub-menu">
              <li style={{ cursor: "pointer" }}>
                <a onClick={(e) => handleMenuClick(e, "/jobs")} href="/jobs" className={link("jobs")}>
                  {intl.formatMessage({ id: "Sidemenu.jobs", defaultMessage: "Jobs" })}
                </a>
              </li>
            </ul>
            <ul className="sub-menu">
              <li style={{ cursor: "pointer" }}>
                <a onClick={(e) => handleMenuClick(e, "/job-monitoring")} href="/job-monitoring" className={link("job-monitoring")}>
                  {intl.formatMessage({ id: "Sidemenu.jobMonitoring", defaultMessage: "Job Monitoring" })}
                </a>
              </li>
            </ul>
            <ul className="sub-menu">
              <li style={{ cursor: "pointer" }}>
                <a onClick={(e) => handleMenuClick(e, "/task-batch-size")} href="/task-batch-size" className={link("task-batch-size")}>
                  {intl.formatMessage({ id: "Sidemenu.taskBatchSize", defaultMessage: "Task Batch Size" })}
                </a>
              </li>
            </ul>
            <ul className="sub-menu">
              <li style={{ cursor: "pointer" }}>
                <a onClick={(e) => handleMenuClick(e, "/processing-events")} href="/processing-events" className={link("processing-events")}>
                  {intl.formatMessage({ id: "Sidemenu.processingEvents", defaultMessage: "Task Execution" })}
                </a>
              </li>
            </ul>
            <ul className="sub-menu">
              <li style={{ cursor: "pointer" }}>
                <a onClick={(e) => handleMenuClick(e, "/task-execution-log")} href="/task-execution-log" className={link("task-execution-log")}>
                  {intl.formatMessage({ id: "Sidemenu.taskExecutionLog", defaultMessage: "Task Execution Log" })}
                </a>
              </li>
            </ul>
          </AccordionDetails>
        </Accordion>

      </div>

      <div className="sidebar-footer" style={{ marginLeft: "30%", marginTop: "88%" }}>
        <Typography style={{ color: "orange" }} variant="body1">
          {intl.formatMessage({ id: "Sidebar.version1.0", defaultMessage: "Version 1.0" })}
        </Typography>
      </div>
    </nav>
  );
}

export default Sidebar;
