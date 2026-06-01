import React from "react";
import Button from "@mui/material/Button";
import {
  add_rounded,
  date_ic,
  delete_ic,
  down_arrow_icon,
  edit_ic,
} from "../../../assets/images";
import {
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
    Terminal: "300",
    ProcessingDate: "07-02-2022",
    Card: "12347567281",
    CardSequence: "1",
    CardExpiryDate: "07-02-2023",
    TransCode: "Purchase",
    TransDate: "06-02-2022",
    TransAmount: "50",
    AuthNumber: "100232",
    TipsAmount: "50",
  },
  {
    Outlet: "100013",
    Name: "Azadea city mall",
    Terminal: "100003",
    ProcessingDate: "07-02-2022",
    Card: "12347567282",
    CardSequence: "1",
    CardExpiryDate: "07-02-2023",
    TransCode: "Purchase",
    TransDate: "06-02-2022",
    TransAmount: "100",
    AuthNumber: "100232",
    TipsAmount: "100",
  },
  {
    Outlet: "100014",
    Name: "Azadea city mall",
    Terminal: "100004",
    ProcessingDate: "07-02-2022",
    Card: "12347567283",
    CardSequence: "2",
    CardExpiryDate: "07-02-2023",
    TransCode: "Purchase",
    TransDate: "06-02-2022",
    TransAmount: "30",
    AuthNumber: "100232",
    TipsAmount: "30",
  },
  {
    Outlet: "100015",
    Name: "Azadea city mall",
    Terminal: "100005",
    ProcessingDate: "07-02-2022",
    Card: "12347567284",
    CardSequence: "3",
    CardExpiryDate: "07-02-2023",
    TransCode: "Purchase",
    TransDate: "06-02-2022",
    TransAmount: "70",
    AuthNumber: "100232",
    TipsAmount: "70",
  },
];

function DesignerManualMerchantTransactionList() {
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
                <Typography variant={"h2"}>
                  Manual Merchant Transactions
                </Typography>
              </div>
              <div className="right-block">
                <Button
                  variant="contained"
                  disableElevation
                  className="btn-light"
                  endIcon={<img src={add_rounded} alt="add" />}
                >
                  Add Transaction
                </Button>
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
                      Entity/Outlet ID<span className="required-field">*</span>
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
                      <InputBase placeholder="Description" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>Terminal ID</label>
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
                      From Transaction Date
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
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label date-select-input">
                    <label>
                      To Transaction Date
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
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>Card Number</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter Number" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label>Transaction ID</label>
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
                    <TableCell>Terminal</TableCell>
                    <TableCell>Processing date</TableCell>
                    <TableCell>Card</TableCell>
                    <TableCell>Card Sequence</TableCell>
                    <TableCell>Card Expiry date</TableCell>
                    <TableCell>Trans. Code</TableCell>
                    <TableCell>Trans. Date</TableCell>
                    <TableCell>Trans. Amount</TableCell>
                    <TableCell>Auth. number</TableCell>
                    <TableCell>Tips Amount</TableCell>
                    <TableCell align="center" width="190px" className="sticky-table head">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.Outlet}</TableCell>
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>{row.Terminal}</TableCell>
                      <TableCell>{row.ProcessingDate}</TableCell>
                      <TableCell>{row.Card}</TableCell>
                      <TableCell>{row.CardSequence}</TableCell>
                      <TableCell>{row.CardExpiryDate}</TableCell>
                      <TableCell>{row.TransCode}</TableCell>
                      <TableCell>{row.TransDate}</TableCell>
                      <TableCell>{row.TransAmount}</TableCell>
                      <TableCell>{row.AuthNumber}</TableCell>
                      <TableCell>{row.TipsAmount}</TableCell>
                      <TableCell align="center" width="190px" className="sticky-table column">
                        <div className="action btns-block">
                          <IconButton className="border-icon-btn no-border sm">
                            <img src={edit_ic} alt="mail" />
                          </IconButton>
                          <IconButton className="border-icon-btn no-border sm">
                            <img src={delete_ic} alt="mail" />
                          </IconButton>
                        </div>
                      </TableCell>
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

export default DesignerManualMerchantTransactionList;
