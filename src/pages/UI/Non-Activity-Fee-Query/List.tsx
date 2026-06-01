import React from "react";
import Button from "@mui/material/Button";
import {
  date_ic,
  down_arrow_icon,
} from "../../../assets/images";
import {
  FormControl,
  Grid,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const rows = [
  {
    Outlet: "100012",
    Name: "Azadea city mall",
    TransactionCode: "100002",
    TransactionDate: "Purchase",
    TransactionAmount: "06-02-2022",
    ProcessingDate: "EGP",
    TransactionCurrency: "EGP",
    ReverseFlag: "Yes",
    ReverseFlagSecond: "Yes",
    Comment: "",
  },
  {
    Outlet: "100013",
    Name: "Azadea city mall",
    TransactionCode: "100003",
    TransactionDate: "Purchase",
    TransactionAmount: "06-02-2022",
    ProcessingDate: "EGP",
    TransactionCurrency: "EGP",
    ReverseFlag: "No",
    ReverseFlagSecond: "Yes",
    Comment: "",
  },
  {
    Outlet: "100014",
    Name: "Azadea city mall",
    TransactionCode: "100004",
    TransactionDate: "Purchase",
    TransactionAmount: "06-02-2022",
    ProcessingDate: "EGP",
    TransactionCurrency: "EGP",
    ReverseFlag: "Yes",
    ReverseFlagSecond: "Yes",
    Comment: "",
  },
  {
    Outlet: "100015",
    Name: "Azadea city mall",
    TransactionCode: "100005",
    TransactionDate: "Purchase",
    TransactionAmount: "06-02-2022",
    ProcessingDate: "EGP",
    TransactionCurrency: "EGP",
    ReverseFlag: "No",
    ReverseFlagSecond: "Yes",
    Comment: "",
  },
];
function DesignerNonActivityFeeQuery() {
  const [selectVal, setSelectVal] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectVal(event.target.value);
  };

  const [value, setValue] = React.useState<Date | null>(null);

  return (
    <>
      <div className="wrapper">
        <DesignerHeader />
        <DesignerSidebar />
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"} className="pb-0">
                  Non Activity Fee Query
                </Typography>
              </div>
            </div>
            <div className="input-elements">
              <Grid spacing={3} container>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>
                      Institution<span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        value={selectVal}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={10}>Select 1</MenuItem>
                        <MenuItem value={20}>Select 2</MenuItem>
                        <MenuItem value={30}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>
                      Entity.Outlet ID<span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        value={selectVal}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={10}>Select 1</MenuItem>
                        <MenuItem value={20}>Select 2</MenuItem>
                        <MenuItem value={30}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth className="field-space">
                      <InputBase placeholder="Write" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>Transaction code</label>
                    <FormControl fullWidth>
                      <Select
                        value={selectVal}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={10}>Select 1</MenuItem>
                        <MenuItem value={20}>Select 2</MenuItem>
                        <MenuItem value={30}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>
                      From processing date
                      <span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        value={selectVal}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={10}>Select 1</MenuItem>
                        <MenuItem value={20}>Select 2</MenuItem>
                        <MenuItem value={30}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label date-select-input">
                    <label>
                      To processing date
                      <span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={value}
                          onChange={(newValue) => {
                            setValue(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          components={{
                            OpenPickerIcon: () => {
                              return <img src={date_ic} alt="date" />;
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </div>

            <div className="btns-block right has-border form-group">
              <Button disableElevation variant="contained">
                Search
              </Button>
            </div>

            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Outlet</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Transaction Code</TableCell>
                    <TableCell>Transaction Date</TableCell>
                    <TableCell>Transaction Amount</TableCell>
                    <TableCell>Processing Date</TableCell>
                    <TableCell>Transaction Currency</TableCell>
                    <TableCell>Reverse Flag</TableCell>
                    <TableCell>Reverse Flag</TableCell>
                    <TableCell>Comment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.Outlet}</TableCell>
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>{row.TransactionCode}</TableCell>
                      <TableCell>{row.TransactionDate}</TableCell>
                      <TableCell>{row.TransactionAmount}</TableCell>
                      <TableCell>{row.ProcessingDate}</TableCell>
                      <TableCell>{row.TransactionCurrency}</TableCell>
                      <TableCell>{row.ReverseFlag}</TableCell>
                      <TableCell>{row.ReverseFlagSecond}</TableCell>
                      <TableCell>{row.Comment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </main>
      </div>
    </>
  );
}

export default DesignerNonActivityFeeQuery;
