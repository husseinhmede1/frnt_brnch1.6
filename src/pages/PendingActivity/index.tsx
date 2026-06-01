import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import {
  Box,
  Button,
  CardHeader,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TablePagination,
  TextField,
  FormHelperText,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import moment from "moment";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import { RootState } from "../../feature/store";
import { CustomeComparator, getValues } from "../../utils/commonfunction";
import { ConfigurationActivities, rowsPerPageOptions } from "../../utils/constant";
import { getActivityPermissions } from "../../utils/permissionUtils";
import { PendingActivityService } from "../../services/pending/pending-activity-service";
import { PendingActivityModel } from "../../models/pending/PendingActivityModel";
import {
  cancelIcon,
  down_arrow_icon,
  ios_arrow_backward,
  search_ic,
} from "../../assets/images";

const STATUSES = ["PENDING", "PROCESSING", "APPROVED", "DECLINED"];

function ArrowDown() {
  return <img src={down_arrow_icon} alt="arrow" className="select-icon" />;
}
function ArrowDropDown() {
  return <img src={ios_arrow_backward} alt="arrow" className="select-icon" />;
}

function PendingActivities() {
  const intl = useIntl();
  const gridRef = useRef<AgGridReact>(null);

  const [rowData, setRowData] = useState<PendingActivityModel[]>([]);
  const [totalNumRecords, setTotalNumRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Search filters
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const position = useSelector((state: RootState) => state.selectedCard.position);
  const { left, top } = position;

  // Permissions from modules localStorage (same pattern as XCS)
  const perms = useMemo(
    () => getActivityPermissions(ConfigurationActivities.APPRV_ENT),
    []
  );
  const canUpdate  = perms.accessUpdate  === "1";
  const canAdd     = perms.accessAdd     === "1";
  const canDelete  = perms.accessDelete  === "1";

  // ── data fetching ──────────────────────────────────────────────
  const fetchData = useCallback(
    async (currentPage: number, currentRows: number, currentStatus: string, currentFrom: Date | null, currentTo: Date | null) => {
      const payload: any = { offset: currentPage, pageSize: currentRows };
      if (currentStatus) payload.status = currentStatus;
      if (currentFrom) payload.fromDate = moment(currentFrom).format("YYYY-MM-DD");
      if (currentTo)   payload.toDate   = moment(currentTo).format("YYYY-MM-DD");

      try {
        const res = await PendingActivityService.search(payload);
        setRowData(res.data?.pendingActivities ?? []);
        setTotalNumRecords(res.data?.paginationResponseDto?.totalNumberOfRecords ?? 0);
      } catch (err: any) {
        err?.response?.data?.errors?.forEach((e: string) => toast.error(e));
        setRowData([]);
        setTotalNumRecords(0);
      }
    },
    []
  );

  // Initial load and re-load on pagination change
  useEffect(() => {
    fetchData(page, rowsPerPage, status, fromDate, toDate);
  }, [page, rowsPerPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rowData.length === 0) gridRef.current?.api?.showNoRowsOverlay();
    else gridRef.current?.api?.hideOverlay();
  }, [rowData]);

  // ── handlers ──────────────────────────────────────────────────
  const handleSearch = useCallback(() => {
    if (fromDate && !toDate)  { toast.error("To Date is required");   return; }
    if (!fromDate && toDate)  { toast.error("From Date is required"); return; }
    setPage(0);
    fetchData(0, rowsPerPage, status, fromDate, toDate);
  }, [fromDate, toDate, fetchData, rowsPerPage, status]);

  const handleClear = useCallback(() => {
    setStatus("");
    setFromDate(null);
    setToDate(null);
    setPage(0);
    fetchData(0, rowsPerPage, "", null, null);
  }, [fetchData, rowsPerPage]);

  const handleChangePage = useCallback((_: unknown, newPage: number) => setPage(newPage), []);
  const handleChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  }, []);

  const handleApprove = useCallback(
    (row: PendingActivityModel) => {
      Swal.fire({
        title: intl.formatMessage({ id: "PendingActivity.approveConfirm", defaultMessage: "Approve?" }),
        text: `${intl.formatMessage({ id: "PendingActivity.approveMsg", defaultMessage: "Approve" })} "${row.apiDesc}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: intl.formatMessage({ id: "PendingActivity.approve", defaultMessage: "Approve" }),
      }).then(async (result) => {
        if (!result.isConfirmed) return;
        try {
          await PendingActivityService.approve(row.pendingActivityId);
          toast.success(intl.formatMessage({ id: "PendingActivity.approveSuccess", defaultMessage: "Activity approved successfully" }));
          fetchData(page, rowsPerPage, status, fromDate, toDate);
        } catch (err: any) {
          err?.response?.data?.errors?.forEach((e: string) => toast.error(e));
        }
      });
    },
    [fetchData, page, rowsPerPage, status, fromDate, toDate, intl]
  );

  const handleReject = useCallback(
    (row: PendingActivityModel) => {
      Swal.fire({
        title: intl.formatMessage({ id: "PendingActivity.rejectConfirm", defaultMessage: "Reject" }),
        text: `${intl.formatMessage({ id: "PendingActivity.rejectMsg", defaultMessage: "Reject" })} "${row.apiDesc}"?`,
        icon: "warning",
        input: "textarea",
        inputLabel: intl.formatMessage({ id: "PendingActivity.rejectNote", defaultMessage: "Rejection note" }),
        inputPlaceholder: intl.formatMessage({ id: "PendingActivity.rejectNotePlaceholder", defaultMessage: "Enter reason..." }),
        inputAttributes: { "aria-label": "Rejection note" },
        showCancelButton: true,
        confirmButtonText: intl.formatMessage({ id: "PendingActivity.reject", defaultMessage: "Reject" }),
        inputValidator: (value) => (!value ? intl.formatMessage({ id: "PendingActivity.noteRequired", defaultMessage: "Note is required" }) : null),
      }).then(async (result) => {
        if (!result.isConfirmed) return;
        try {
          await PendingActivityService.reject(row.pendingActivityId, result.value);
          toast.success(intl.formatMessage({ id: "PendingActivity.rejectSuccess", defaultMessage: "Activity rejected" }));
          fetchData(page, rowsPerPage, status, fromDate, toDate);
        } catch (err: any) {
          err?.response?.data?.errors?.forEach((e: string) => toast.error(e));
        }
      });
    },
    [fetchData, page, rowsPerPage, status, fromDate, toDate, intl]
  );

  // ── grid columns ───────────────────────────────────────────────
  const columnDefs = useMemo(
    () => [
      {
        field: "pendingActivityId",
        headerName: intl.formatMessage({ id: "PendingActivity.id", defaultMessage: "ID" }),
        maxWidth: 90,
        sortable: true,
        hideSortIcons: true,
      },
      {
        field: "apiDesc",
        headerName: intl.formatMessage({ id: "PendingActivity.api", defaultMessage: "API Description" }),
        flex: 2,
        sortable: true,
        hideSortIcons: true,
        comparator: CustomeComparator,
      },
      {
        field: "status",
        headerName: intl.formatMessage({ id: "PendingActivity.status", defaultMessage: "Status" }),
        flex: 1,
        sortable: true,
        hideSortIcons: true,
        cellRenderer: (params: any) => {
          const s: string = params.value ?? "";
          const color =
            s === "APPROVED"   ? "#2e7d32" :
            s === "DECLINED"   ? "#c62828" :
            s === "PROCESSING" ? "#e65100" : "#1565c0";
          return <span style={{ color, fontWeight: 600 }}>{s}</span>;
        },
      },
      {
        field: "createdByUsername",
        headerName: intl.formatMessage({ id: "PendingActivity.createdBy", defaultMessage: "Created By" }),
        flex: 1,
        sortable: true,
        hideSortIcons: true,
        comparator: CustomeComparator,
      },
      {
        field: "createdDate",
        headerName: intl.formatMessage({ id: "PendingActivity.createdDate", defaultMessage: "Created Date" }),
        flex: 1,
        sortable: true,
        hideSortIcons: true,
      },
      {
        field: "notes",
        headerName: intl.formatMessage({ id: "PendingActivity.notes", defaultMessage: "Notes" }),
        flex: 2,
        sortable: false,
      },
      {
        headerName: intl.formatMessage({ id: "PendingActivity.actions", defaultMessage: "Actions" }),
        minWidth: 200,
        maxWidth: 240,
        sortable: false,
        headerClass: "action-header",
        cellRenderer: (params: any) => {
          const row: PendingActivityModel = params.data;
          const isPending = row.status === "PENDING";
          return (
            <ul className="action-btn-listing">
              <li>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  disabled={!canUpdate || !isPending}
                  onClick={() => handleApprove(row)}
                  style={{ marginRight: 4 }}
                >
                  <FormattedMessage id="PendingActivity.approve" defaultMessage="Approve" />
                </Button>
              </li>
              <li>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  disabled={!canUpdate || !isPending}
                  onClick={() => handleReject(row)}
                >
                  <FormattedMessage id="PendingActivity.reject" defaultMessage="Reject" />
                </Button>
              </li>
            </ul>
          );
        },
      },
    ],
    [intl, canUpdate, handleApprove, handleReject]
  );

  const defaultColDef = useMemo(() => ({ resizable: true }), []);

  // ── render ─────────────────────────────────────────────────────
  return (
    <div className="wrapper">
      <main className="main-content">
        <div className="main-card">
          <CardHeader
            className="card-title"
            title={intl.formatMessage({ id: "PendingActivity.title", defaultMessage: "Pending Activities" })}
            subheader={intl.formatMessage({ id: "PendingActivity.subtitle", defaultMessage: "Manage your pending activities" })}
            titleTypographyProps={{ variant: "h2", component: "h2" }}
          />

          {/* ── Search section ── */}
          <div className="form-content">
            <Grid container spacing={3} alignItems="center">

              <Grid item lg={4} md={6} xs={12} container alignItems="center">
                <Grid item xs={4}>
                  <span className="label">
                    <FormattedMessage id="PendingActivity.status" defaultMessage="Status" />
                  </span>
                </Grid>
                <Grid item xs={8} style={{ height: 40 }}>
                  <Select
                    fullWidth
                    value={status}
                    onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}
                    onFocus={getValues}
                    displayEmpty
                    renderValue={(val) =>
                      val ? val : (
                        <em>
                          <FormattedMessage id="PendingActivity.allStatuses" defaultMessage="All Statuses" />
                        </em>
                      )
                    }
                    IconComponent={ArrowDown}
                    MenuProps={{
                      className: "select-item",
                      anchorOrigin: { vertical: "bottom", horizontal: "right" },
                      transformOrigin: { vertical: "top", horizontal: "right" },
                      PaperProps: {
                        sx: {
                          "@media (-webkit-device-pixel-ratio: 1.25)": {
                            left: `${left}px !important`,
                            top: `${top + 30}px !important`,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>
                        <FormattedMessage id="PendingActivity.allStatuses" defaultMessage="All Statuses" />
                      </em>
                    </MenuItem>
                    {STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>

              <Grid item lg={4} md={6} xs={12} container alignItems="center">
                <Grid item xs={4}>
                  <label>
                    <FormattedMessage id="StockReport.fromdate" defaultMessage="From Date" />
                  </label>
                </Grid>
                <Grid item xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      inputFormat="dd/MM/yyyy"
                      value={fromDate}
                      maxDate={toDate ?? new Date()}
                      onChange={(v) => setFromDate(v)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          className="datepicker filter-date"
                          fullWidth
                          inputProps={{ ...params.inputProps, readOnly: true }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  {!fromDate && toDate && (
                    <FormHelperText error>From Date is required</FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid item lg={4} md={6} xs={12} container alignItems="center">
                <Grid item xs={4}>
                  <label>
                    <FormattedMessage id="StockReport.todate" defaultMessage="To Date" />
                  </label>
                </Grid>
                <Grid item xs={8}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      inputFormat="dd/MM/yyyy"
                      value={toDate}
                      minDate={fromDate ?? undefined}
                      maxDate={new Date()}
                      onChange={(v) => setToDate(v)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          className="datepicker filter-date"
                          fullWidth
                          inputProps={{ ...params.inputProps, readOnly: true }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  {fromDate && !toDate && (
                    <FormHelperText error>To Date is required</FormHelperText>
                  )}
                </Grid>
              </Grid>

            </Grid>

            <div className="search-btn-grp" style={{ marginTop: "2%" }}>
              <div className="btn-outlined">
                <Button
                  className="search-btn"
                  variant="outlined"
                  onClick={handleSearch}
                  disabled={(!fromDate && !!toDate) || (!!fromDate && !toDate)}
                >
                  <FormattedMessage id="Dashboard_2.search" defaultMessage="Search" />
                  <img src={search_ic} alt="search" />
                </Button>
                <Button
                  variant="outlined"
                  className="btn-clear"
                  onClick={handleClear}
                  style={{ margin: "0 20px" }}
                >
                  <FormattedMessage id="Dashboard_2.clear" defaultMessage="Clear" />
                  <img src={cancelIcon} alt="clear" />
                </Button>
              </div>
            </div>
          </div>

          {/* ── Grid ── */}
          <Box sx={{ width: "100%", minHeight: 520, mt: 2 }}>
            <div className="ag-theme-alpine" style={{ height: 520, width: "100%" }}>
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                headerHeight={51}
                rowHeight={52}
                suppressDragLeaveHidesColumns
                overlayNoRowsTemplate={intl.formatMessage({
                  id: "NewCardIssueance_1.norowstoshow",
                  defaultMessage: "No Rows To Show",
                })}
                enableRtl={intl.locale === "ar"}
              />
            </div>
          </Box>

          <TablePagination
            className="pagination"
            rowsPerPageOptions={rowsPerPageOptions}
            labelRowsPerPage={intl.formatMessage({ id: "Pagination.rowsperpage", defaultMessage: "Rows per page" })}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} ${intl.formatMessage({ id: "Pagination.of", defaultMessage: "Of" })} ${count}`
            }
            component="div"
            count={totalNumRecords}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              onFocus: getValues,
              IconComponent: ArrowDropDown,
              MenuProps: {
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
                transformOrigin: { vertical: "top", horizontal: "right" },
                PaperProps: {
                  sx: {
                    "@media (-webkit-device-pixel-ratio: 1.25)": {
                      left: `${left}px !important`,
                      top: `${top - 60}px !important`,
                    },
                  },
                },
              },
            }}
            backIconButtonProps={{ classes: { root: "prev-arrow" } }}
            nextIconButtonProps={{ classes: { root: "next-arrow" } }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </main>
    </div>
  );
}

export default PendingActivities;
