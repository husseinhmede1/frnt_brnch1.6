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
import { InstitutionAccountsService } from "../../services/configuration/institution-accounts-service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Institution } from "../../models/configuration/InstitutionModel";
import { InstitutionAccountsModel } from "../../models/configuration/InstitutionAccountsModel";
import Swal from "sweetalert2";
import { Errors, StatusCode } from "../../utils/constant";
import { toast } from "react-toastify";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { visuallyHidden } from "@mui/utils";

function InstitutionAccounts() {
    const intl = useIntl();
    const [institution, setInstitution] = useState<Institution[]>([]);
    const [selectInstitutionVal, setSelectInstitutionVal] = useState("");
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [institutionAccounts, setInstitutionAccounts] = useState<InstitutionAccountsModel[]>([]);
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof InstitutionAccountsModel>('accountType');

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
        property: keyof InstitutionAccountsModel
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
        getInstitutionAccountsByInstitutionId(instID);
    };

    const editInstitutionAccounts = async (id: number, issuerAcqProfile: String, cardSchemeId: String, currencyCode: String, bankCode: String) => {
        navigate(`/institution-accs-details/${id}/${issuerAcqProfile}/${cardSchemeId}/${currencyCode}/${bankCode}`);
    };

    const getInstitutionAccountsByInstitutionId = async (id: string | "") => {
        await InstitutionAccountsService.getInstitutionAccountsByInstitution(id)
            .then((res) => {
                setInstitutionAccounts([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
        const selectedInstitutionId =
            event.target.value !== ""
                ? event.target.value
                : institution[0].institutionId;
        getInstitutionAccountsByInstitutionId(selectedInstitutionId);
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
                InstitutionAccountsService.deleteInstitutionAccounts(id).then((res) => {
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
                    getInstitutionAccountsByInstitutionId(selectInstitutionVal);
                }).catch(err => {
                    // if (err && err.response && err.response.data === Errors.ReferenceExists) {
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
        InstitutionService.getActiveInstitution()
            .then((response: { data: any }) => {
                setInstitutions(response.data);
            })
            .catch((error: any) => {
                console.log(error);
            });
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
                                    id: "InstitutionAccounts.title",
                                    defaultMessage: "Institution Accounts",
                                })}
                            </Typography>
                            <p className="pb-0">
                                {intl.formatMessage({
                                    id: "InstitutionAccounts.SubTitle",
                                    defaultMessage: "List of defined Accounts",
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
                                onClick={() => navigate(`/institution-accs-details/${selectInstitutionVal}`)}
                            >
                                <FormattedMessage
                                    id="InstitutionAccounts.addBtn"
                                    defaultMessage="Add Account"
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
                                            active={orderBy === 'accountType'}
                                            direction={orderBy === 'accountType' ? order : 'asc'}
                                            onClick={() => createSortHandler("accountType")}
                                        >
                                            {
                                                intl.formatMessage({
                                                    id: "InstitutionAccounts.accountType",
                                                    defaultMessage: "Account Type"
                                                })
                                            }
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={orderBy === 'accountDescription'}
                                            direction={orderBy === 'accountDescription' ? order : 'asc'}
                                            onClick={() => createSortHandler("accountDescription")}
                                        >
                                            {
                                                intl.formatMessage({
                                                    id: "InstitutionAccounts.accountDescription",
                                                    defaultMessage: "Account Description"
                                                })
                                            }
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "InstitutionAccounts.issuerProfile",
                                            defaultMessage: "Issuer Profile",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "InstitutionAccounts.cardScheme",
                                            defaultMessage: "Card Scheme",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "InstitutionAccounts.currency",
                                            defaultMessage: "Currency",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "InstitutionAccounts.bankCode",
                                            defaultMessage: "Bank Code",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "InstitutionAccounts.accountNumber",
                                            defaultMessage: "Account Number",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "InstitutionAccounts.accountOrigin",
                                            defaultMessage: "Account Origin",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "InstitutionAccounts.chargingInstitution",
                                            defaultMessage: "Charging Institution",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "InstitutionAccounts.branch",
                                            defaultMessage: "Branch",
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        {intl.formatMessage({
                                            id: "InstitutionAccounts.beneficiaryName",
                                            defaultMessage: "Beneficiary Name",
                                        })}
                                    </TableCell>
                                    <TableCell align="center" width="190px" className="last-column-border-header">
                                        {intl.formatMessage({
                                            id: "InstitutionAccounts.actions",
                                            defaultMessage: "Actions",
                                        })}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {institutionAccounts.sort(getComparator(order, orderBy)).map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{row.accountType}</TableCell>
                                        <TableCell>{row.accountDescription}</TableCell>
                                        <TableCell>{row.issuerAcqProfile}</TableCell>
                                        <TableCell>{row.cardSchemeId}</TableCell>
                                        <TableCell>{row.currencyName}</TableCell>
                                        <TableCell>{row.bankCode}</TableCell>
                                        <TableCell>{row.accountNumber}</TableCell>
                                        <TableCell>{row.accountOrigin}</TableCell>
                                        <TableCell>{row.chargingInstitutionName}</TableCell>
                                        <TableCell>{row?.branch}</TableCell>
                                        <TableCell>{row?.beneficiaryName}</TableCell>
                                        <TableCell align="center" width="190px" className="last-column-border">
                                            <div className="action btns-block">
                                                <IconButton
                                                    className="border-icon-btn no-border sm"
                                                    onClick={() => editInstitutionAccounts(row.institutionAcctsId, row.issuerAcqProfile, row.cardSchemeId, row.currencyCode, row.bankCode)}
                                                >
                                                    <img src={edit_ic} alt="mail" />
                                                </IconButton>
                                                <IconButton
                                                    className="border-icon-btn no-border sm"
                                                    onClick={() => onDelete(row.institutionAcctsId)}
                                                >
                                                    <img src={delete_ic} alt="mail" />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {institutionAccounts &&
                                    institutionAccounts.length === 0 && (
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

export default InstitutionAccounts;