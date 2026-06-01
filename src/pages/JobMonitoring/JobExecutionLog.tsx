import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  InputBase,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Tooltip,
  TablePagination,
} from "@mui/material";
import { search_ic, down_arrow_icon } from "../../assets/images";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { JobExecutionLog } from "../../models/jobs/JobExecutionLog";
import { JobExecutionLogService } from "../../services/job-list-service";
import { toast } from "react-toastify";
import { StatusCode, rowsPerPageOptionsConst } from "../../utils/constant";
import moment from "moment";

function ArrowDropDown() {
  return <img src={down_arrow_icon} alt="arrow" className="select-icon" />;
}

function DesignerJobExecutionLog() {
  const intl = useIntl();
  const { id } = useParams<{ id?: string }>();

  const [jobLog, setJobLog] = useState<JobExecutionLog[]>([]);
  const [totalNumRecords, setTotalNumRecords] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof JobExecutionLog | null;
    direction: "asc" | "desc";
  }>({ key: "execId", direction: "desc" });

  useEffect(() => {
    if (id) {
      getJobLogs();
    }
  }, [id, page, rowsPerPage]);

  const getJobLogs = (): void => {
    let model = {
      fromDate: "",
      jobId: Number(id),
      paginationRequestDto: {
        offset: page,
        pageSize: rowsPerPage,
      },
      toDate: "",
    };
    JobExecutionLogService.getAllLogsByJobId(model)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          setJobLog(res.data?.jobExecutionLogResponseDto || []);
          
          // UPDATED PATH: Changed paginationResponseDto to paginationCommonResponseDto
          const totalRecords = res?.data?.paginationCommonResponseDto?.totalNumberOfRecords || 0;
          setTotalNumRecords(totalRecords);
        }
      })
      .catch((err) => {
        err?.response?.data?.errors?.map((e: string) => toast.error(e));
      });
  };

  const handleSort = (key: keyof JobExecutionLog) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      "0": "Started", "1": "In Process", "2": "Stopped", "3": "Completed", "4": "Error",
    };
    return statuses[status] || status;
  };

  const filteredData = jobLog.filter(
    (data) =>
      !searchText ||
      data.jobName?.toLowerCase().includes(searchText.toLowerCase()) ||
      data.execId?.toString().includes(searchText)
  );

  return (
    <div className="wrapper">
      <main className="main-content">
        <div className="main-card">
          <div className="title-block">
            <div className="left-block mb-0">
              <Typography variant="h2">
                {intl.formatMessage({ id: "JobExecutionLog_3_1.jobexecutionlog", defaultMessage: "Job Execution Log" })}
              </Typography>
              <p className="pb-0">
                {intl.formatMessage({ id: "JobExecutionLog_3_1.viewjoblogshere", defaultMessage: "View Job logs here" })}
              </p>
            </div>
            <div className="right-block">
              <InputBase
                className="search-input"
                placeholder={intl.formatMessage({ id: "JobListing_1.search", defaultMessage: "Search" })}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton><img src={search_ic} alt="search" /></IconButton>
                  </InputAdornment>
                }
              />
            </div>
          </div>

          <TableContainer className="has-vertical-scroll">
            <Table sx={{ minWidth: 650 }} aria-label="job logs table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortConfig.key === "execId"}
                      direction={sortConfig.key === "execId" ? sortConfig.direction : "asc"}
                      onClick={() => handleSort("execId")}
                    >
                      {intl.formatMessage({ id: "JobExecutionLog_3_1.executionid", defaultMessage: "Execution ID" })}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>{intl.formatMessage({ id: "JobExecutionLog_3_1.jobname", defaultMessage: "Job Name" })}</TableCell>
                  <TableCell>{intl.formatMessage({ id: "JobMonitoring_3.jobstatus", defaultMessage: "Status" })}</TableCell>
                  <TableCell>{intl.formatMessage({ id: "Dashboard_3.startdate", defaultMessage: "Start Date" })}</TableCell>
                  <TableCell>{intl.formatMessage({ id: "Dashboard_3.enddate", defaultMessage: "End Date" })}</TableCell>
                  <TableCell>{intl.formatMessage({ id: "JobExecutionLog_3_1.result", defaultMessage: "Result" })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.execId}</TableCell>
                      <TableCell>{row.jobName}</TableCell>
                      <TableCell>
                        <span className={`status-tag ${row.status === "3" ? "success" : row.status === "4" ? "failure" : ""}`}>
                          {getStatusText(row.status || "")}
                        </span>
                      </TableCell>
                      <TableCell>{row.startDate ? moment(row.startDate).format("MM/DD/YYYY hh:mm:ss A") : "-"}</TableCell>
                      <TableCell>{row.endDate ? moment(row.endDate).format("MM/DD/YYYY hh:mm:ss A") : "-"}</TableCell>
                      <TableCell>
                        {row.executionDetails && row.executionDetails.length > 47 ? (
                          <>
                            {row.executionDetails.slice(0, 47)}
                            <Tooltip title={row.executionDetails}>
                              <Button size="small" sx={{ minWidth: "unset", ml: 1 }}>...</Button>
                            </Tooltip>
                          </>
                        ) : row.executionDetails}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {intl.formatMessage({ id: "City.noDataFound", defaultMessage: "No Data Found." })}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            className="pagination"
            component="div"
            count={totalNumRecords}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={rowsPerPageOptionsConst}
            labelRowsPerPage={intl.formatMessage({ id: "Pagination.rowsperpage", defaultMessage: "Rows per page" })}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} ${intl.formatMessage({ id: "Pagination.of", defaultMessage: "Of" })} ${count !== -1 ? count : `more than ${to}`}`
            }
            SelectProps={{
              IconComponent: ArrowDropDown,
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default DesignerJobExecutionLog;