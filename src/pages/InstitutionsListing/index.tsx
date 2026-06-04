import {
  Box,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableSortLabel,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { add_rounded, delete_ic, edit_ic } from "../../assets/images";
import { Institution } from "../../models/configuration/InstitutionModel";
import { InstitutionService } from "../../services/configuration/institution-service";
import { LoginService } from "../../services/login-service";
import { ApplicationLanguage, ConfigurationActivities, Errors, StatusCode } from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";
import { getLocalStorage, LOCALSTORAGE_KEYS, setLocalStorage } from "../../utils/helper";
import { visuallyHidden } from "@mui/utils";
import { InstitutionControlService } from "../../services/configuration/institution-control-service";

function InstitutionsListing() {
  const navigate = useNavigate();
  const intl = useIntl();

  const [institution, setInstitution] = useState<Institution[]>([]);

  const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.INST), []);
  const canAdd = perms.accessAdd === "1" && hasApiAccess(ConfigurationActivities.INST, 'SINST');
  const canUpdate = perms.accessUpdate === "1" && hasApiAccess(ConfigurationActivities.INST, 'SINSTSC');
  const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.INST, 'DINST');
  const canView = perms.accessView === "1";

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Institution>('institutionId');

  /* START (sort table data) */
  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  type Order = 'asc' | 'desc';

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const createSortHandler = (
    property: keyof Institution
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  /* END (sort table data) */

  useEffect(() => {
    getAllInstitute();
  }, []);

  const getAllInstitute = async () => {
    await InstitutionService.getAllInstitution()
      .then((res) => {
        setInstitution([...res.data]);
      })
      .catch((err) =>   toast.error(err.response.data.errors[0]));
  };

  const updateInstListHeader = async () => {
    await LoginService.refreshAuthenticateUser().then(res => {
      if (res.status === StatusCode.Success) {
        const data = JSON.stringify(res.data);
        if (res.data?.user && res.data?.user?.institution?.length !== 0) {
          setLocalStorage(LOCALSTORAGE_KEYS.USER, data);

          const filteredInstitute = res.data?.user?.institution?.filter(
            (s: any) => s.status === "1"
          );

          if (res.data?.user?.defaultInstitutionId) {
            setLocalStorage(
              LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE,
              res.data?.user?.defaultInstitutionId
            );
          }

          if (res.data?.user?.preferedLanguageCodeDescription.toString().toLowerCase() === 'arabic') {
            setLocalStorage(LOCALSTORAGE_KEYS.LANGUAGE, ApplicationLanguage.ARABIC);
          }

          if (res.data?.user?.userRoles) {
            setLocalStorage(
              LOCALSTORAGE_KEYS.ROLE_ACTIVITY,
              JSON.stringify(res.data?.user?.userRoles)
            );
          }

          setLocalStorage(
            LOCALSTORAGE_KEYS.INSTITUTES,
            JSON.stringify(filteredInstitute)
          );
          window.location.reload();
        }
      }
    })
  }
  
  const editInstitute = async (id: string) => {
    InstitutionControlService.getInstitutionControlByInstitution(id)
      .then((response: { data: any }) => {
        navigate(`/institutions-definition/${id}/${response.data.recordSeqId}`);
      })
      .catch((error: any) => {
         toast.error(error.response.data.errors[0])
      });
  };

  const onDelete = (id: string) => {
    const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
    if (id === instID) {
      // toast.error("cannot be deleted! please change the selected institution from header.")
      Swal.fire({
        title: intl.formatMessage({
          id: "DeleteAlert.DeleteError.title",
          defaultMessage: "Cannot be deleted!",
        }),
        text: intl.formatMessage({
          id: "DeleteAlert.DeleteError.selectedInHeader",
          defaultMessage: "Please Change The Selected Institution From Header"
        }),
        icon: "error",
        confirmButtonText: intl.formatMessage({
          id: "DeleteAlert.okButtonText",
          defaultMessage: "OK",
        }),
      });
    } else {
      Swal.fire({
        title: intl.formatMessage({
          id: "DeleteAlert.title",
          defaultMessage: "Are you sure?"
        }),
        text: intl.formatMessage({
          id: "DeleteAlert.text",
          defaultMessage: "You won't be able to revert this!",
        }),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: intl.formatMessage({
          id: "DeleteAlert.cancelButtonText",
          defaultMessage: "Cancel",
        }),
        confirmButtonText: intl.formatMessage({
          id: "DeleteAlert.confirmButtonText",
          defaultMessage: "Yes, delete it!",
        }),

      }).then((result: any) => {
        if (result.isConfirmed) {
          InstitutionService.deleteInstitution(id).then((res) => {
            if (res.status === StatusCode.Success) {
              Swal.fire({
                title: intl.formatMessage({
                  id: "DeleteAlert.DeleteSuccess.title",
                  defaultMessage: "Deleted!",
                }),
                text: intl.formatMessage({
                  id: "DeleteAlert.DeleteSuccess.text",
                  defaultMessage: "Record has been deleted.",
                }),
                icon: "success",
                confirmButtonText: intl.formatMessage({
                  id: "DeleteAlert.okButtonText",
                  defaultMessage: "OK",
                }),
              })
            }
            getAllInstitute();
            updateInstListHeader();
          }).catch(err => {
            if (err && err.response 
             // && err.response.data === Errors.ReferenceExists
            ) {
              Swal.fire({
                title: intl.formatMessage({
                  id: "DeleteAlert.DeleteError.title",
                  defaultMessage: "Cannot be deleted!",
                }),
                text: intl.formatMessage({
                  id: "DeleteAlert.DeleteError.referenceExist",
                                defaultMessage:err.response.data.errors[0]
                }),
                icon: "error",
                confirmButtonText: intl.formatMessage({
                  id: "DeleteAlert.okButtonText",
                  defaultMessage: "OK",
                }),
              });
            } else {
          toast.error(err.response.data.errors[0])
            }
          });
        }
      });
    }
  };


  const changeStatus = async (id: string, event: any) => {
    const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
    if(instID === id) {
      toast.error("Cannot change the status of the institution chosen in the header");
    }
    else {
      const model = {
        idString: id,
        status: event.target.checked === true ? "1" : "0",
      };
      InstitutionService.changeInstituteStatus(model)
        .then((res) => {
          getAllInstitute();
          toast.success(res?.data+"")
        })
        .catch((err) =>   toast.error(err.response.data.errors[0]));
    }
  };

  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"}>
                  {intl.formatMessage({
                    id: "Institution.title",
                    defaultMessage: "Institutions",
                  })}
                </Typography>
                <p className="pb-0">
                  {intl.formatMessage({
                    id: "Institution.subTitle",
                    defaultMessage:
                      "View or edit the list of defined institutions",
                  })}
                </p>
              </div>
              <div className="right-block">
                <Button
                  variant="contained"
                  onClick={() => navigate("/institutions-definition")}
                  disableElevation
                  className="btn-light"
                  endIcon={<img src={add_rounded} alt="add" />}
                  disabled={!canAdd}
                >
                  <FormattedMessage
                    id="Institution.addBtn"
                    defaultMessage="Add Institution"
                  />
                </Button>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'institutionId'}
                        direction={orderBy === 'institutionId' ? order : 'asc'}
                        onClick={() => createSortHandler("institutionId")}
                      >
                        {
                          intl.formatMessage({
                            id: "Institution.institutionId",
                            defaultMessage: "Institution Id"
                          })
                        }
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'institutionName'}
                        direction={orderBy === 'institutionName' ? order : 'asc'}
                        onClick={() => createSortHandler("institutionName")}
                      >
                        {
                          intl.formatMessage({
                            id: "Institution.name",
                            defaultMessage: "Name"
                          })
                        }
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'institutionTypeAlt'}
                        direction={orderBy === 'institutionTypeAlt' ? order : 'asc'}
                        onClick={() => createSortHandler("institutionTypeAlt")}
                      >
                        {
                          intl.formatMessage({
                            id: "Institution.alternateName",
                            defaultMessage: "Alternate Name"
                          })
                        }
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'institutionTypeCodeDescription'}
                        direction={orderBy === 'institutionTypeCodeDescription' ? order : 'asc'}
                        onClick={() => createSortHandler("institutionTypeCodeDescription")}
                      >
                        {
                          intl.formatMessage({
                            id: "Institution.type",
                            defaultMessage: "Type"
                          })
                        }
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="center" width="190px" className="last-column-border-header">
                      {intl.formatMessage({
                        id: "Institution.actions",
                        defaultMessage: "Actions",
                      })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {institution.sort(getComparator(order, orderBy)).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.institutionId}</TableCell>
                      <TableCell>{row.institutionName}</TableCell>
                      <TableCell>{row.institutionTypeAlt}</TableCell>
                      <TableCell>{row.institutionTypeCodeDescription}</TableCell>
                      <TableCell align="center" width="190px" className="last-column-border">
                        <div className="action btns-block">
                          <Switch
                            className="custom"
                            checked={row.status === "1" ? true : false}
                            onChange={(e) => changeStatus(row.institutionId, e)}
                            disabled={!canUpdate}
                          />
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={() => editInstitute(row.institutionId)}
                            disabled={!canUpdate}
                          >
                            <img src={edit_ic} alt="mail" />
                          </IconButton>
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={() => onDelete(row.institutionId)}
                            disabled={!canDelete}
                          >
                            <img src={delete_ic} alt="mail" />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {institution &&
                    institution.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={13} className="last-column-border">
                          <p style={{ textAlign: "center" }}>
                            {intl.formatMessage({
                              id: "Institution.noDataFound",
                              defaultMessage: "No Data Found.",
                            })}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </main>
      </div>
    </>
  );
}

export default InstitutionsListing;
