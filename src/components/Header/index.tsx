import React, { useEffect, useState } from "react";
import { home, userIcon, lan_img, down_arrow_icon } from "../../assets/images";
import {
  Breadcrumbs,
  ButtonBase,
  FormControl,
  Link,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useLocation } from "react-router";
import { useIntl } from "react-intl";
import {
  getLocalStorage,
  LOCALSTORAGE_KEYS,
  setLocalStorage,
  signOut,
} from "../../utils/helper";
import { useNavigate } from "react-router";
import { Institution } from "../../models/configuration/InstitutionModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import { toast } from "react-toastify";
import { ApplicationLanguage, ROLE_ACTIVITY } from "../../utils/constant";
import Swal from "sweetalert2";
import { roleActivities, RoleMainModel } from "../../models/security/RoleModel";
import { RoleService } from "../../services/security/role-service";

function Header(props: any) {
  const { pathname } = useLocation();
  const intl = useIntl();
  const navigate = useNavigate();
  const [headerPath, setHeaderPath] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectInstitutionVal, setSelectInstitutionVal] = React.useState("");
  const [activeRole, setActiveRole] = React.useState<RoleMainModel[]>([]);

  // profile popover
  const [anchorElProfile, setAnchorElProfile] =
    useState<HTMLButtonElement | null>(null);
  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorElProfile(null);
  };

  const getActiveInstitution = async () => {
    await InstitutionService.getActiveInstitution()
      .then((res) => {
        setInstitutions([...res.data]);
      })
      .catch((err) =>          toast.error(err.response.data.errors[0])
      );
  };

  const handleInstitutionChange = (event: SelectChangeEvent) => {
    let instRoleId = loginUser?.user?.userRoles.find(
      (role: any) => role.instId === event.target.value
    )?.roleId;
    let isRoleActive = activeRole.find((role) => role.roleId === instRoleId);
    if (isRoleActive !== undefined) {
      Swal.fire({
        title: intl.formatMessage({
          id: "ChangeAlert.title",
          defaultMessage: "Changed!",
        }),
        text: intl.formatMessage({
          id: "ChangeAlert.text",
          defaultMessage: "Institution has been changed.",
        }),
        icon: "success",
        confirmButtonText: intl.formatMessage({
          id: "DeleteAlert.okButtonText",
          defaultMessage: "OK",
        }),
      }).then((result: any) => {
        if (result) {
          setSelectInstitutionVal(event.target.value);
          const selectedInstitutionId =
            event.target.value !== ""
              ? String(event.target.value)
              : String(institutions[0].institutionId);
          setLocalStorage(
            LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE,
            selectedInstitutionId
          );
          window.location.reload();
          navigate("/dashboard");
        }
      });
    } else {
      Swal.fire({
        title: intl.formatMessage({
          id: "ChangeAlert.DeleteError.titlechange",
          defaultMessage: "Cannot change Institution",
        }),
        text: intl.formatMessage({
          id: "ChangeAlert.DeleteError.referenceExistchange",
          defaultMessage: "Assigned Role is disabled",
        }),
        icon: "error",
        confirmButtonText: intl.formatMessage({
          id: "DeleteAlert.okButtonText",
          defaultMessage: "OK",
        }),
      });
    }
  };

  const setInstitutefromLocalStorage = async () => {
    const instID = getLocalStorage(
      LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE
    ) as string;
    if (instID) {
      setSelectInstitutionVal(instID);
    }
  };

  const open = Boolean(anchorElProfile);
  const id = open ? "simple-popover" : undefined;

  // language
  const Language = getLocalStorage(LOCALSTORAGE_KEYS.LANGUAGE);

  const loginUser = JSON.parse(
    getLocalStorage(LOCALSTORAGE_KEYS.USER) as string
  );

  const [selectLanguage, setSelectLanguage] = useState(
    Language ? Language : ApplicationLanguage.ENGLISH
  );
  const [anchorLanguage, setAnchorLanguage] = useState<null | HTMLElement>(
    null
  );
  const openLanguage = Boolean(anchorLanguage);

  const handleCloseLanguage = () => {
    setAnchorLanguage(null);
  };

  const handleClickLanguage = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorLanguage(event.currentTarget);
  };

  function toggleMenu() {
    document.body.classList.toggle("toggle-menu");
  }

  useEffect(() => {
    if (loginUser) {
      getActiveInstitution();
      setInstitutefromLocalStorage();
      if (loginUser?.user?.preferedLanguageCodeValue === "Arabic") {
        setSelectLanguage(ApplicationLanguage.ARABIC);
        setAnchorLanguage(null);
        setLocalStorage(LOCALSTORAGE_KEYS.LANGUAGE, ApplicationLanguage.ARABIC);
        document.body.id = "arabic";
        document.body.classList.add("rtl");
        props.setCurrentLocale("ar");
      } else if (Language === ApplicationLanguage.ARABIC) {
        (document.body.id = "arabic") && document.body.classList.add("rtl");
      } else {
        (document.body.id = " ") && document.body.classList.remove("rtl");
      }
      RoleService.getActiveRolesByInstitution()
        .then((res) => {
          if (res.data) {
            setActiveRole([...res.data]);
          }
        })
        .catch((err) =>           toast.error(err.response.data.errors[0])
        );
    }
  }, []);

  const OnSelectEnglish = () => {
    setSelectLanguage(ApplicationLanguage.ENGLISH);
    setAnchorLanguage(null);
    document.body.id = " ";
    document.body.classList.remove("rtl");
    setLocalStorage(LOCALSTORAGE_KEYS.LANGUAGE, ApplicationLanguage.ENGLISH);

    props.setCurrentLocale("en");
  };

  const OnSelectArabic = () => {
    setSelectLanguage(ApplicationLanguage.ARABIC);
    setAnchorLanguage(null);
    setLocalStorage(LOCALSTORAGE_KEYS.LANGUAGE, ApplicationLanguage.ARABIC);
    document.body.id = "arabic";
    document.body.classList.add("rtl");
    props.setCurrentLocale("ar");
  };

  const logout = async () => {
    signOut();
    document.body.id = " ";
    document.body.classList.remove("rtl");
    props.setCurrentLocale("en");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="mobile-bg-shadow" onClick={toggleMenu} />
      <div className="f-align-center">
        <div className="hamburger" id="hamburger" onClick={toggleMenu}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
        <a href="/" title="MAS Prime" className="logo">
          {intl.formatMessage({
            id: "Header.title",
            defaultMessage: "MAS Prime",
          })}
        </a>
      </div>
      <div className="left-block">
        <Breadcrumbs className="breadcrum">
          <Link href="/dashboard">
            <em
              className={
                headerPath.length === 0
                  ? "active border-icon-btn"
                  : "border-icon-btn"
              }
            >
              <img src={home} alt="home" />
            </em>
            <span className={pathname.includes("dashboard") ? "active" : ""}>
              {intl.formatMessage({
                id: "Header.home",
                defaultMessage: "Home",
              })}
            </span>
          </Link>
          {pathname.includes("entities-definition") ? (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.institutionManagement",
                  defaultMessage: "Institution Management",
                })}
              </Link>
              <Link href="/entities-listing">
                {intl.formatMessage({
                  id: "Header.entities",
                  defaultMessage: "Entities",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.entitiesDefinition",
                  defaultMessage: "Entities Definition",
                })}
              </span>
            </Breadcrumbs>
          ) : (
            pathname.includes("entities-listing") && (
              <Breadcrumbs>
                <Link href="#">
                  {intl.formatMessage({
                    id: "Header.institutionManagement",
                    defaultMessage: "Institution Management",
                  })}
                </Link>
                <span className="active">
                  {intl.formatMessage({
                    id: "Header.entities",
                    defaultMessage: "Entities",
                  })}
                </span>
              </Breadcrumbs>
            )
          )}
          {pathname.includes("institutions-definition") ? (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.institutionConfiguration",
                  defaultMessage: "Institution Configuration",
                })}
              </Link>
              <Link href="/institutions-listing">
                {intl.formatMessage({
                  id: "Header.institutions",
                  defaultMessage: "Institutions",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.institutionsDefinition",
                  defaultMessage: "Institutions Definition",
                })}
              </span>
            </Breadcrumbs>
          ) : (
            pathname.includes("institutions-listing") && (
              <Breadcrumbs>
                <Link href="#">
                  {intl.formatMessage({
                    id: "Header.institutionConfiguration",
                    defaultMessage: "Institution Configuration",
                  })}
                </Link>
                <span className="active">
                  {intl.formatMessage({
                    id: "Header.institutions",
                    defaultMessage: "Institutions",
                  })}
                </span>
              </Breadcrumbs>
            )
          )}
          {pathname.includes("currency-conversion") ? (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.institutionConfiguration",
                  defaultMessage: "Institution Configuration",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.currencyConversion",
                  defaultMessage: "Currency Conversion",
                })}
              </span>
            </Breadcrumbs>
          ) : pathname.includes("currency-rate") ? (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.institutionConfiguration",
                  defaultMessage: "Institution Configuration",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.currencyRate",
                  defaultMessage: "Currency Rate",
                })}
              </span>
            </Breadcrumbs>
          ) : pathname.includes("currency") && pathname === "/currency" ? (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.systemConfiguration",
                  defaultMessage: "System Configuration",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.currency",
                  defaultMessage: "Currency",
                })}
              </span>
            </Breadcrumbs>
          ) : (
            ""
          )}
          )
          {pathname.includes("card-scheme-definition") ? (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.systemConfiguration",
                  defaultMessage: "System Configuration",
                })}
              </Link>
              <Link href="/card-scheme">
                {intl.formatMessage({
                  id: "Header.cardScheme",
                  defaultMessage: "Card Scheme",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.cardSchemeDefinition",
                  defaultMessage: "Card Scheme Definition",
                })}
              </span>
            </Breadcrumbs>
          ) : (
            pathname.includes("card-scheme") && (
              <Breadcrumbs>
                <Link href="#">
                  {intl.formatMessage({
                    id: "Header.configuration",
                    defaultMessage: "Configuration",
                  })}
                </Link>
                <span className="active">
                  {intl.formatMessage({
                    id: "Header.cardScheme",
                    defaultMessage: "Card Scheme",
                  })}
                </span>
              </Breadcrumbs>
            )
          )}
          {pathname.includes("/non-activity-fees-packages-definition") ? (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.institutionConfiguration",
                  defaultMessage: "Institution Configuration",
                })}
              </Link>
              <Link href="/non-activity-fees-packages">
                {intl.formatMessage({
                  id: "Header.nonActivityFeesPackages",
                  defaultMessage: "Non Activity Fees Packages",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.nonActivityFeesPackagesDefinition",
                  defaultMessage: "Non Activity Fees Packages Definition",
                })}
              </span>
            </Breadcrumbs>
          ) : (
            pathname.includes("/non-activity-fees-packages") && (
              <Breadcrumbs>
                <Link href="#">
                  {intl.formatMessage({
                    id: "Header.institutionConfiguration",
                    defaultMessage: "Institution Configuration",
                  })}
                </Link>
                <span className="active">
                  {intl.formatMessage({
                    id: "Header.nonActivityFeesPackages",
                    defaultMessage: "Non Activity Fees Packages",
                  })}
                </span>
              </Breadcrumbs>
            )
          )}
          {pathname !== "/non-activity-fees-packages-definition" &&
            pathname.includes("/activity-fees-packages-definition") ? (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.institutionConfiguration",
                  defaultMessage: "Institution Configuration",
                })}
              </Link>
              <Link href="/activity-fees-packages">
                {intl.formatMessage({
                  id: "Header.activityFeesPackages",
                  defaultMessage: "Activity Fees Packages",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.activityFeesPackagesDefinition",
                  defaultMessage: "Activity Fees Packages Definition",
                })}
              </span>
            </Breadcrumbs>
          ) : (
            pathname !== "/non-activity-fees-packages" &&
            pathname.includes("/activity-fees-packages") && (
              <Breadcrumbs>
                <Link href="#">
                  {intl.formatMessage({
                    id: "Header.institutionConfiguration",
                    defaultMessage: "Institution Configuration",
                  })}
                </Link>
                <span className="active">
                  {intl.formatMessage({
                    id: "Header.activityFeesPackages",
                    defaultMessage: "Activity Fees Packages",
                  })}
                </span>
              </Breadcrumbs>
            )
          )}
          {pathname.includes("terminal-type") ? (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.systemConfiguration",
                  defaultMessage: "System Configuration",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.terminalType",
                  defaultMessage: "Terminal Type",
                })}
              </span>
            </Breadcrumbs>
          ) : (
            ""
          )}
          {pathname.includes("mcc") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.systemConfiguration",
                  defaultMessage: "System Configuration",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.mcc",
                  defaultMessage: "MCC",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("country") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.systemConfiguration",
                  defaultMessage: "System Configuration",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.country",
                  defaultMessage: "Country",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("city") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.systemConfiguration",
                  defaultMessage: "System Configuration",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.city",
                  defaultMessage: "City",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("transaction-groups-listing") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.institutionConfiguration",
                  defaultMessage: "Institution Configuration",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.transactionGroups",
                  defaultMessage: "Transaction Groups",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("employees") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.institutionConfiguration",
                  defaultMessage: "Institution Configuration",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.Employees",
                  defaultMessage: "Employees",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("change-password") && (
            <Breadcrumbs>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.Employees",
                  defaultMessage: "Employees",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("merchant-transaction-listing") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.transactionManagement",
                  defaultMessage: "Transaction Management",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.MerchantTransactionListing",
                  defaultMessage: "Manual Transactions",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("merchant-transaction-definition") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.transactionManagement",
                  defaultMessage: "Transaction Management",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.MerchantTransactionDefinition",
                  defaultMessage: "Manual Transaction",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes(
            "manual-non-activity-fees-transaction-listing"
          ) && (
              <Breadcrumbs>
                <Link href="#">
                  {intl.formatMessage({
                    id: "Header.transactionManagement",
                    defaultMessage: "Transaction Management",
                  })}
                </Link>
                <span className="active">
                  {intl.formatMessage({
                    id: "Header.ManualNonActivityFeesListing",
                    defaultMessage: "Manual Non Activity Fees Transactions",
                  })}
                </span>
              </Breadcrumbs>
            )}
          {pathname.includes(
            "manual-non-activity-fees-transaction-definition"
          ) && (
              <Breadcrumbs>
                <Link href="#">
                  {intl.formatMessage({
                    id: "Header.transactionManagement",
                    defaultMessage: "Transaction Management",
                  })}
                </Link>
                <span className="active">
                  {intl.formatMessage({
                    id: "Header.ManualNonActivityFeesDefinition",
                    defaultMessage: "Manual Non Activity Fees Transaction",
                  })}
                </span>
              </Breadcrumbs>
            )}
          {pathname.includes("non-activity-fee-query") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.transactionManagement",
                  defaultMessage: "Transaction Management",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.NonActivityFeeQuery",
                  defaultMessage: "Non Activity Fee Query",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("acquiring-transactions") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.transactionManagement",
                  defaultMessage: "Transaction Management",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.AcquiringTransactions",
                  defaultMessage: "Acquiring Transactions",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("transactions-definition") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.entitiesManagement",
                  defaultMessage: "Entity Management",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.transactions",
                  defaultMessage: "Transactions",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("system-codes") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.entitiesManagement",
                  defaultMessage: "Entity Management",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.systemcodes",
                  defaultMessage: "System Codes",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("maker-checker-configuration") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.entitiesManagement",
                  defaultMessage: "Entity Management",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.makerCheckerConfiguration",
                  defaultMessage: "Maker Checker Configuration",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("users-listing") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Roles.security",
                  defaultMessage: "Security",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Users.users",
                  defaultMessage: "Users",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("users-definition") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Roles.security",
                  defaultMessage: "Security",
                })}
              </Link>
              <Link href="/users-listing">
                {intl.formatMessage({
                  id: "Users.users",
                  defaultMessage: "Users",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.userdefinition",
                  defaultMessage: "User Definition",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.endsWith("roles-listing") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Roles.security",
                  defaultMessage: "Security",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Roles.roles",
                  defaultMessage: "Roles",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("roles-definition") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Roles.security",
                  defaultMessage: "Security",
                })}
              </Link>
              <Link href="/roles-listing">
                {intl.formatMessage({
                  id: "Roles.roles",
                  defaultMessage: "Roles",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.roledefinition",
                  defaultMessage: "Role Definition",
                })}
              </span>
            </Breadcrumbs>
          )}
           {pathname.includes("blocked-ips-listing") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Roles.security",
                  defaultMessage: "Security",
                })}
              </Link>
              <Link href="/roles-listing">
                {intl.formatMessage({
                  id: "BlockedIps",
                  defaultMessage: "Blocked Ips",
                })}
              </Link>
            </Breadcrumbs>
          )}
          {pathname.includes("user-profile") && (
            <Breadcrumbs>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.userprofile",
                  defaultMessage: "User Profile",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("unauthorised-access") && (
            <Breadcrumbs>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.unauthorisedaccess",
                  defaultMessage: "Unauthorised Access",
                })}
              </span>
            </Breadcrumbs>
          )}
          {/* MSH */}
          {pathname.includes("issuer-profile") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.institutionConfiguration",
                  defaultMessage: "Institution Configuration",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.issuerProfile",
                  defaultMessage: "Issuer Profile",
                })}
              </span>
            </Breadcrumbs>
          )}

          {pathname.includes("issuer-relation") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.institutionConfiguration",
                  defaultMessage: "Institution Configuration",
                })}
              </Link>
              <Link href="/issuer-profile">
                {intl.formatMessage({
                  id: "Header.issuerProfile",
                  defaultMessage: "Issuer Profile",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.issuerRelation",
                  defaultMessage: "Issuer Relation",
                })}
              </span>
            </Breadcrumbs>
          )}

          {pathname.includes("bankcode") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.institutionConfiguration",
                  defaultMessage: "Institution Configuration",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.bankCode",
                  defaultMessage: "Bank Code",
                })}
              </span>
            </Breadcrumbs>
          )}

          {pathname.includes("institution-accounts") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.accountingModule",
                  defaultMessage: "Accounting Module",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.institutionAccounts",
                  defaultMessage: "Institution Accounts",
                })}
              </span>
            </Breadcrumbs>
          )}

          {pathname.includes("institution-accs-details") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.accountingModule",
                  defaultMessage: "Accounting Module",
                })}
              </Link>
              <Link href="/institution-accounts">
                {intl.formatMessage({
                  id: "Header.institutionAccounts",
                  defaultMessage: "Institution Accounts",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.institutionAccountsDefinition",
                  defaultMessage: "Institution Account Definition",
                })}
              </span>
            </Breadcrumbs>
          )}

          {pathname.includes("accounting-template") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.accountingModule",
                  defaultMessage: "Accounting Module",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.accountingTemplate",
                  defaultMessage: "Accounting Template",
                })}
              </span>
            </Breadcrumbs>
          )}

          {pathname.includes("accounting-details") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.accountingModule",
                  defaultMessage: "Accounting Module",
                })}
              </Link>
              <Link href="/accounting-template">
                {intl.formatMessage({
                  id: "Header.accountingTemplate",
                  defaultMessage: "Accounting Template",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.accountingTemplateDetails",
                  defaultMessage: "Accounting Template Bank",
                })}
              </span>
            </Breadcrumbs>
          )}

          {pathname.includes("accounting-subheader") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.accountingModule",
                  defaultMessage: "Accounting Module",
                })}
              </Link>
              <Link href="/accounting-template">
                {intl.formatMessage({
                  id: "Header.accountingTemplate",
                  defaultMessage: "Accounting Template",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.accountingTemplateDetails",
                  defaultMessage: "Accounting Template Bank",
                })}
              </span>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.accountingTemplateDetails",
                  defaultMessage: "Accounting Template Details",
                })}
              </span>
            </Breadcrumbs>
          )}

          {pathname.includes("output-template") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.accountingModule",
                  defaultMessage: "Accounting Module",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.outputTemplate",
                  defaultMessage: "Output Template",
                })}
              </span>
            </Breadcrumbs>
          )}

          {pathname.includes("output-details") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.accountingModule",
                  defaultMessage: "Accounting Module",
                })}
              </Link>
              <Link href="/output-template">
                {intl.formatMessage({
                  id: "Header.outputTemplate",
                  defaultMessage: "Output Template",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.outputTemplateDetails",
                  defaultMessage: "Output Template Details",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("import-merchants") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.jobs",
                  defaultMessage: "Jobs",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.importjobs",
                  defaultMessage: "Import Jobs",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("services") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.Merchantportal",
                  defaultMessage: "Merchant portal",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.services",
                  defaultMessage: "Services",
                })}
              </span>
            </Breadcrumbs>
          )}
          {pathname.includes("newsletters") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.Merchantportal",
                  defaultMessage: "Merchant portal",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.newsletters",
                  defaultMessage: "Newsletters",
                })}
              </span>
            </Breadcrumbs>
          )}
        {pathname.includes("campaigns") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.Merchantportal",
                  defaultMessage: "Merchant portal",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.campaigns",
                  defaultMessage: "campaigns",
                })}
              </span>
            </Breadcrumbs>
          )}
         {pathname.includes("registration-approval") && (
            <Breadcrumbs>
              <Link href="#">
                {intl.formatMessage({
                  id: "Header.Merchantportal",
                  defaultMessage: "Merchant portal",
                })}
              </Link>
              <span className="active">
                {intl.formatMessage({
                  id: "Header.registrationApproval",
                  defaultMessage: "Registration approval",
                })}
              </span>
            </Breadcrumbs>
          )}
        </Breadcrumbs>
      </div>
      <ul className="right-block">
        {/* <p> value: {selectInstitutionVal?"yes":"no"}</p> */}
        {pathname.includes("dashboard") ? (
          <li>
            <FormControl className="header_inst">
              <Select
                value={selectInstitutionVal}
                onChange={handleInstitutionChange}
                IconComponent={() => <img src={down_arrow_icon} alt="" />}
              >
                {institutions &&
                  institutions.length > 0 &&
                  institutions.map((type) => {
                    return (
                      <MenuItem
                        key={type.institutionId}
                        value={type.institutionId}
                      >
                        {type.institutionName}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </li>
        ) : (
          <li className="header-institution">
            {institutions &&
              institutions.length > 0 &&
              institutions.filter(
                (item) => item.institutionId === selectInstitutionVal
              ).length > 0
              ? institutions.filter(
                (item) => item.institutionId === selectInstitutionVal
              )[0].institutionName
              : ""}
          </li>
        )}
        {/* <li>
          <div className="lag-select-block">
            <ButtonBase onClick={handleClickLanguage} className="btn-lang">
              <em className="border-icon-btn">
                <img src={lan_img} alt="language" />
              </em>
              <span className="name">{selectLanguage}</span>
              <img src={down_arrow_icon} alt="down_arrow_icon" />
            </ButtonBase>
            <Menu
              className="menu-lang"
              id="basic-menu"
              anchorEl={anchorLanguage}
              open={openLanguage}
              onClose={handleCloseLanguage}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={OnSelectEnglish}>
                {ApplicationLanguage.ENGLISH}
              </MenuItem>
              <MenuItem onClick={OnSelectArabic}>
                {ApplicationLanguage.ARABIC}
              </MenuItem>
            </Menu>
          </div>
        </li> */}
        <li>
          <div>
            <ButtonBase onClick={handleProfileClick} className="user-wrapper">
              <em className="border-icon-btn">
                <img src={userIcon} alt="userIcon" />
              </em>
              <div className="user-name">
                <span>
                  {loginUser ? loginUser.user.firstName : "Nil Neetin"}
                </span>
              </div>
            </ButtonBase>
            <Menu
              className="profile-menu"
              id={id}
              open={open}
              anchorEl={anchorElProfile}
              onClose={handleProfileClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate(`/user-profile/${loginUser?.user?.userId}`, {
                    state: {
                      isUserProfile: true,
                    }
                  });
                  setAnchorElProfile(null);
                }}
              >
                My Profile
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/change-password");
                }}
              >
                Change Password
              </MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </div>
        </li>
      </ul>
    </header>
  );
}

export default Header;
