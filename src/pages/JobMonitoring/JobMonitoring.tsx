import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  InputBase,
  InputAdornment,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  search_ic,
  playIcon,
  cancelIcon,
  ic_reload,
} from "../../assets/images";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FormattedMessage, useIntl } from "react-intl";
import { JobService } from "../../services/job-list-service";
import { JobMonitoringModel } from "../../models/jobs/JobModel";
import { StatusCode, jobMonitoringStatus } from "../../utils/constant";
import moment from "moment";
import {
  CustomeComparator,
  closeSweetAlertOnBrowserBack,
} from "../../utils/commonfunction";

function DesignerJobMonitoring() {
  const intl = useIntl();

  const [searchText, setSearchText] = useState("");
  const [jobMonitor, setJobMonitor] = useState<JobMonitoringModel[]>([]);
  const [filteredRow, setFilteredRow] = useState<JobMonitoringModel[]>([]);

  // ================= SAME LOGIC =================
  function isCleanBtnDisabled(params: any, jobMonitoringStatus: any) {
    return (
      params.data?.status !== jobMonitoringStatus.InProgress &&
      (params.data?.lastRunEnd || params.data?.lastRunEnd === "") &&
      (params.data?.lastRunStatus || params.data?.lastRunStatus === "")
    );
  }

  // ================= FETCH =================
  useEffect(() => {
    getAllJobMonitor();
    closeSweetAlertOnBrowserBack(Swal, false);

    const interval = setInterval(() => {
      getAllJobMonitor();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getAllJobMonitor = async () => {
    await JobService.getJobMonitoring()
      .then((res) => {
        if (res?.data?.length > 0 && res.status === StatusCode.Success) {
          const sorted = res.data.sort((a, b) =>
            CustomeComparator(a.jobName, b.jobName)
          );
          setJobMonitor(sorted);
          setFilteredRow(sorted);
        } else {
          setJobMonitor([]);
          setFilteredRow([]);
        }
      })
      .catch((err) => {
        err?.response?.data?.errors?.map((e: string) => toast.error(e));
      });
  };

  // ================= SEARCH =================
  const onSearch = () => {
    setFilteredRow(
      jobMonitor
        .filter((data) =>
          !searchText
            ? true
            : data.jobName?.toLowerCase().includes(searchText.toLowerCase()) ||
              data.status?.toLowerCase().includes(searchText.toLowerCase()) ||
              data.startTime?.toString().includes(searchText) ||
              data.lastRunStart?.toString().includes(searchText) ||
              data.lastRunEnd?.toString().includes(searchText) ||
              data.lastRunStatus
                ?.toLowerCase()
                .includes(searchText.toLowerCase())
        )
        .sort((a, b) => CustomeComparator(a.jobName, b.jobName))
    );
  };

  useEffect(() => {
    if (searchText === "") onSearch();
  }, [searchText, jobMonitor]);

  // ================= ACTION =================
  const startStopJob = (id: number, jobStart: string, isCleaning: boolean) => {
    // 🔥 EXACT SAME FUNCTION (UNCHANGED)
    if (isCleaning) {
      if (jobStart !== jobMonitoringStatus.InProgress) {
        JobService.stopJobExecution(id)
          .then((res) => {
            if (res.status === StatusCode.Success) {
              getAllJobMonitor();
              Swal.fire("Cleaned!", "Job has been cleaned", "success");
            }
          })
          .catch((err: any) => {
            err?.response?.data?.errors?.map((e: string) => toast.error(e));
          });
      }
    } else {
      Swal.fire({
        title: "Are you sure?",
        text:
          jobStart === jobMonitoringStatus.InProgress
            ? "You want to stop this job"
            : "You want to start this job",
        icon: "warning",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const action =
            jobStart === jobMonitoringStatus.InProgress
              ? JobService.stopJobExecution(id)
              : JobService.startJobExecution(id);

          action
            .then((res) => {
              if (res.status === StatusCode.Success) {
                getAllJobMonitor();
                Swal.fire(
                  jobStart === jobMonitoringStatus.InProgress
                    ? "Stopped!"
                    : "Started!",
                  "",
                  "success"
                );
              }
            })
            .catch((err: any) => {
              err?.response?.data?.errors?.map((e: string) =>
                toast.error(e)
              );
            });
        }
      });
    }
  };

  // ================= UI =================
  return (
    <div className="wrapper">
      <main className="main-content">
        <div className="main-card">

          {/* HEADER */}
          <div className="title-block">
            <div className="left-block mb-0">
              <Typography variant="h2">Job Monitoring</Typography>
              <p>Monitor your jobs here</p>
            </div>

            <div className="right-block">
              <InputBase
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={onSearch}>
                      <img src={search_ic} alt="search" />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
          </div>

          {/* TABLE */}
          <TableContainer className="has-vertical-scroll">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Name</TableCell>
                  <TableCell>Job Status</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Last Run Start</TableCell>
                  <TableCell>Last Run End</TableCell>
                  <TableCell>Last Run Result</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRow.map((row) => (
                  <TableRow key={row.jobId}>
                    
                    <TableCell>{row.jobName}</TableCell>

                    <TableCell>{row.status}</TableCell>

                    <TableCell>
                      {row.startTime &&
                        moment(row.startTime).format(
                          "MM/DD/YYYY hh:mm:ss A"
                        )}
                    </TableCell>

                    <TableCell>
                      {row.lastRunStart &&
                        moment(row.lastRunStart).format(
                          "MM/DD/YYYY hh:mm:ss A"
                        )}
                    </TableCell>

                    <TableCell>
                      {row.lastRunEnd &&
                        moment(row.lastRunEnd).format(
                          "MM/DD/YYYY hh:mm:ss A"
                        )}
                    </TableCell>

                    <TableCell
                      className={
                        row.lastRunStatus === "Success"
                          ? "success"
                          : row.lastRunStatus === "Failure"
                          ? "failure"
                          : ""
                      }
                    >
                      {row.lastRunStatus}
                    </TableCell>

                    <TableCell align="center">
                      <div className="action btns-block">

                        <Link
                          to={`/job-execution-log/${row.jobId}`}
                          className="view-link"
                        >
                          View log
                        </Link>

                        <IconButton
                          onClick={() =>
                            startStopJob(row.jobId, row.status, false)
                          }
                        >
                          <img
                            src={
                              row.status === jobMonitoringStatus.InProgress
                                ? cancelIcon
                                : playIcon
                            }
                          />
                        </IconButton>

                        <IconButton
                          sx={{
                            cursor: isCleanBtnDisabled(
                              { data: row },
                              jobMonitoringStatus
                            )
                              ? "not-allowed"
                              : "pointer",
                            opacity: isCleanBtnDisabled(
                              { data: row },
                              jobMonitoringStatus
                            )
                              ? 0.5
                              : 1,
                          }}
                          onClick={() => {
                            if (
                              isCleanBtnDisabled(
                                { data: row },
                                jobMonitoringStatus
                              )
                            )
                              return;

                            Swal.fire({
                              title: "Are you sure you want to refresh job?",
                              icon: "warning",
                              showCancelButton: true,
                            }).then((result) => {
                              if (result.isConfirmed) {
                                startStopJob(row.jobId, row.status, true);
                              }
                            });
                          }}
                        >
                          <img src={ic_reload} />
                        </IconButton>

                      </div>
                    </TableCell>

                  </TableRow>
                ))}

                {filteredRow.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <p style={{ textAlign: "center" }}>
                        No Data Found
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

export default DesignerJobMonitoring;