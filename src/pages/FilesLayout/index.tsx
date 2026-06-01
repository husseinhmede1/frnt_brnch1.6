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
    Typography,
    Switch,
    Card,
    CardContent,
    CardHeader,
    InputBase,
    InputAdornment,
    TablePagination
} from "@mui/material";
import {
    edit_ic,
    delete_ic,
    userIcon,
    search_ic,
    add_rounded,
    down_arrow_icon,
} from "../../assets/images";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { InstitutionService } from "../../services/configuration/institution-service";
import { InstitutionAccountsService } from "../../services/configuration/institution-accounts-service";
import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";
import { Institution } from "../../models/configuration/InstitutionModel";
import Swal from "sweetalert2";
import { ConfigurationActivities, Errors, StatusCode } from "../../utils/constant";
import { getActivityPermissions } from "../../utils/permissionUtils";
import { toast } from "react-toastify";
import { getLocalStorage, LOCALSTORAGE_KEYS } from "../../utils/helper";
import { visuallyHidden } from "@mui/utils";
import { LayoutService } from "../../services/configuration/file-layout-service";
import { LayoutModel } from "../../models/configuration/fileLayoutModel";
import { CustomeComparator } from "../../utils/commonfunction";

const rowsPerPageOptions = [10, 20, 25, 50];

