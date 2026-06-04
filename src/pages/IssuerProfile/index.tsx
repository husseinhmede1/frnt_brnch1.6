import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    FormControl,
    Grid,
    Select,
    MenuItem,
    IconButton,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import {
    add_rounded,
    delete_ic,
    down_arrow_icon,
    edit_ic
} from "../../assets/images";
import Button from "@mui/material/Button";
import { InstitutionService } from "../../services/configuration/institution-service";
import { IssuerProfileService } from "../../services/configuration/issuer-profile-service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Institution } from "../../models/configuration/InstitutionModel";
import { IssProfile } from "../../models/configuration/IssuerProfileModel";
import Swal from "sweetalert2";
import { Errors, StatusCode } from "../../utils/constant";
import { toast } from "react-toastify";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { visuallyHidden } from "@mui/utils";
import { useMemo } from "react";
import { ConfigurationActivities } from "../../utils/constant";
import { getActivityPermissions, hasApiAccess } from "../../utils/permissionUtils";

function IssuerProfile() {
    const intl = useIntl();

    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.ISSPR), []);
    const canAdd    = perms.accessAdd    === "1" && hasApiAccess(ConfigurationActivities.ISSPR, 'ISSPRCRT');
    const canUpdate = perms.accessUpdate === "1";
    const canDelete = perms.accessDelete === "1" && hasApiAccess(ConfigurationActivities.ISSPR, 'ISSPRDEL');
    const canLoadInstitutions = hasApiAccess(ConfigurationActivities.ISSPR, 'GAAINST');
    const canLoadIssuerProfilesByInst = hasApiAccess(ConfigurationActivities.ISSPR, 'ISSPRINST');

    const [institution, setInstitution] = useState<Institution[]>([]);
    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [issuers, setIssuers] = useState<IssProfile[]>([]);
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IssProfile>('profileDescription');

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
        property: keyof IssProfile
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    /* END (sort table data) */

    const setInstitutefromLocalStorage = async () => {
        const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
        if (instID) {
            setSelectInstitutionVal(instID);
        }
        getIssuerProfilesByInstitutionId(instID);
    };

    const editIssuerProfile = async (id: number, issuerAcqProfile: String) => {
        navigate(`/issuer-relation/${id}/${issuerAcqProfile}/${selectInstitutionVal}`);
    };

    const getIssuerProfilesByInstitutionId = async (id: string | "") => {
        if (!canLoadIssuerProfilesByInst) return;
        await IssuerProfileService.getIssuerProfilesByInstitution(id)
            .then((res) => {
                setIssuers([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
        const selectedInstitutionId =
            event.target.value !== ""
                ? event.target.value
                : institution[0].institutionId;
        getIssuerProfilesByInstitutionId(selectedInstitutionId);
    };

    const onDelete = (id: number) => {
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
                IssuerProfileService.deleteIssuerProfile(id).then((res) => {
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
                    getIssuerProfilesByInstitutionId(selectInstitutionVal);
                }).catch(err => {
                    // if (err && err.response && err.response.data === Errors.ReferenceExists) {
                    if (err && err?.response?.status === 400) {
                        if (err.response.data.errors[0] === 'CFG-0228') {
                            toast.error("The issuer profile is already in use, it cannot be deleted");
                        }
                    }
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
                    //}
                });
            }
        });
    };

    useEffect(() => {
        if (canLoadInstitutions) {
            InstitutionService.getActiveInstitution()
                .then((response: { data: any }) => {
                    setInstitutions(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });
        }
        setInstitutefromLocalStorage();
    }, []);
    return (
        <div className="wrapper">
            <main className="main-content">
                <div className="main-card">
                    <div className="title-block">
                        <div className="left-block">
                            <Typography variant={"h2"}>
                                {intl.formatMessage({
                                    id: "IssuerProfile.title",
                                    defaultMessage: "Issuer Profile",
                                })}
                            </Typography>
                            <p className="pb-0">
                                {intl.formatMessage({
                                    id: "IssuerProfile.subTitle",
                                    defaultMessage: "List of defined Issuer Profiles",
                                })}
                            </p>
                        </div>

                        <div className="right-block">
                            <Button
                                sx={{ mt: 4 }}
                                variant="contained"
                                disableElevation
                                className="btn-light"
                                endIcon={<img src={add_rounded} alt="add" />}
                                onClick={() => navigate(`/issuer-relation/${selectInstitutionVal}`)}
                                disabled={!canAdd}
                            >
                                <FormattedMessage
                                    id="IssuerProfile.addBtn"
                                    defaultMessage="Add Profile"
                                />
                            </Button>
                        </div>
                    </div>
                    <Grid spacing={3} container>
                        <Grid item xs={12} lg={4} sm={6} xl={4}>
                            <div className="input-with-label form-group">
                                <label>
                                    {intl.formatMessage({
                                        id: "Institution.label",
                                        defaultMessage: "Institution",
                                    })}
                                </label>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectInstitutionVal}
                                        onChange={handleInstitutionChange}
                                        displayEmpty
                                        inputProps={{ "aria-label": "Without label" }}
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
                            </div>
                        </Grid>
                    </Grid>

                    <TableContainer sx={{ mt: 4 }}>
                        <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="simple table" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'profileDescription'}
                                            direction={orderBy === 'profileDescription' ? order : 'asc'}
                                            onClick={() => createSortHandler("profileDescription")}
                                        >
                                            {
                                                intl.formatMessage({
                                                    id: "IssuerProfile.profileDescription",
                                                    defaultMessage: "Profile Description"
                                                })
                                            }
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'issuerAcqProfile'}
                                            direction={orderBy === 'issuerAcqProfile' ? order : 'asc'}
                                            onClick={() => createSortHandler("issuerAcqProfile")}
                                        >
                                            {
                                                intl.formatMessage({
                                                    id: "IssuerProfile.issuerAcqProfile",
                                                    defaultMessage: "Issuer Profile"
                                                })
                                            }
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" width="190px" className="last-column-border-header">
                                        {intl.formatMessage({
                                            id: "IssuerProfile.actions",
                                            defaultMessage: "Actions",
                                        })}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {issuers.sort(getComparator(order, orderBy)).map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{row.profileDescription}</TableCell>
                                        <TableCell>{row.issuerAcqProfile}</TableCell>
                                        <TableCell align="center" width="190px" className="last-column-border">
                                            <div className="action btns-block">
                                                <IconButton
                                                    className="border-icon-btn no-border sm"
                                                    onClick={() => editIssuerProfile(row.profileId, row.issuerAcqProfile)}
                                                    disabled={!canUpdate}
                                                >
                                                    <img src={edit_ic} alt="mail" />
                                                </IconButton>
                                                <IconButton
                                                    className="border-icon-btn no-border sm"
                                                    onClick={() => onDelete(row.profileId)}
                                                    disabled={!canDelete}
                                                >
                                                    <img src={delete_ic} alt="mail" />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {issuers &&
                                    issuers.length === 0 && (
                                        <TableRow>
                                           <TableCell colSpan={13} className="last-column-border">
                                                <p style={{ textAlign: "center" }}>
                                                    {intl.formatMessage({
                                                        id: "IssuerRelation.noDataFound",
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
    );
}

export default IssuerProfile;