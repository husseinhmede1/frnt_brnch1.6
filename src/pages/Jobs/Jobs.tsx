import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  InputBase,
  InputAdornment,
  Button,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  edit_ic,
  resetIcon,
  delete_ic,
  search_ic,
  add_rounded,
} from "../../assets/images";
import Swal from "sweetalert2";
import { JobService } from "../../services/job-list-service";
import { JobModel } from "../../models/jobs/JobModel";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { StatusCode } from "../../utils/constant";
import { CustomeComparator } from "../../utils/commonfunction";

function DesignerJobListing() {
  const intl = useIntl();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobModel[]>([]);
  const [filteredRow, setFilteredRow] = useState<JobModel[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [accessAdd] = useState<string>("1");
  const [accessUpdate] = useState<string>("1");
  const [accessDelete] = useState<string>("1");

  // ================= FETCH DATA =================
  useEffect(() => {
    getAllJob();
  }, []);

  const getAllJob = async () => {
    await JobService.getAllJobs()
      .then((res: any) => {
        if (res.data?.length > 0) {
          const sorted = res.data.sort((a: any, b: any) =>
            CustomeComparator(a.jobName, b.jobName)
          );
          setJob(sorted);
          setFilteredRow(sorted);
        } else {
          setJob([]);
          setFilteredRow([]);
        }
      })
      .catch((err) => {
        err?.response?.data?.errors?.map((e: string) => toast.error(e));
      });
  };

  // ================= SEARCH =================
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const onSearch = () => {
    const filtered = job.filter(
      (j) =>
        !searchText ||
        j.jobName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredRow(filtered);
  };

  useEffect(() => {
    if (searchText === "") onSearch();
  }, [searchText, job]);

  const editJob = (id: any) => {
    navigate(`/job-definition/${id}`);
  };

  const rescheduleJob = (data: JobModel) => {
    console.log("Reschedule:", data);
  };

  const ChangeStatus = async (
    id: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const model = {
      id,
      status: event.target.checked ? "1" : "0",
    };

    await JobService.enableDisableJob(model)
      .then((res) => {
        if (res.status === StatusCode.Success) {
          toast.success(res?.data?.message || "Status updated");
          getAllJob();
        }
      })
      .catch((err) => {
        err?.response?.data?.errors?.map((e: string) => toast.error(e));
      });
  };

  const onDelete = (id: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        JobService.deleteJob(id)
          .then((res) => {
            if (res.status === StatusCode.Success) {
              toast.success("Deleted successfully");
              getAllJob();
            }
          })
          .catch((err) => {
            err?.response?.data?.errors?.map((e: string) =>
              toast.error(e)
            );
          });
      }
    });
  };

  // ================= UI =================
  return (
    <div className="wrapper">
      <main className="main-content">
        <div className="main-card">

          {/* HEADER */}
          <div className="title-block">
            <div className="left-block mb-0">
              <Typography variant="h2">
                {intl.formatMessage({
                  id: "Sidebar.jobs",
                  defaultMessage: "Jobs",
                })}
              </Typography>
              <p>
                {intl.formatMessage({
                  id: "JobListing_1.manageyourjobshere",
                  defaultMessage: "Manage your jobs here",
                })}
              </p>
            </div>

            <div className="right-block">
              <InputBase
                placeholder="Search"
                value={searchText}
                onChange={handleChangeSearch}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={onSearch}>
                      <img src={search_ic} alt="search" />
                    </IconButton>
                  </InputAdornment>
                }
              />

              <Button
                variant="contained"
                className="btn-light"
                endIcon={<img src={add_rounded} alt="add" />}
                onClick={() => navigate("/job-definition")}
                disabled={accessAdd !== "1"}
              >
                <FormattedMessage
                  id="JobListing_1.addjob"
                  defaultMessage="Add Job"
                />
              </Button>
            </div>
          </div>

          {/* TABLE */}
          <TableContainer className="has-vertical-scroll">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {intl.formatMessage({
                      id: "JobListing_1.jobname",
                      defaultMessage: "Job Name",
                    })}
                  </TableCell>
                  <TableCell>
                    {intl.formatMessage({
                      id: "JobDefinition_2.descriptions",
                      defaultMessage: "Descriptions",
                    })}
                  </TableCell>
                  <TableCell align="center">
                    {intl.formatMessage({
                      id: "JobListing_1.actions",
                      defaultMessage: "Actions",
                    })}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRow.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.jobName}</TableCell>
                    <TableCell>{row.jobDescription}</TableCell>

                    <TableCell align="center">
                      <div className="action btns-block">

                        <IconButton
                          onClick={() => editJob(row.jobId)}
                          disabled={accessUpdate !== "1"}
                        >
                          <img src={edit_ic} alt="edit" />
                        </IconButton>

                        <IconButton
                          onClick={() => rescheduleJob(row)}
                          disabled={!(row.status === "1" && accessUpdate === "1")}
                        >
                          <img src={resetIcon} alt="reset" />
                        </IconButton>

                        <IconButton
                          onClick={() => onDelete(row.jobId)}
                          disabled={accessDelete !== "1"}
                        >
                          <img src={delete_ic} alt="delete" />
                        </IconButton>

                        <Switch
                          checked={row.status === "1"}
                          onChange={(e) => ChangeStatus(row.jobId, e)}
                          disabled={accessUpdate !== "1"}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredRow.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
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

export default DesignerJobListing;