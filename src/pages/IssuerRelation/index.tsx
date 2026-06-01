import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputBase,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography,
    FormHelperText
} from "@mui/material";
import {
    add_rounded,
    delete_ic,
    down_arrow_icon,
    edit_ic
} from "../../assets/images";
import Button from "@mui/material/Button";
import { InstitutionService } from "../../services/configuration/institution-service";
import { IssuerRelationService } from "../../services/configuration/issuer-relation-service";
import { IssuerProfileService } from "../../services/configuration/issuer-profile-service";
import { CountryService } from "../../services/configuration/country-service";
import { CountryModel } from "../../models/configuration/CountryModel";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Institution } from "../../models/configuration/InstitutionModel";
import { IssRelation } from "../../models/configuration/IssuerRelationModel";
import { IssProfile } from "../../models/configuration/IssuerProfileModel";
import Swal from "sweetalert2";
import { Errors, StatusCode } from "../../utils/constant";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import validations from "../../utils/validations";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import {
    rowsPerPageOptionsConst,
} from "../../utils/constant";
import { visuallyHidden } from "@mui/utils";

function IssuerRelation() {
    const { id } = useParams<{ id?: any }>();
    const { institutionId } = useParams<{ institutionId?: any }>();
    const { issuerAcqProfile } = useParams<{ issuerAcqProfile?: any }>();
    const intl = useIntl();
    const navigate = useNavigate();
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [issuerRelations, setIssuerRelations] = useState<IssRelation[]>([]);
    const [countries, setCountries] = useState<CountryModel[]>([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isIssuerAcqProfileDisabled, setIsIssuerAcqProfileDisabled] = useState(false);
    const [isSearchDisabled, setIsSearchDisabled] = useState(false);
    const [addedIssuerAcqProfile, setAddedIssuerAcqProfile] = useState(issuerAcqProfile);
    const [selectInstitutionVal, setSelectInstitutionVal] = useState(institutionId ?? "");
    const [selectCountryVal, setSelectCountryVal] = useState("");
    const [open, setOpen] = useState(false);
    const [issuerRelationData, setIssuerRelationData] = useState<IssRelation>();
    const [isLikeSearch, setIsLikeSearch] = useState(false);

    const [page, setPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(
        rowsPerPageOptionsConst[0]
    );

    const [panRange, setPanRange] = useState("");

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        clearErrors: clearErrorsProfile,
        formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    } = useForm<IssProfile>({
        mode: "onChange",
        resolver: yupResolver(validations.createIssuerProfileValidations),
    });

    const {
        register: registerRelation,
        handleSubmit: handleSubmitRelation,
        reset: resetRelation,
        clearErrors: clearErrorsRelation,
        formState: { errors: relationErrors, isSubmitting: isSubmittingRelation },
    } = useForm<IssRelation>({
        mode: "onChange",
        resolver: yupResolver(validations.createIssuerRelationValidations),
    });

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof IssRelation>('panRangeFrom');

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
        property: keyof IssRelation
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    /* END (sort table data) */

    const handleClickOpen = (isEdit: boolean) => {
        if (!isEdit) {
            handleReset();
        }
        setOpen(true);
        clearErrorsRelation();
    };

    const handleReset = (): void => {
        resetRelation(new IssRelation());
    };

    const handleClose = () => {
        setOpen(false);
        getIssuerRelationByAcqProfile();
        setSelectCountryVal("");
    };

    const setInstitutefromIssuerRelation = async () => {
        const instID = issuerRelationData?.institutionId;
        if (instID) {
            setSelectInstitutionVal(instID);
        }
    };

    const getIssuerRelationById = async (id: number) => {
        IssuerRelationService.getIssuerRelationsById(id)
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                resetRelation(data);
                setIssuerRelationData(data);
                setInstitutefromIssuerRelation();
                setSelectCountryVal(data.cntryCode);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const editIssuerRelationInfo = async (id: number, issuerAcqProfile: string) => {
        handleClickOpen(true);
        getIssuerRelationById(id);
    };

    const setInstitutefromLocalStorage = async () => {
        const instID = getLocalStorage(LOCALSTORAGE_KEYS.DEFAULT_INSTITUTE) as string;
        if (instID) {
            setSelectInstitutionVal(instID);
        }
    };

    const getIssuerProfileById = async () => {
        IssuerProfileService.getIssuerProfilesById(id)
            .then((res) => {
                const data = JSON.parse(JSON.stringify(res.data));
                resetProfile(data);
                setSelectInstitutionVal(data.institutionId);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const getIssuerRelationByAcqProfile = async () => {
        IssuerRelationService.getIssuerRelationsByAcqProfile(issuerAcqProfile,selectInstitutionVal)
            .then((res) => {
                setIssuerRelations([...res.data]);
                setTotalRecords(res.data.length);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const getAllCountries = async () => {
        CountryService.getActiveCountries()
            .then((res) => {
                setCountries([...res.data]);
            })
            .catch((err) =>   toast.error(err.response.data.errors[0]));
    };

    const getIssuerRelationsByPanRange = async (range: String, likeSearch: boolean, offset: number, pageSize: number) => {
        const model = {
            issuerAcqProfile: issuerAcqProfile,
            likeSearch: likeSearch,
            institutionId:selectInstitutionVal,
            paginationRequestDto: {
                asc: "true",
                offset: offset,
                pageSize: pageSize,
                sortBy: "recordSeqId"
            },
            panRange: range ? range : "",
        }
        IssuerRelationService.getIssuerRelationsByPanRange(model)
            .then((res) => {
                if (res.status === StatusCode.Success) {
                    if (res.data && res.data.length > 0 && res.data[0]?.nbOfRecords > 0) {
                        setTotalRecords(res.data[0]?.nbOfRecords || 0);
                        setIssuerRelations(res.data);
                    } else {
                        setIssuerRelations([]);
                    }
                } else {
                    setIssuerRelations([]);
                }
            })
            .catch((err) => {
                  toast.error(err.response.data.errors[0]);
            });
    };

    const onClickSearchBtn = () => {
        setIsLikeSearch(false);
        getIssuerRelationsByPanRange(panRange, false, page, rowsPerPage);
    };

    const onClickSearchLikeBtn = () => {
        setIsLikeSearch(true);
        getIssuerRelationsByPanRange(panRange, true, page, rowsPerPage);
    };

    const handleInstitutionChange = (event: SelectChangeEvent) => {
        setSelectInstitutionVal(event.target.value);
    };

    const onSubmitIssRelation = async (value: IssRelation) => {
        const model = {
            recordSeqId: value.recordSeqId ? value.recordSeqId : 0,
            panRangeFrom: value.panRangeFrom,
            panRangeTo: value.panRangeTo,
            issuerAcqProfile: addedIssuerAcqProfile,
            institutionId: value.institutionId ? value.institutionId : selectInstitutionVal,
            cntryCode: value.cntryCode ? value.cntryCode : selectCountryVal
        };
        await IssuerRelationService.saveOrUpdateIssuerRelation(model)
            .then((res) => {

                const modelPan = {
                    panRangeFrom: res.data.panRangeFrom,
                    panRangeTo: res.data.panRangeTo,
                    institutionId: res.data.institutionId,
                    cntryCode: res.data.cntryCode
                };

                IssuerRelationService.getAllIssuerRelationsByPanRange(modelPan)
                    .then((res) => {
                        if (res.status === StatusCode.Success && res.data && res.data.length > 1) {
                            toast.success("Record with similar PAN ranges already exists");
                        }
                    })

                if (res.status === StatusCode.Success) {
                    handleClose();
                    setPanRange("");
                    if (model.recordSeqId != 0) {
                        toast.success("Record updated successfully");
                    } else {
                        toast.success("Record added successfully");
                    }
                }
            })
            .catch((err) => {
                // if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.IdAlreadyExists
                // ) {
                //     toast.error(Errors.IdAlreadyExists);
                // }
                // else if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.uniqueIssuerRelation
                // ) {
                //     toast.error(Errors.uniqueIssuerRelation)
                // }
                // else {
                //       toast.error(err.response.data.errors[0])
                // }
                toast.error(err.response.data.errors[0])

            });
    };

    const onSubmit = async (value: IssProfile) => {
        const model = {
            profileId: value.profileId ? value.profileId : 0,
            profileDescription: value.profileDescription,
            issuerAcqProfile: value.issuerAcqProfile,
            institutionId: value.institutionId ? value.institutionId : selectInstitutionVal
        };
        await IssuerProfileService.saveOrUpdateIssuerProfile(model)
            .then((res) => {
                if (res.status === StatusCode.Success) {
                    navigate(`/issuer-relation/${res.data.profileId}/${res.data.issuerAcqProfile}/${selectInstitutionVal}`);
                    if (id) {
                        toast.success("Record updated successfully");
                    } else {
                        toast.success("Record added successfully");
                        setIsDisabled(false);
                        setAddedIssuerAcqProfile(value.issuerAcqProfile);
                    }
                    checkDisabled();
                }
            })
            .catch((err) => {
                // if (err && err?.response?.status === 400) {
                //     if (err.response.data.errors[0] === 'ISU-001') {
                //         toast.error("Issuer Profile Code already exists");
                //     }
                // } else if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.IdAlreadyExists
                // ) {
                //     toast.error(Errors.IdAlreadyExists);
                // } else if (
                //     err &&
                //     err.response &&
                //     err.response.data === Errors.uniqueIssuerProfile
                // ) {
                //     toast.error(Errors.uniqueIssuerProfile)
                // } else {
                //       toast.error(err.response.data.errors[0])
                // }
                toast.error(err.response.data.errors[0])

            });
    };

    const checkDisabled = () => {
        if (id) {
            setIsDisabled(false);
            setIsIssuerAcqProfileDisabled(true);
            setIsSearchDisabled(false);
        }
        else {
            setIsDisabled(true);
            setIsIssuerAcqProfileDisabled(false);
            setIsSearchDisabled(true);
        }
    }

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
                IssuerRelationService.deleteIssuerRelation(id).then((res) => {
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
                    getIssuerRelationByAcqProfile();
                }).catch(err => {
                    if (err && err.response 
                    //    && err.response.data === Errors.ReferenceExists
                    ) {
                        console.log("errr>>>>",err);
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
                    }
                });
            }
        });
    };

    const clearSearch = () => {
        setPanRange("");
        getIssuerRelationsByPanRange("", isLikeSearch, page, rowsPerPage);
    }

    useEffect(() => {
        if (id) {
            getIssuerProfileById();
            getIssuerRelationsByPanRange(panRange, isLikeSearch, page, rowsPerPage);
            InstitutionService.getAllInstitution()
                .then((response: { data: any }) => {
                    setInstitutions(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });
            checkDisabled();
            setPanRange("");
        }
        else {
            InstitutionService.getAllInstitution()
                .then((response: { data: any }) => {
                    setInstitutions(response.data);
                })
                .catch((error: any) => {
                    console.log(error);
                });

            checkDisabled();
        }
        getAllCountries();
        setSelectInstitutionVal(institutionId);
    }, [id, resetProfile]);



    return (
        <div className="wrapper">
            <main className="main-content">
                <div className="main-card">
                    <div className="title-block">
                        <div className="left-block">
                            <Typography variant={"h2"}>
                                {intl.formatMessage({
                                    id: "IssuerProfile.title",
                                    defaultMessage: "Issuer Profile Id",
                                })}
                            </Typography>
                            <p className="pb-0">
                                {intl.formatMessage({
                                    id: "IssuerProfile.subTitle",
                                    defaultMessage: "Add/Update Issuer Profile",
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
                                disabled={isDisabled}
                                id="addBtn"
                                onClick={() => handleClickOpen(false)}
                            >
                                <FormattedMessage
                                    id="IssuerProfile.addBtn"
                                    defaultMessage="Add Range"
                                />
                            </Button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmitProfile(onSubmit)}>
                        <Grid spacing={3} container>
                            <Grid item xs={12} lg={4} sm={6} xl={4}>
                                <div className="form-group input-with-label">
                                    <label>
                                        {intl.formatMessage({
                                            id: "Institution.label",
                                            defaultMessage: "Institution",
                                        })}
                                    </label>
                                    <FormControl fullWidth style={{ marginLeft: "40px" }}>
                                        <Select
                                            disabled
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
                        <Grid spacing={3} container>
                            <Grid item xs={12} lg={4} sm={6} xl={4}>
                                <div className="form-group input-with-label">
                                    <label className="lg">
                                        Issuer Profile <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <FormControl fullWidth>
                                        <InputBase
                                            disabled={isIssuerAcqProfileDisabled}
                                            placeholder="Write issuer profile"
                                            error
                                            fullWidth
                                            id="profileId"
                                            autoComplete="off"
                                            inputProps={{
                                                maxLength: 4
                                            }}
                                            aria-describedby="error-helper-text"
                                            {...registerProfile("issuerAcqProfile")}
                                        />

                                        <FormHelperText id="error-helper-text" error>
                                            {profileErrors.issuerAcqProfile?.message}
                                        </FormHelperText>
                                    </FormControl>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid spacing={3} container>
                            <Grid item xs={12} lg={4} sm={6} xl={4}>
                                <div className="form-group input-with-label">
                                    <label className="lg">
                                        Profile Description <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <FormControl fullWidth>
                                        <InputBase
                                            placeholder="Write profile description"
                                            error
                                            fullWidth
                                            id="profileId"
                                            autoComplete="off"
                                            aria-describedby="error-helper-text"
                                            inputProps={{ maxLength: 50 }}
                                            {...registerProfile("profileDescription")}
                                        />

                                        <FormHelperText id="error-helper-text" error>
                                            {profileErrors.profileDescription?.message}
                                        </FormHelperText>
                                    </FormControl>
                                </div>
                            </Grid>
                        </Grid>
                        <div style={{ borderTop: '1px solid lightgray', marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="input-with-label" style={{ marginTop: '10px' }}>
                                    <FormControl fullWidth>
                                        <InputBase
                                            placeholder={intl.formatMessage({
                                                id: "IssuerRelation.enterPanRangePlaceholder",
                                                defaultMessage: "Search PAN",
                                            })}
                                            disabled={isSearchDisabled}
                                            error
                                            fullWidth
                                            id="panRange"
                                            autoComplete="off"
                                            aria-describedby="error-helper-text"
                                            inputProps={{ maxLength: 19 }}
                                            value={panRange}
                                            onChange={(event) => setPanRange(event.target.value)}
                                        />
                                    </FormControl>
                                </div>

                                <div className="btns-block" style={{ marginLeft: '10px', marginTop: '10px' }}>
                                    <Button disableElevation disabled={isSearchDisabled} variant="contained" type="button" onClick={() => onClickSearchBtn()}>
                                        {intl.formatMessage({
                                            id: "IssuerRelation.button.matchingRange",
                                            defaultMessage: "Find Matching Range",
                                        })}
                                    </Button>
                                    <Button disableElevation disabled={isSearchDisabled} variant="contained" type="button" onClick={() => onClickSearchLikeBtn()}>
                                        {intl.formatMessage({
                                            id: "IssuerRelation.button.likeSearch",
                                            defaultMessage: "Find Similar Entry",
                                        })}
                                    </Button>
                                    <Button
                                        disableElevation
                                        disabled={isSearchDisabled}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => clearSearch()}
                                    >
                                        <FormattedMessage
                                            id="IssuerProfile.clear"
                                            defaultMessage="Clear"
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="table-container" style={{ marginBottom: '24px' }}>
                            <TableContainer sx={{ mt: 4 }}>
                                <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="simple table" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'panRangeFrom'}
                                                    direction={orderBy === 'panRangeFrom' ? order : 'asc'}
                                                    onClick={() => createSortHandler("panRangeFrom")}
                                                >
                                                    {
                                                        intl.formatMessage({
                                                            id: "IssuerRelation.panRangeFrom",
                                                            defaultMessage: "Pan Range From"
                                                        })
                                                    }
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'panRangeTo'}
                                                    direction={orderBy === 'panRangeTo' ? order : 'asc'}
                                                    onClick={() => createSortHandler("panRangeTo")}
                                                >
                                                    {
                                                        intl.formatMessage({
                                                            id: "IssuerRelation.panRangeTo",
                                                            defaultMessage: "Pan Range To"
                                                        })
                                                    }
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({
                                                    id: "IssuerProfile.cntryCode",
                                                    defaultMessage: "Country",
                                                })}
                                            </TableCell>
                                            <TableCell align="center" width="190px" className="last-column-border-header">
                                                {intl.formatMessage({
                                                    id: "IssuerRelation.actions",
                                                    defaultMessage: "Actions",
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {issuerRelations.sort(getComparator(order, orderBy)).map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{row.panRangeFrom}</TableCell>
                                                <TableCell>{row.panRangeTo}</TableCell>
                                                <TableCell>{row.cntryName}</TableCell>
                                                <TableCell align="center" width="190px" className="last-column-border">
                                                    <div className="action btns-block">
                                                        <IconButton
                                                            className="border-icon-btn no-border sm"
                                                            onClick={() => editIssuerRelationInfo(row.recordSeqId, row.issuerAcqProfile)}
                                                        >
                                                            <img src={edit_ic} alt="mail" />
                                                        </IconButton>
                                                        <IconButton
                                                            className="border-icon-btn no-border sm"
                                                            onClick={() => onDelete(row.recordSeqId)}
                                                        >
                                                            <img src={delete_ic} alt="mail" />
                                                        </IconButton>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {issuerRelations &&
                                            issuerRelations.length === 0 && (
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
                            <TablePagination
                                rowsPerPageOptions={rowsPerPageOptionsConst}
                                component="div"
                                count={totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(event, newPage) => {
                                    setPage(newPage);
                                    getIssuerRelationsByPanRange(panRange, isLikeSearch, newPage, rowsPerPage);
                                }}
                                onRowsPerPageChange={(event) => {
                                    const newRowsPerPage = parseInt(event.target.value, 10);
                                    setRowsPerPage(newRowsPerPage);
                                    setPage(0);
                                    getIssuerRelationsByPanRange(panRange, isLikeSearch, 0, newRowsPerPage);
                                }}
                            />

                        </div>
                        <div className="btns-block right">
                            <Button
                                disableElevation
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate("/issuer-profile")}
                            >
                                <FormattedMessage
                                    id="IssuerProfile.cancel"
                                    defaultMessage="Cancel"
                                />
                            </Button>
                            <Button type="submit" variant="contained">
                                <FormattedMessage
                                    id="IssuerProfile.save"
                                    defaultMessage="Save"
                                />
                            </Button>
                        </div>
                    </form>
                </div>
            </main >

            <Dialog open={open} onClose={handleClose} className="c-dialog">
                <form onSubmit={handleSubmitRelation(onSubmitIssRelation)}>
                    <DialogTitle component={"div"}>
                        <div className="title-block mb-0">
                            <div className="left-block mb-0">
                                <Typography variant={"h2"}>
                                    {intl.formatMessage({
                                        id: "IssuerRelation.definitionTitle",
                                        defaultMessage: "Range Definition",
                                    })}
                                </Typography>
                                <p className="pb-0">
                                    {intl.formatMessage({
                                        id: "IssuerRelation.definitionSubTitle",
                                        defaultMessage: "Add/Update Pan Range",
                                    })}
                                </p>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="inner-card">
                            <Grid spacing={2} container>
                                <Grid item xs={12} lg={6} xl={4}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "Institution.label",
                                                defaultMessage: "Institution",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                disabled
                                                {...registerRelation("institutionId")}
                                                value={selectInstitutionVal}
                                                onChange={handleInstitutionChange}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Without label" }}
                                                IconComponent={() => (
                                                    <img src={down_arrow_icon} alt="" />
                                                )}
                                            >
                                                <MenuItem value="">
                                                    <em>
                                                        {intl.formatMessage({
                                                            id: "Institution.selecteddropdown",
                                                            defaultMessage: "Default Institution selected",
                                                        })}
                                                    </em>
                                                </MenuItem>
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
                                <Grid item xs={18} lg={6} xl={4}>
                                    <div className="form-group input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "Issuer.Profile",
                                                defaultMessage: "Issuer Profile",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <InputBase
                                                placeholder={intl.formatMessage({
                                                    id: "IssuerRelation.enterIssuerProfilePlaceholder",
                                                    defaultMessage: "Write your issuer profile id",
                                                })}
                                                value={issuerAcqProfile}
                                                disabled
                                                error
                                                fullWidth
                                                id="issuerProfile"
                                                autoComplete="off"
                                                aria-describedby="error-helper-text"
                                                {...registerRelation("issuerAcqProfile")}
                                            />
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "IssuerRelation.panRangeFrom",
                                                defaultMessage: "Pan Range From",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <InputBase
                                                placeholder={intl.formatMessage({
                                                    id: "IssuerRelation.enterPanRangeFromPlaceholder",
                                                    defaultMessage: "Write Pan Range From",
                                                })}
                                                error
                                                fullWidth
                                                id="panRangeFrom"
                                                autoComplete="off"
                                                aria-describedby="error-helper-text"
                                                inputProps={{ maxLength: 19 }}
                                                {...registerRelation("panRangeFrom")}
                                            />

                                            <FormHelperText id="error-helper-text" error>
                                                {relationErrors.panRangeFrom?.message}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <div className="input-with-label">
                                        <label className="lg">
                                            {intl.formatMessage({
                                                id: "IssuerRelation.panRangeTo",
                                                defaultMessage: "Pan Range To",
                                            })}
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <FormControl fullWidth>
                                            <InputBase
                                                placeholder={intl.formatMessage({
                                                    id: "IssuerRelation.enterPanRangeToPlaceholder",
                                                    defaultMessage: "Write Pan Range To",
                                                })}
                                                error
                                                fullWidth
                                                id="panRangeTo"
                                                autoComplete="off"
                                                aria-describedby="error-helper-text"
                                                inputProps={{ maxLength: 19 }}
                                                {...registerRelation("panRangeTo")}
                                            />
                                            <FormHelperText id="error-helper-text" error>
                                                {relationErrors.panRangeTo?.message}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} lg={5.56} xl={4}>
                                    <div className="input-with-label form-group">
                                        <label>
                                            {intl.formatMessage({
                                                id: "IssuerProfile.label",
                                                defaultMessage: "Country",
                                            })}
                                        </label>
                                        <FormControl fullWidth>
                                            <Select
                                                value={selectCountryVal}
                                                {...registerRelation("cntryCode")}
                                                inputProps={{ "aria-label": "Without label" }}
                                                IconComponent={() => <img src={down_arrow_icon} alt="" />}
                                                onChange={(event) => setSelectCountryVal(event.target.value)}
                                                fullWidth
                                                style={{ marginLeft: '40px' }}
                                            >
                                                {countries &&
                                                    countries.length > 0 &&
                                                    countries.map((type) => {
                                                        return (
                                                            <MenuItem
                                                                key={type.cntryId}
                                                                value={type.cntryCode}
                                                            >
                                                                {type.cntryName}
                                                            </MenuItem>
                                                        );
                                                    })}
                                            </Select>
                                            <FormHelperText id="error-helper-text" error>
                                                {relationErrors.cntryCode?.message}
                                            </FormHelperText>
                                        </FormControl>

                                    </div>
                                </Grid>
                            </Grid>
                        </div>

                    </DialogContent>
                    <DialogActions className="btns-block right">
                        <Button
                            disableElevation
                            variant="contained"
                            color="secondary"
                            onClick={handleClose}
                        >
                            <FormattedMessage
                                id="BankInfo.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>
                        <Button type="submit" disableElevation variant="contained" disabled={isSubmittingRelation}>
                            <FormattedMessage id="BankInfo.save" defaultMessage="Save" />
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

        </div >
    )
}
export default IssuerRelation;