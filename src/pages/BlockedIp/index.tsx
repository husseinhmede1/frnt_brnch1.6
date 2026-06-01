import {
    Box,
    FormControl,
    IconButton,
    InputAdornment,
    InputBase,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import { delete_ic, search_ic } from '../../assets/images';
import { BlockedIpService } from '../../services/security/blocked-ip-service';
import { BlockedIpResponse } from '../../models/security/BlockedIpModel';
import { rowsPerPageOptionsConst, StatusCode ,ROLE_ACTIVITY} from '../../utils/constant';
import { visuallyHidden } from "@mui/utils";
import { AssignRoles, selectedInst } from '../../services/request';
import { RoleMainModel} from '../../models/security/RoleModel';

type Order = 'asc' | 'desc';

const BlockedIps = () => {

    const intl = useIntl();

    const [ipList, setIpList] = useState<BlockedIpResponse[]>([]);
    const [filteredIpList, setFilteredIpList] = useState<BlockedIpResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [accessDelete, setAccessDelete] = useState(false);


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptionsConst[0]);

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof BlockedIpResponse>('ipAddress');
    const [roleActivity, setRoleActivity] = React.useState<RoleMainModel>();
 
    useEffect(() => {
        const assignRole = AssignRoles.find((role: RoleMainModel) => role.instId === selectedInst);
            if (assignRole !== undefined) {
                setRoleActivity(assignRole);
            }
    }, [selectedInst]);

    useEffect(() => {
        getBlockedIps();
        // setAccessDelete(!(roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.BlockedIP) && roleActivity?.roleActivities.find(act => act.activity?.activityDesc === ROLE_ACTIVITY.BlockedIP)?.accessDelete === "1"))
    }, [roleActivity]);
    
    useEffect(() => {
        onSearch();
    }, [searchTerm, ipList]);

    const getBlockedIps = async () => {
        try {
            const res = await BlockedIpService.getAllBlockedIps();
            setIpList(res.data);
        } catch (err: any) {
            toast.error(err?.response?.data?.errors?.[0] || "Failed to load blocked IPs");
        }
    };

    const onSearch = () => {
        const filtered = ipList.filter((ip) =>
            ip.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredIpList(filtered);
        setPage(0);
    };

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }

        if (b[orderBy] > a[orderBy]) {
            return 1;
        }

        return 0;
    };

    const getComparator = <Key extends keyof any>(
        order: Order,
        orderBy: Key,
    ): (
        a: { [key in Key]: any },
        b: { [key in Key]: any },
    ) => number => {

        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const createSortHandler = (property: keyof BlockedIpResponse) => {
        const isAsc = orderBy === property && order === 'asc';

        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const onDelete = (id: number) => {

        Swal.fire({
            title: intl.formatMessage({
                id: "DeleteAlert.title",
                defaultMessage: "Are you sure?"
            }),
            text: intl.formatMessage({
                id: "DeleteAlert.text",
                defaultMessage: "You won't be able to revert this!"
            }),
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: intl.formatMessage({
                id: "DeleteAlert.cancelButtonText",
                defaultMessage: "Cancel"
            }),
            confirmButtonText: intl.formatMessage({
                id: "DeleteAlert.confirmButtonText",
                defaultMessage: "Yes, unblock it!"
            }),

        }).then(async (result: any) => {

            if (result.isConfirmed) {

                try {

                    const res = await BlockedIpService.unblockIp(id.toString());

                    if (res.status === StatusCode.Success) {

                        Swal.fire({
                            title: intl.formatMessage({
                                id: "DeleteAlert.DeleteSuccess.title",
                                defaultMessage: "Success!"
                            }),
                            text: intl.formatMessage({
                                id: "DeleteAlert.DeleteSuccess.text",
                                defaultMessage: "IP has been unblocked successfully."
                            }),
                            icon: "success",
                            confirmButtonText: intl.formatMessage({
                                id: "DeleteAlert.okButtonText",
                                defaultMessage: "OK"
                            }),
                        });

                        getBlockedIps();
                    }

                } catch (err: any) {

                    Swal.fire({
                        title: intl.formatMessage({
                            id: "DeleteAlert.DeleteError.title",
                            defaultMessage: "Error"
                        }),
                        text: err?.response?.data?.errors?.[0] || "Failed to unblock IP",
                        icon: "error",
                        confirmButtonText: intl.formatMessage({
                            id: "DeleteAlert.okButtonText",
                            defaultMessage: "OK"
                        }),
                    });
                }
            }
        });
    };

    return (
        <div className="wrapper">

            <main className="main-content">

                <div className="main-card">

                    <div className="title-block">

                        <div className="left-block">

                            <Typography variant={"h2"} className="pb-0">
                                Blocked IPs
                            </Typography>

                            <p className="pb-0">
                                Manage blocked IP addresses
                            </p>

                        </div>

                        <div className="right-block">

                            <FormControl>

                                <InputBase
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                    fullWidth
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton>
                                                <img src={search_ic} alt="search" />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />

                            </FormControl>

                        </div>

                    </div>

                    <TableContainer>

                        <Table sx={{ minWidth: 650 }}>

                            <TableHead>

                                <TableRow>

                                    <TableCell>

                                        <TableSortLabel
                                            active={orderBy === 'ipAddress'}
                                            direction={orderBy === 'ipAddress' ? order : 'asc'}
                                            onClick={() => createSortHandler("ipAddress")}
                                        >

                                            IP Address

                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc'
                                                    ? 'sorted descending'
                                                    : 'sorted ascending'}
                                            </Box>

                                        </TableSortLabel>

                                    

                                    </TableCell>
                                    <TableCell>
                                             <TableSortLabel
                                            active={orderBy === 'blockedAt'}
                                            direction={orderBy === 'blockedAt' ? order : 'asc'}
                                            onClick={() => createSortHandler("blockedAt")}
                                        >
                                            Blocked At
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc'
                                                    ? 'sorted descending'
                                                    : 'sorted ascending'}
                                            </Box>

                                        </TableSortLabel>

                                    </TableCell>

                                    <TableCell align="center" width="120px" className="last-column-border-header">
                                        Actions
                                    </TableCell>

                                </TableRow>

                            </TableHead>

                            <TableBody>

                                {
                                    filteredIpList
                                        .sort(getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (

                                            <TableRow key={index}>

                                                <TableCell>
                                                    {row.ipAddress}
                                                </TableCell>
                                                <TableCell>
                                                    {row.blockedAt}
                                                </TableCell>
                                                <TableCell align="center" className="last-column-border">
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                >

                                                    <IconButton
                                                        className={`border-icon-btn no-border sm ${!accessDelete?'':'darker'}`}
                                                        onClick={() => onDelete(row.id)}
                                                        disabled = {accessDelete}
                                                    >
                                                        <img src={delete_ic} alt="delete" />
                                                        {accessDelete}
                                                    </IconButton>

                                                </div>
                                            </TableCell>
                                            </TableRow>
                                        ))
                                }

                                {
                                    filteredIpList.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3}    className="last-column-border">
                                                <p style={{ textAlign: "center" }}>
                                                    No Data Found
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }

                            </TableBody>

                        </Table>

                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={rowsPerPageOptionsConst}
                        component="div"
                        count={filteredIpList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        className='pagination'
                    />

                </div>

            </main>

        </div>
    );
};

export default BlockedIps;