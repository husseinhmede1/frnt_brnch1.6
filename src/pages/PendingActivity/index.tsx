import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, CellStyle } from "ag-grid-community";
import "ag-grid-community/dist/styles/ag-grid.css";
import { Box, TablePagination } from "@mui/material";
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

// ── Brand token ────────────────────────────────────────────────────────────────
const CORAL = "#D85A30";
const CORAL_LIGHT = "#FAECE7";
const CORAL_BORDER = "#F0997B";

// ── Inline styles ──────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    fontFamily: "'Segoe UI', 'DM Sans', sans-serif",
    padding: 28,
  },
  pageHeader: { marginBottom: 20 },
  pageTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: "#1a1a1a",
    letterSpacing: "-0.3px",
    margin: 0,
  },
  pageSubtitle: { fontSize: 14, color: "#999", marginTop: 3 },
  card: {
    background: "#fff",
    border: "1px solid #ebebeb",
    borderRadius: 12,
    overflow: "hidden",
  },
  filterBar: {
    padding: "18px 24px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "flex-end",
    gap: 16,
    flexWrap: "wrap" as const,
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
    flex: 1,
    minWidth: 160,
  },
  filterGroupNarrow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
    minWidth: 160,
    maxWidth: 200,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#aaa",
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
  },
  filterSelect: {
    height: 38,
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    background: "#fafafa",
    color: "#1a1a1a",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: 14,
    padding: "0 10px",
    cursor: "pointer",
    outline: "none",
    width: "100%",
  },
  filterActions: {
    display: "flex",
    gap: 8,
    alignItems: "flex-end",
    paddingBottom: 1,
  },
  btnSearch: {
    height: 38,
    padding: "0 20px",
    borderRadius: 8,
    border: "none",
    background: CORAL,
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  btnSearchDisabled: {
    height: 38,
    padding: "0 20px",
    borderRadius: 8,
    border: "none",
    background: "#ddd",
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    cursor: "not-allowed",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  btnClear: {
    height: 38,
    padding: "0 16px",
    borderRadius: 8,
    border: `1px solid ${CORAL_BORDER}`,
    background: CORAL_LIGHT,
    color: CORAL,
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
};

// ── Status badge ───────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string; border: string }> = {
  PENDING:    { bg: "#EEF4FF", color: "#2D5DB2", dot: "#2D5DB2", border: "#B5CEFF" },
  PROCESSING: { bg: "#FFF7E6", color: "#9A5F00", dot: "#F59E0B", border: "#FCD88A" },
  APPROVED:   { bg: "#EDFAF3", color: "#1A7D4B", dot: "#22C55E", border: "#86EFAC" },
  DECLINED:   { bg: "#FEF2F2", color: "#B91C1C", dot: "#EF4444", border: "#FCA5A5" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
        letterSpacing: "0.1px",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/[.\s_-]/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: CORAL_LIGHT,
        color: CORAL,
        fontSize: 10,
        fontWeight: 700,
        marginRight: 8,
        verticalAlign: "middle",
        flexShrink: 0,
        border: `1px solid ${CORAL_BORDER}`,
      }}
    >
      {initials}
    </span>
  );
}

// ── Action buttons ─────────────────────────────────────────────────────────────
function ActionButtons({
  row,
  canUpdate,
  onApprove,
  onReject,
}: {
  row: PendingActivityModel;
  canUpdate: boolean;
  onApprove: (row: PendingActivityModel) => void;
  onReject: (row: PendingActivityModel) => void;
}) {
  const isPending = row.status === "PENDING";
  const disabled = !canUpdate || !isPending;

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <button
        style={{
          height: 30,
          padding: "0 14px",
          borderRadius: 6,
          fontFamily: "'Segoe UI', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          border: "1px solid #86EFAC",
          background: disabled ? "#f5f5f5" : "#EDFAF3",
          color: disabled ? "#bbb" : "#1A7D4B",
          opacity: disabled ? 0.6 : 1,
          transition: "opacity 0.15s",
        }}
        disabled={disabled}
        onClick={() => onApprove(row)}
      >
        <FormattedMessage id="PendingActivity.approve" defaultMessage="Approve" />
      </button>
      <button
        style={{
          height: 30,
          padding: "0 14px",
          borderRadius: 6,
          fontFamily: "'Segoe UI', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          border: `1px solid ${CORAL_BORDER}`,
          background: disabled ? "#f5f5f5" : CORAL_LIGHT,
          color: disabled ? "#bbb" : CORAL,
          opacity: disabled ? 0.6 : 1,
          transition: "opacity 0.15s",
        }}
        disabled={disabled}
        onClick={() => onReject(row)}
      >
        <FormattedMessage id="PendingActivity.reject" defaultMessage="Reject" />
      </button>
    </div>
  );
}