function FilesLayout() {
    const intl = useIntl();
    const navigate = useNavigate();
    const perms = useMemo(() => getActivityPermissions(ConfigurationActivities.FILES_SCREEN), []);
    const canAdd = perms.accessAdd === "1";
    const canUpdate = perms.accessUpdate === "1";
    const canDelete = perms.accessDelete === "1";
    const canView = perms.accessView === "1";

    const [rowData, setRowData] = useState<LayoutModel[]>([]);
    const [filteredRow, setFilteredRow] = useState<LayoutModel[]>([]);
    const [totalNumRecords, setTotalNumRecords] = useState<number>(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof LayoutModel>('layoutType');
    const [searchText, setSearchText] = useState<string>("");

    const handleChangeSearch = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setSearchText(event.target.value);
    };
    useEffect(() => {
        if (searchText === "") {
            onSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

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
        property: keyof LayoutModel
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const onSearch = (): void => {
        setFilteredRow(
            rowData.filter(
                (data: LayoutModel) =>
                    !searchText ||
                    data.fileResponseDto?.fileName.toLowerCase().includes(searchText.toLowerCase())
            )
        );
    };

    useEffect(() => {
        if (searchText !== "") {
            onSearch();
        }
    }, [rowData]);

    useEffect(() => {
        getFileLayouts();
    }, [page, rowsPerPage]);

    const getFileLayouts = () => {
        let model = {
            asc: true,
            offset: page,
            pageSize: rowsPerPage,
            sortBy: "layoutName",
        };
        LayoutService.getallLayouts(model)
            .then((res) => {
                if (
                    res.status === StatusCode.Success &&
                    res.data?.listLayoutResponseDto?.length > 0
                ) {
                    setRowData([...res.data?.listLayoutResponseDto]);
                    setFilteredRow([...res.data.listLayoutResponseDto]);
                    setTotalNumRecords(
                        res.data?.paginationResponseDto?.totalNumberOfRecords
                    );
                } else {
                    setRowData([]);
                    setFilteredRow([]);
                    setTotalNumRecords(0);
                }
            })
            .catch((err) =>
                err?.response?.data?.errors?.map((e: string) => toast.error(e))
            );
    };

    const ChangeStatus = async (id: number, event: any) => {
        const model = { id: id, status: event.target.checked === true ? "1" : "0" };
        await LayoutService.changeLayoutStatus(model)
            .then((res) => {
                if (res.status === StatusCode.Success) {
                    if (res.data?.message) {
                        toast.success(res.data?.message);
                    } else {
                        toast.success("Status changed successfully");
                    }
                    getFileLayouts();
                }
            })
            .catch((err) => {
                err?.response?.data?.errors?.map((e: string) => toast.error(e));
            });
    };

    const handleClickOpen = (isEdit: boolean) => {
        if (isEdit) {
            navigate(`/add-edit-filelayout/${0}`);
        } else {
            navigate(`/add-edit-filelayout`);
        }
    };
    const editFileLayout = (id: number) => {
        navigate(`/add-edit-filelayout/${id}`);
    };

    const deleteFileLayout = (id: number) => {
        Swal.fire({
            title: intl.formatMessage({
                id: "SwalPopup.areyousure?",
                defaultMessage: "Are you sure?",
            }),
            text: intl.formatMessage({
                id: "SwalPopup.youwon'tbeabletorevertthis!",
                defaultMessage: "You won't be able to revert this!",
            }),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: intl.formatMessage({
                id: "Dashboard_1_2.cancel",
                defaultMessage: "Cancel",
            }),
            confirmButtonText: intl.formatMessage({
                id: "SwalPopup.yes,deleteit!",
                defaultMessage: "Yes, delete it!",
            }),
        }).then((result) => {
            if (result.isConfirmed) {
                LayoutService.deleteLayout(id)
                    .then((res) => {
                        if (res.status === StatusCode.Success) {
                            getFileLayouts();
                            if (res.data?.message) {
                                toast.success(res.data?.message);
                            } else {
                                Swal.fire({
                                    title: intl.formatMessage({
                                        id: "SwalPopup.deleted!",
                                        defaultMessage: "Deleted!",
                                    }),
                                    text: intl.formatMessage({
                                        id: "SwalPopup.yourfilehasbeendeleted",
                                        defaultMessage: "Your file has been deleted",
                                    }),
                                    icon: "success",
                                    confirmButtonText: intl.formatMessage({
                                        id: "CloneAnExistingCardType_5_1.ok",
                                        defaultMessage: "OK",
                                    }),
                                });
                            }
                        }
                    })
                    .catch((err) =>
                        err?.response?.data?.errors?.map((e: string) => toast.error(e))
                    );
            }
        });
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <div className="wrapper">
                <main className="main-content">
                    <div className="main-card">
                        <div className="title-block">
                            <CardHeader
                                className="card-title"
                                title={intl.formatMessage({
                                    id: "FileLayout.fileslayout",
                                    defaultMessage: "Files Layout",
                                })}
                                subheader={intl.formatMessage({
                                    id: "FileLayout.manageallfilelayout",
                                    defaultMessage: "Manage all Files Layout",
                                })}
                                titleTypographyProps={{ variant: "h2", component: "h2" }}
                            // subheaderTypographyProps={{ variant: "p", component: "p" }}
                            />
                            <div className="right-block">
                                <InputBase
                                    placeholder={intl.formatMessage({
                                        id: "FileLayout.searchfilename",
                                        defaultMessage: "Search",
                                    })}
                                    fullWidth
                                    id="search"
                                    autoComplete="off"
                                    value={searchText}
                                    onChange={handleChangeSearch}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                disableFocusRipple
                                                disableTouchRipple
                                                onClick={onSearch}
                                            >
                                                <img src={search_ic} alt="search" />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                <Button
                                    sx={{ mt: 4 }}
                                    style={{marginLeft: "60%"}}
                                    variant="contained"
                                    disableElevation
                                    className="btn-light"
                                    endIcon={<img src={add_rounded} alt="add" />}
                                    onClick={() => handleClickOpen(false)}
                                >
                                    <FormattedMessage
                                        id="FileLayout.addfilelayout"
                                        defaultMessage="Add File Layout"
                                    />
                                </Button>
                            </div>
                        </div>
                        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="simple table" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'layoutType'}
                                                direction={orderBy === 'layoutType' ? order : 'asc'}
                                                onClick={() => createSortHandler("layoutType")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "InstitutionAccounts.layoutType",
                                                        defaultMessage: "Layout Type"
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'layoutFormatDesc'}
                                                direction={orderBy === 'layoutFormatDesc' ? order : 'asc'}
                                                onClick={() => createSortHandler("layoutFormatDesc")}
                                            >
                                                {
                                                    intl.formatMessage({
                                                        id: "InstitutionAccounts.layoutFormatDesc",
                                                        defaultMessage: "Layout Format Description"
                                                    })
                                                }
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            {intl.formatMessage({
                                                id: "fileLayouts.layoutdescription",
                                                defaultMessage: "Layout Description",
                                            })}
                                        </TableCell>
                                        <TableCell align="center" width="190px" className="last-column-border-header">
                                            {intl.formatMessage({
                                                id: "FilesLayout.actions",
                                                defaultMessage: "Actions",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRow?.sort((a, b) => CustomeComparator(a.layoutName, b.layoutName)).map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{row.layoutName}</TableCell>
                                            <TableCell>{row.fileResponseDto.fileName}</TableCell>
                                            <TableCell>{row.layoutFormat === "1" ? "XML" :
                                                row.layoutFormat === "2" ? "EXCEL" :
                                                    row.layoutFormat === "3" ? "TXT" :
                                                        row.layoutFormat === "4" ? "CSV" :
                                                            "DAT"}</TableCell>
                                            <TableCell align="center" width="190px" className="last-column-border">
                                                <div className="action btns-block">
                                                            <Switch
                                                                title="Change Status"
                                                                // disabled={accessUpdate === "1" ? false : true}
                                                                checked={row?.status === "1" ? true : false}
                                                                onChange={(e: any) => ChangeStatus(row.layoutId, e)}
                                                            />
                                                            <Button
                                                                className="action-btns"
                                                                disabled={row?.fileResponseDto.fileName === "GoFile"
                                                                    // || (accessUpdate === "1" ? false : true)
                                                                }
                                                                title={intl.formatMessage({
                                                                    id: "Title.edit",
                                                                    defaultMessage: "Edit",
                                                                })}
                                                                onClick={() => editFileLayout(row?.layoutId)}
                                                            >
                                                                <img src={edit_ic} alt="edit" />
                                                            </Button>
                                                            <Button
                                                                className="action-btns"
                                                                disabled={row?.fileResponseDto.fileName === "GoFile"
                                                                    // || (accessDelete === "1" ? false : true)
                                                                }
                                                                title={intl.formatMessage({
                                                                    id: "Title.delete",
                                                                    defaultMessage: "Delete",
                                                                })}
                                                                onClick={() => deleteFileLayout(row?.layoutId)}
                                                            >
                                                                <img src={delete_ic} alt="delete" />
                                                            </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredRow &&
                                        filteredRow.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={13} className="last-column-border">
                                                    <p style={{ textAlign: "center" }}>
                                                        {intl.formatMessage({
                                                            id: "FilesLayout.noDataFound",
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
                            rowsPerPageOptions={rowsPerPageOptions}
                            component="div"
                            count={totalNumRecords}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </main>
            </div>
        </>
    );
}

export default FilesLayout;