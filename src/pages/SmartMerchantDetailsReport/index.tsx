import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Table,
  TableSortLabel,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  InputBase,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  add_rounded,
  check_rounded,
  delete_ic,
  down_arrow_icon,
  edit_ic,
  ic_check,
  ic_checked,
  ios_arrow_backward,
  ios_arrow_forward,
  uncheck_rounded,
} from "../../assets/images";
import {
  ActivityFeesPackage,
  ActivityFeesPackageSorted,
} from "../../models/configuration/ActivityFeesPackageModel";
import { RoleMainModel } from "../../models/security/RoleModel";
import { AssignRoles, selectedInst } from "../../services/request";
import { Errors, ROLE_ACTIVITY, StatusCode } from "../../utils/constant";
import { ReportsService } from "../../services/reports/report-service";

function NonActivityFeesPackagesListing() {
  const intl = useIntl();
  const navigate = useNavigate();
  const [data,setData] = useState({fromDate :'',toDate :''})
  const [lockButtons,setLockButtons] = useState(true)
  const [roleActivity, setRoleActivity] = useState<RoleMainModel>();
  const [backendHtmlString, setBackendHtmlString] = useState("");
  const [available, setAvailable] = useState<boolean>(false);
  const [groupWithTerminal,setGroupWithTerminal] = useState(false);
  const [groupWithMerchant,setGroupWithMerchant] = useState(false)


  useEffect(() => {
    const assignRole = AssignRoles.find(
      (role: RoleMainModel) => role.instId === selectedInst
    );
    if (assignRole !== undefined) {
      setRoleActivity(assignRole);
    }
  }, [selectedInst]);

  function setFromDate(fromDate: string){
      console.log(fromDate);
      setData(prevData => ({...prevData,fromDate}))
  }
  
  function setToDate(toDate: string){
      setData(prevData => ({...prevData,toDate}))
  }

  function validateInput() {
    if (!data.fromDate && !data.toDate) {
      return false;
    }
    return true;
  }
  function clearDates() {
    setData({ fromDate: '', toDate: '' });
  }

  useEffect(()=>{
    const isValid = validateInput();
    setLockButtons(!isValid);
  },[data])

  const buildReportRequestString = async (fromDate: string , toDate: string) => {
    var reportObject = '{"reportName":"smartMerchantDetailsReport.jrxml"';

    if (fromDate != null && fromDate != "" && fromDate != undefined) {
      reportObject += ', "fromDate":"' + fromDate + '"';
    } else {
      reportObject += ', "fromDate":""';
    }

    if (toDate != null && toDate != "" && toDate != undefined) {
      reportObject += ', "toDate":"' + toDate + '"';
    } else {
      reportObject += ', "toDate":""';
    }

    const loginUser = JSON.parse(localStorage.getItem("USER") as string);
    let inst = localStorage.getItem("instId");
    reportObject += ', "userId":"' + loginUser?.user?.userId+ '"';

    reportObject += ', "fromDate":"' + (data?.fromDate) + '"';
    reportObject += ', "toDate":"' + (data?.toDate) + '"';

    return reportObject;
  };

  const prepareReport = async () => {    
    let reportObject = (await buildReportRequestString(
      data?.fromDate,data?.toDate
    )) as string;
    if (reportObject != null && reportObject !== "null") {
      reportObject += ', "reportFormat":"html"}';
      ReportsService.getReports(decodeURI(reportObject as string))
        .then((response) => {
          if (response.status === StatusCode.Success) {
            const backendHtmlString = response.data
              .toString()
              .split("</head>")[1];
            setBackendHtmlString(backendHtmlString);
            setAvailable(true);
            let newTab = window.open("", "_blank");
            if (newTab && newTab.document) {
              newTab.document.write(`
            <html>
            <head>
                <title>Merchant Details Report</title>
                <style>
                    /* Add any CSS rules you need here */
                </style>
            </head>
            <body>
                <div style="margin-top: 50px; width: 100%;">
                    ${backendHtmlString}
                </div>
            </body>
            </html>
        `);
              newTab.document.close();
            } else {
              console.error("Could not open new tab");
            }
          }
        })
        .catch((error) => {
          error?.response?.data?.errors?.map((e: string) => toast.error(e));
          setAvailable(false);
         
        });
    }
    
    return { __html: backendHtmlString };
  };

  //EXPORT TO PDF SECTION

  const handleExportToPdf = async () => {
    await exportToPdf();
  };

    const exportToPdf = async () => {
    let reportObject = await buildReportRequestString(data?.fromDate,data?.toDate) as string;


    if (reportObject !== null) {
      reportObject += ', "reportFormat":"pdf"}';
      ReportsService.getPDFReports(decodeURI(reportObject as string))
        .then(async (response) => {
          if (response.status === StatusCode.Success) {
            const pdfData = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(pdfData);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Merchant Details Report.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          }
        })
        .catch((error) => {
          error?.response?.data?.errors?.map((e: string) => toast.error(e));
          setAvailable(false);
          setBackendHtmlString("");
        });
    }
  };

  //EPORT TO EXCEL SECTION
  
  const handleExportToExcel = async () => {
    await exportToExcel();
  };

  const exportToExcel = async () => {
    let reportObject = await buildReportRequestString(data?.fromDate , data?.toDate) as string;

    if (reportObject !== null) {
      reportObject += ', "reportFormat":"excel"}';
      ReportsService.getPDFReports(decodeURI(reportObject))
        .then(async (response) => {
          if (response.status === StatusCode.Success) {
            const excelData = new Blob([response.data], { type: 'application/xlsx' });
            const url = window.URL.createObjectURL(excelData);
            const a = document.createElement('a');
            a.href = url;
            a.download ='Merchant Details Report.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          }
        })
        .catch((error) => {
          error?.response?.data?.errors?.map((e: string) => toast.error(e));
          setAvailable(false);
          setBackendHtmlString("");
        });
    }
  };

  return (
  <>
    <div className="wrapper">
      <main className="main-content">
        <div className="main-card">
          <div className="title-block">
            <div className="left-block">
              <Typography variant="h2">
                {intl.formatMessage({
                  id: "Reports.merchantDetailsReport",
                  defaultMessage: "Merchant Details Report",
                })}
              </Typography>
            </div>
          </div>

          {/* First row: Text input */}
          <Grid container spacing={3}>
            {/* From Date */}
          <Grid item xs={12} lg={4} sm={6} xl={4}>
            <div className="input-with-label form-group">
              <label>
                {intl.formatMessage({
                  id: "Reports.globalSalesReport.fromDate",
                  defaultMessage: "From Date",
                })}
              </label>
              <FormControl fullWidth>
                <TextField
                  type="date"
                  value={data.fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: data.toDate || new Date().toISOString().split("T")[0]}}
                />
              </FormControl>
            </div>
          </Grid>

          {/* To Date */}
          <Grid item xs={12} lg={4} sm={6} xl={4}>
            <div className="input-with-label form-group">
              <label>
                {intl.formatMessage({
                  id: "Reports.globalSalesReport.toDate",
                  defaultMessage: "To Date",
                })}
              </label>
              <FormControl fullWidth>
                <TextField
                  type="date"
                  value={data.toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: data.fromDate || undefined ,max: new Date().toISOString().split("T")[0] }}
                />
              </FormControl>
            </div>
          </Grid>
        </Grid>


          {/* Second row: Button aligned right */}
          <Grid container justifyContent="flex-end">
            <Grid item sx={{px:2}}>
            <Button
              variant="contained"
              disableElevation
              className="btn-light"
              title="Generate Report"
              onClick={prepareReport}
              disabled={lockButtons}
            >
              {intl.formatMessage({
                id: "Reports.generateReport",
                defaultMessage: "Generate Report",
              })}
            </Button>
          </Grid>

          <Grid item sx={{px:2}}>
              <Button
                variant="contained"
                disableElevation
                title="Generate PDF Report"
                className="btn-light"
                onClick={handleExportToPdf}
                disabled={lockButtons}
              >
                {intl.formatMessage({
                  id: "Reports.generatePdfReport",
                  defaultMessage: "Generate PDF Report",
                })}
              </Button>
            </Grid>

            <Grid item sx={{px:2}}>
              <Button
                variant="contained"
                disableElevation
                title="Generate PDF Report"
                className="btn-light"
                onClick={handleExportToExcel}
                disabled={lockButtons}
              >
                {intl.formatMessage({
                  id: "Reports.generateExcelReport",
                  defaultMessage: "Generate Excel Report",
                })}
              </Button>
            </Grid>
             <Grid item sx={{px:2}}>
            <Button
              variant="contained"
              disableElevation
              className="btn-light"
              title="Generate Report"
              onClick={clearDates}
              disabled={lockButtons}
            >
              {intl.formatMessage({
                id: "Reports.clearInputs",
                defaultMessage: "Clear Inputs",
              })}
            </Button>
          </Grid >
          </Grid>
        </div>
      </main>
    </div>
  </>
);
}

export default NonActivityFeesPackagesListing;