// ── Date picker wrapper ────────────────────────────────────────────────────────
function StyledDatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error,
  errorMsg,
}: {
  label: string;
  value: Date | null;
  onChange: (v: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  error?: boolean;
  errorMsg?: string;
}) {
  return (
    <div style={styles.filterGroup}>
      <span style={styles.filterLabel}>{label}</span>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          inputFormat="dd/MM/yyyy"
          value={value}
          minDate={minDate}
          maxDate={maxDate ?? new Date()}
          onChange={onChange}
          renderInput={(params) => (
            <div ref={params.inputRef as any} style={{ position: "relative" }}>
              <input
                {...(params.inputProps as any)}
                readOnly
                style={{
                  ...styles.filterSelect,
                  borderColor: error ? CORAL : "#e5e5e5",
                  paddingRight: 36,
                }}
                placeholder="dd/mm/yyyy"
              />
              {error && errorMsg && (
                <span style={{ fontSize: 11, color: CORAL, marginTop: 3, display: "block" }}>
                  {errorMsg}
                </span>
              )}
            </div>
          )}
        />
      </LocalizationProvider>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
const STATUSES = ["PENDING", "PROCESSING", "APPROVED", "DECLINED"];

function PendingActivities() {
  const intl = useIntl();
  const gridRef = useRef<AgGridReact>(null);

  const [rowData, setRowData] = useState<PendingActivityModel[]>([]);
  const [totalNumRecords, setTotalNumRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const position = useSelector((state: RootState) => state.selectedCard.position);
  const { left, top } = position;

  const perms = useMemo(
    () => getActivityPermissions(ConfigurationActivities.APPRV_ENT),
    []
  );
  const canUpdate = perms.accessUpdate === "1";

  // ── fetch ────────────────────────────────────────────────────────────────────
  const fetchData = useCallback(
    async (
      currentPage: number,
      currentRows: number,
      currentStatus: string,
      currentFrom: Date | null,
      currentTo: Date | null
    ) => {
      const payload: any = { offset: currentPage, pageSize: currentRows };
      if (currentStatus) payload.status = currentStatus;
      if (currentFrom) payload.fromDate = moment(currentFrom).format("YYYY-MM-DD");
      if (currentTo) payload.toDate = moment(currentTo).format("YYYY-MM-DD");

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

  useEffect(() => {
    fetchData(page, rowsPerPage, status, fromDate, toDate);
  }, [page, rowsPerPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rowData.length === 0) gridRef.current?.api?.showNoRowsOverlay();
    else gridRef.current?.api?.hideOverlay();
  }, [rowData]);

  // ── handlers ─────────────────────────────────────────────────────────────────
  const handleSearch = useCallback(() => {
    if (fromDate && !toDate) { toast.error("To Date is required"); return; }
    if (!fromDate && toDate) { toast.error("From Date is required"); return; }
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
        confirmButtonColor: CORAL,
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
        confirmButtonColor: CORAL,
        confirmButtonText: intl.formatMessage({ id: "PendingActivity.reject", defaultMessage: "Reject" }),
        inputValidator: (value) =>
          !value ? intl.formatMessage({ id: "PendingActivity.noteRequired", defaultMessage: "Note is required" }) : null,
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

  // ── columns ───────────────────────────────────────────────────────────────────
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "pendingActivityId",
        headerName: intl.formatMessage({ id: "PendingActivity.id", defaultMessage: "ID" }),
        maxWidth: 80,
        sortable: true,
        hideSortIcons: true,
        cellStyle: { fontFamily: "monospace", fontSize: 12, color: "#aaa" } as CellStyle,
        cellRenderer: (params: any) => `#${params.value}`,
      },
      {
        field: "apiDesc",
        headerName: intl.formatMessage({ id: "PendingActivity.api", defaultMessage: "API Description" }),
        flex: 2,
        sortable: true,
        hideSortIcons: true,
        comparator: CustomeComparator,
        cellStyle: { fontWeight: 500, fontSize: 13, color: "#1a1a1a" } as CellStyle,
      },
      {
        field: "status",
        headerName: intl.formatMessage({ id: "PendingActivity.status", defaultMessage: "Status" }),
        flex: 1,
        sortable: true,
        hideSortIcons: true,
        cellRenderer: (params: any) => <StatusBadge status={params.value ?? ""} />,
      },
      {
        field: "createdByUsername",
        headerName: intl.formatMessage({ id: "PendingActivity.createdBy", defaultMessage: "Created By" }),
        flex: 1,
        sortable: true,
        hideSortIcons: true,
        comparator: CustomeComparator,
        cellRenderer: (params: any) => (
          <span style={{ display: "flex", alignItems: "center" }}>
            <Avatar name={params.value ?? "U"} />
            <span style={{ fontSize: 13 }}>{params.value}</span>
          </span>
        ),
      },
      {
        field: "createdDate",
        headerName: intl.formatMessage({ id: "PendingActivity.createdDate", defaultMessage: "Created Date" }),
        flex: 1,
        sortable: true,
        hideSortIcons: true,
        cellStyle: { fontFamily: "monospace", fontSize: 12, color: "#999" } as CellStyle,
      },
      {
        field: "notes",
        headerName: intl.formatMessage({ id: "PendingActivity.notes", defaultMessage: "Notes" }),
        flex: 2,
        sortable: false,
        cellStyle: { fontSize: 13, color: "#666" } as CellStyle,
        cellRenderer: (params: any) =>
          params.value ? (
            <span>{params.value}</span>
          ) : (
            <span style={{ opacity: 0.3 }}>—</span>
          ),
      },
      {
        headerName: intl.formatMessage({ id: "PendingActivity.actions", defaultMessage: "Actions" }),
        minWidth: 190,
        maxWidth: 220,
        sortable: false,
        cellRenderer: (params: any) => (
          <ActionButtons
            row={params.data}
            canUpdate={canUpdate}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ),
      },
    ],
    [intl, canUpdate, handleApprove, handleReject]
  );

  const defaultColDef = useMemo(
    () => ({ resizable: true, suppressMovable: true }),
    []
  );

  const isSearchDisabled = (!fromDate && !!toDate) || (!!fromDate && !toDate);

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.wrapper}>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>
          <FormattedMessage id="PendingActivity.title" defaultMessage="Pending Activities" />
        </h2>
        <p style={styles.pageSubtitle}>
          <FormattedMessage
            id="PendingActivity.subtitle"
            defaultMessage="Review and manage activities awaiting approval"
          />
        </p>
      </div>

      {/* Card */}
      <div style={styles.card}>
        {/* Filter bar */}
        <div style={styles.filterBar}>
          {/* Status */}
          <div style={styles.filterGroupNarrow}>
            <span style={styles.filterLabel}>
              <FormattedMessage id="PendingActivity.status" defaultMessage="Status" />
            </span>
            <select
              style={styles.filterSelect}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              onFocus={getValues}
            >
              <option value="">
                {intl.formatMessage({ id: "PendingActivity.allStatuses", defaultMessage: "All Statuses" })}
              </option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* From date */}
          <StyledDatePicker
            label={intl.formatMessage({ id: "StockReport.fromdate", defaultMessage: "From Date" })}
            value={fromDate}
            onChange={setFromDate}
            maxDate={toDate ?? new Date()}
            error={!fromDate && !!toDate}
            errorMsg="From Date is required"
          />

          {/* To date */}
          <StyledDatePicker
            label={intl.formatMessage({ id: "StockReport.todate", defaultMessage: "To Date" })}
            value={toDate}
            onChange={setToDate}
            minDate={fromDate ?? undefined}
            error={!!fromDate && !toDate}
            errorMsg="To Date is required"
          />

          {/* Buttons */}
          <div style={styles.filterActions}>
            <button
              style={isSearchDisabled ? styles.btnSearchDisabled : styles.btnSearch}
              disabled={isSearchDisabled}
              onClick={handleSearch}
            >
              <FormattedMessage id="Dashboard_2.search" defaultMessage="Search" />
            </button>
            <button style={styles.btnClear} onClick={handleClear}>
              <FormattedMessage id="Dashboard_2.clear" defaultMessage="Clear" />
            </button>
          </div>
        </div>

        {/* AG Grid */}
        <Box sx={{
          width: "100%",
          "& .ag-header": {
            background: "#fafafa",
            borderBottom: "1px solid #f0f0f0",
          },
          "& .ag-header-cell-text": {
            fontSize: "11px !important",
            fontWeight: "600 !important",
            color: "#aaa !important",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
          },
          "& .ag-row": {
            borderBottom: "1px solid #f7f7f7",
          },
          "& .ag-row:hover": {
            background: `${CORAL_LIGHT} !important`,
          },
          "& .ag-row-selected": {
            background: `${CORAL_LIGHT} !important`,
          },
        }}>
          <div className="ag-theme-alpine" style={{ height: 520, width: "100%" }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              headerHeight={44}
              rowHeight={52}
              suppressDragLeaveHidesColumns
              overlayNoRowsTemplate={`<span style="color:#ccc;font-size:14px">${intl.formatMessage({
                id: "NewCardIssueance_1.norowstoshow",
                defaultMessage: "No rows to show",
              })}</span>`}
              enableRtl={intl.locale === "ar"}
            />
          </div>
        </Box>

        {/* Pagination */}
        <TablePagination
          style={{
            borderTop: "1px solid #f0f0f0",
            fontSize: 13,
            color: "#888",
          }}
          sx={{
            "& .MuiTablePagination-select": { color: "#1a1a1a" },
            "& .MuiIconButton-root": { color: CORAL },
            "& .MuiIconButton-root.Mui-disabled": { color: "#ddd" },
          }}
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage={intl.formatMessage({ id: "Pagination.rowsperpage", defaultMessage: "Rows per page" })}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} ${intl.formatMessage({ id: "Pagination.of", defaultMessage: "of" })} ${count}`
          }
          component="div"
          count={totalNumRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            onFocus: getValues,
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}

export default PendingActivities;