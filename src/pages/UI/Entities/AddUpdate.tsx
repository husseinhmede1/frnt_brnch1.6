import React from "react";
import Button from '@mui/material/Button';
import { add_rounded, clone_ic, date_ic, delete_ic, down_arrow_icon, edit_ic, ic_check, ic_checked, ic_per, search_ic } from "../../../assets/images";
import { Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, InputBase, MenuItem, Radio, RadioGroup, Select, Switch, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

const patmentData = [
  { AccountNumber: '01', BankCode: 'Code', IBAN: 'IBAN', TransferCurrency: 'INR', SettlmentCurrency: '', CurrencyMarkup: '' },
  { AccountNumber: '01', BankCode: 'Code', IBAN: 'IBAN', TransferCurrency: 'INR', SettlmentCurrency: '', CurrencyMarkup: '' },
  { AccountNumber: '01', BankCode: 'Code', IBAN: 'IBAN', TransferCurrency: 'INR', SettlmentCurrency: '', CurrencyMarkup: '' },
]

const posData = [
  { TerminalID: '01', SerialNumber: '', StartDate: '', TerminationDate: '', Ecommerce: '', Type: '', Currency: '', MCC: '' },
  { TerminalID: '01', SerialNumber: '', StartDate: '', TerminationDate: '', Ecommerce: '', Type: '', Currency: '', MCC: '' },
  { TerminalID: '01', SerialNumber: '', StartDate: '', TerminationDate: '', Ecommerce: '', Type: '', Currency: '', MCC: '' },
]

const activityData = [
  {
    ChargeMethod: '01',
    Currencycode: '',
    TransactionID: '',
    Scheme: '',
    Amount: '',
    Amount_per: '',
    MinAmnt: '',
    MaxAmnt: '',
    StartDate: '',
    EndDate: ''
  },
  {
    ChargeMethod: '02',
    Currencycode: '',
    TransactionID: '',
    Scheme: '',
    Amount: '',
    Amount_per: '',
    MinAmnt: '',
    MaxAmnt: '',
    StartDate: '',
    EndDate: ''
  },
  {
    ChargeMethod: '03',
    Currencycode: '',
    TransactionID: '',
    Scheme: '',
    Amount: '',
    Amount_per: '',
    MinAmnt: '',
    MaxAmnt: '',
    StartDate: '',
    EndDate: ''
  },
]
const NonActivityFeesData = [
  { ChargeType: 'Recuring', Currency: '', TransactionID: '', ChargeCount: '', TerminalType: '', Scheme: '', Frequency: '', NoofInstallments: '', ChargeFirsttransaction: 'Yes', Amount: '', MaxAmnt: '', StartDate: '', EndDate: '' },
  { ChargeType: 'One time', Currency: '', TransactionID: '', ChargeCount: '', TerminalType: '', Scheme: '', Frequency: '', NoofInstallments: '', ChargeFirsttransaction: 'No', Amount: '', MaxAmnt: '', StartDate: '', EndDate: '' },
  { ChargeType: 'One time', Currency: '', TransactionID: '', ChargeCount: '', TerminalType: '', Scheme: '', Frequency: '', NoofInstallments: '', ChargeFirsttransaction: 'Yes', Amount: '', MaxAmnt: '', StartDate: '', EndDate: '' },
]

const contactData = [
  { ContactName: '', Role: '', ReceiveEstatement: '' },
  { ContactName: '', Role: '', ReceiveEstatement: '' },
  { ContactName: '', Role: '', ReceiveEstatement: '' }
]


function DesignerAddEntities() {

  const [openAccModal, setAccModalOpen] = React.useState(false);

  const accModalOpen = () => {
    setAccModalOpen(true);
  };
  const accModalClose = () => {
    setAccModalOpen(false);
  };

  const [openTerminalModal, setTerminalModalOpen] = React.useState(false);

  const terminalModalOpen = () => {
    setTerminalModalOpen(true);
  };
  const terminalModalClose = () => {
    setTerminalModalOpen(false);
  };

  const [openContactModal, setContactModalOpen] = React.useState(false);

  const contactModalOpen = () => {
    setContactModalOpen(true);
  };
  const contactModalClose = () => {
    setContactModalOpen(false);
  };


  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        className="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <>
            {children}
          </>
        )}
      </div>
    );
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [dateValue, setDateValue] = React.useState<Date | null>(null);

  return (
    <>
      <div className="wrapper">
        <DesignerHeader />
        <DesignerSidebar />
        <main className="main-content" >
          <div className="title-block">
            <div className="left-block">
              <Typography variant={"h2"} className="pb-0">Entity Definition</Typography>
            </div>
          </div>
          <div className="input-elements">
            <Grid spacing={3} container>
              <Grid item xs={12} md={6} xl={3}>
                <div className="input-with-label form-group">
                  <label className="lg">Institution*</label>
                  <FormControl fullWidth >
                    <Select
                      displayEmpty
                      defaultValue=""
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      placeholder="Select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value={"10"}>Ten</MenuItem>
                      <MenuItem value={"20"}>Twenty</MenuItem>
                      <MenuItem value={"30"}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Entity ID*</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="AutoFilled" error
                      fullWidth
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group mb-0">
                  <label className="lg">Entity Level*</label>
                  <FormControl fullWidth >
                    <Select
                      displayEmpty
                      defaultValue=""
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      placeholder="Select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value={"10"}>Ten</MenuItem>
                      <MenuItem value={"20"}>Twenty</MenuItem>
                      <MenuItem value={"30"}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <div className="input-with-label form-group">
                  <label className="lg">Name*</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" error
                      fullWidth
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Alternate Name*</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" error
                      fullWidth
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group mb-0">
                  <label className="lg">Doing Business AS*</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" error
                      fullWidth
                    />
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <div className="input-with-label form-group">
                  <label className="lg">Doing Business AS  Alt*</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" error
                      fullWidth
                    />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Parent</label>
                  <FormControl fullWidth >
                    <Select
                      displayEmpty
                      defaultValue=""
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      placeholder="Select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value={"10"}>Ten</MenuItem>
                      <MenuItem value={"20"}>Twenty</MenuItem>
                      <MenuItem value={"30"}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group mb-0">
                  <FormGroup row className="checbox-grp">
                    <FormControlLabel
                      control={
                        <Checkbox
                          icon={<img src={ic_check} alt="" />}
                          checkedIcon={<img src={ic_checked} alt="" />}
                        />}
                      label="On Hold" labelPlacement="start" />
                    <FormControlLabel control={<Checkbox icon={<img src={ic_check} alt="" />}
                      checkedIcon={<img src={ic_checked} alt="" />} />} label="Hot" labelPlacement="start" />
                  </FormGroup>
                </div>
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <div className="input-with-label form-group">
                  <label className="lg">Default MCC*</label>
                  <FormControl fullWidth >
                    <Select
                      displayEmpty
                      defaultValue=""
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      placeholder="Select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value={"10"}>Ten</MenuItem>
                      <MenuItem value={"20"}>Twenty</MenuItem>
                      <MenuItem value={"30"}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Business Type*</label>
                  <FormControl fullWidth >
                    <Select
                      displayEmpty
                      defaultValue=""
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      placeholder="Select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value={"10"}>Ten</MenuItem>
                      <MenuItem value={"20"}>Twenty</MenuItem>
                      <MenuItem value={"30"}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="input-with-label form-group mb-0">
                  <label className="lg">Status*</label>
                  <FormControl fullWidth >
                    <Select
                      displayEmpty
                      defaultValue=""
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      placeholder="Select"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      <MenuItem value={"10"}>Ten</MenuItem>
                      <MenuItem value={"20"}>Twenty</MenuItem>
                      <MenuItem value={"30"}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="tab-wrapper">
            <Tabs value={value} variant="scrollable" onChange={handleChange} aria-label="basic tabs example" scrollButtons="auto">
              <Tab label="Main Info" />
              <Tab label="Payment Accounts" />
              <Tab label="POS" />
              <Tab label="Activity Fees" />
              <Tab label="Non Activity Fees" />
              <Tab label="Address" />
              <Tab label="Contacts" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <div className="panel-body">
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6} xl={3}>
                    <div className="input-with-label form-group">
                      <label className="lg">Company Registration No.</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Company VAT No.</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Default Bank Code.</label>
                      <FormControl fullWidth >
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={"10"}>Ten</MenuItem>
                          <MenuItem value={"20"}>Twenty</MenuItem>
                          <MenuItem value={"30"}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Default Account No.</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group mb-0">
                      <label className="lg">Default IBAN</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} xl={3}>
                    <div className="input-with-label date-select-input form-group">
                      <label className="lg">Contract Date</label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dateValue}
                            onChange={(newValue) => {
                              setDateValue(newValue);
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
                    <div className="input-with-label date-select-input form-group">
                      <label className="lg">Expected Start Date</label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dateValue}
                            onChange={(newValue) => {
                              setDateValue(newValue);
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
                    <div className="input-with-label date-select-input form-group">
                      <label className="lg">Actual start date</label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dateValue}
                            onChange={(newValue) => {
                              setDateValue(newValue);
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
                    <div className="input-with-label date-select-input form-group">
                      <label className="lg">Termination Date</label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dateValue}
                            onChange={(newValue) => {
                              setDateValue(newValue);
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
                    <div className="input-with-label date-select-input form-group mb-0">
                      <label className="lg">Last Trans Date</label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dateValue}
                            onChange={(newValue) => {
                              setDateValue(newValue);
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
                  <Grid item xs={12} md={6} xl={3}>
                    <div className="input-with-label form-group">
                      <label className="lg">Associated Payment</label>
                      <FormControl fullWidth>
                        <RadioGroup
                          row
                        >
                          <FormControlLabel
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Payment Method</label>
                      <FormControl fullWidth >
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={"10"}>Ten</MenuItem>
                          <MenuItem value={"20"}>Twenty</MenuItem>
                          <MenuItem value={"30"}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Payment Frequency</label>
                      <FormControl fullWidth >
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={"10"}>Ten</MenuItem>
                          <MenuItem value={"20"}>Twenty</MenuItem>
                          <MenuItem value={"30"}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-with-label  date-select-input form-group">
                      <label className="lg">Add Value Date</label>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={dateValue}
                            onChange={(newValue) => {
                              setDateValue(newValue);
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
                    <div className="input-with-label form-group mb-0">
                      <label className="lg">Statement Type</label>
                      <FormControl fullWidth >
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={"10"}>Ten</MenuItem>
                          <MenuItem value={"20"}>Twenty</MenuItem>
                          <MenuItem value={"30"}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} xl={3}>
                    <div className="input-with-label form-group">
                      <label className="lg">Sales Man</label>
                      <FormControl fullWidth >
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={"10"}>Ten</MenuItem>
                          <MenuItem value={"20"}>Twenty</MenuItem>
                          <MenuItem value={"30"}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Employee in Charge</label>
                      <FormControl fullWidth >
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={"10"}>Ten</MenuItem>
                          <MenuItem value={"20"}>Twenty</MenuItem>
                          <MenuItem value={"30"}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Estatement to Entity</label>
                      <FormControl fullWidth>
                        <RadioGroup
                          row
                        >
                          <FormControlLabel
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="panel-footer btns-block right">
                <Button
                  disableElevation
                  variant="contained"
                  color="error"
                >
                  Delete
                </Button>
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button disableElevation variant="contained">
                  Save
                </Button>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div className="panel-body">
                <div className="title-block">
                  <div className="left-block mb-0">
                  </div>
                  <div className="right-block">
                    <Button
                      variant="contained"
                      disableElevation
                      className="btn-light"
                      endIcon={<img src={add_rounded} alt="add" />}
                      onClick={accModalOpen}
                    >
                      Add Account
                    </Button>
                  </div>
                </div>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Account Number</TableCell>
                        <TableCell>Bank Code</TableCell>
                        <TableCell>IBAN</TableCell>
                        <TableCell>Transfer Currency</TableCell>
                        <TableCell>Settlment Currency</TableCell>
                        <TableCell>Currency Markup</TableCell>
                        <TableCell align="center" width="190px">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patmentData.map((row, i) => (
                        <TableRow
                          key={i}
                        >
                          <TableCell>{row.AccountNumber}</TableCell>
                          <TableCell>{row.BankCode}</TableCell>
                          <TableCell>{row.IBAN}</TableCell>
                          <TableCell>{row.TransferCurrency}</TableCell>
                          <TableCell>{row.SettlmentCurrency}</TableCell>
                          <TableCell>{row.CurrencyMarkup}</TableCell>
                          <TableCell align="center" width="190px">
                            <div className="action btns-block">
                              <IconButton className="border-icon-btn no-border sm">
                                <img src={edit_ic} alt="edit" />
                              </IconButton>
                              <IconButton className="border-icon-btn no-border sm">
                                <img src={delete_ic} alt="delete" />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="panel-footer btns-block right">
                <Button
                  disableElevation
                  variant="contained"
                  color="error"
                >
                  Delete
                </Button>
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button disableElevation variant="contained">
                  Save
                </Button>
              </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div className="panel-body">
                <div className="title-block">
                  <div className="left-block mb-0">
                  </div>
                  <div className="right-block">
                    <Button
                      variant="contained"
                      disableElevation
                      className="btn-light"
                      endIcon={<img src={add_rounded} alt="add" />}
                      onClick={terminalModalOpen}
                    >
                      Add Terminal
                    </Button>
                  </div>
                </div>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Terminal ID</TableCell>
                        <TableCell>Serial Number</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>Termination Date</TableCell>
                        <TableCell>Ecommerce</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Currency</TableCell>
                        <TableCell>MCC</TableCell>
                        <TableCell align="center" width="190px">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {posData.map((row, i) => (
                        <TableRow
                          key={i}
                        >
                          <TableCell>{row.TerminalID}</TableCell>
                          <TableCell>{row.SerialNumber}</TableCell>
                          <TableCell>{row.StartDate}</TableCell>
                          <TableCell>{row.TerminationDate}</TableCell>
                          <TableCell>{row.Ecommerce}</TableCell>
                          <TableCell>{row.Type}</TableCell>
                          <TableCell>{row.Currency}</TableCell>
                          <TableCell>{row.MCC}</TableCell>
                          <TableCell align="center" width="190px">
                            <div className="action btns-block">
                              <IconButton className="border-icon-btn no-border sm">
                                <img src={edit_ic} alt="edit" />
                              </IconButton>
                              <IconButton className="border-icon-btn no-border sm">
                                <img src={delete_ic} alt="delete" />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="panel-footer btns-block right">
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button disableElevation variant="contained">
                  Save
                </Button>
              </div>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <div className="panel-body">
                <Grid spacing={3} container>
                  <Grid item xs={12} lg={4} sm={6} xl={4}>
                    <div className="input-with-label form-group">
                      <label>Package Name</label>
                      <FormControl fullWidth>
                        <Select
                          defaultValue=""
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={10}>Institution 1</MenuItem>
                          <MenuItem value={20}>Institution 2</MenuItem>
                          <MenuItem value={30}>Institution 3</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Charge Method</TableCell>
                        <TableCell>Currency code</TableCell>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Scheme</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>% Amount</TableCell>
                        <TableCell>Min Amnt</TableCell>
                        <TableCell>Max Amnt</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activityData.map((row, i) => (
                        <TableRow
                          key={i}
                        >
                          <TableCell>{row.ChargeMethod}</TableCell>
                          <TableCell>{row.Currencycode}</TableCell>
                          <TableCell>{row.TransactionID}</TableCell>
                          <TableCell>{row.Scheme}</TableCell>
                          <TableCell>{row.Amount}</TableCell>
                          <TableCell>{row.Amount_per}</TableCell>
                          <TableCell>{row.MinAmnt}</TableCell>
                          <TableCell>{row.MaxAmnt}</TableCell>
                          <TableCell>{row.StartDate}</TableCell>
                          <TableCell>{row.EndDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="panel-footer btns-block right">
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button disableElevation variant="contained">
                  Save
                </Button>
              </div>
            </TabPanel>
            <TabPanel value={value} index={4}>
              <div className="panel-body">
                <Grid spacing={3} container>
                  <Grid item xs={12} lg={4} sm={6} xl={4}>
                    <div className="input-with-label form-group">
                      <label>Package Name</label>
                      <FormControl fullWidth>
                        <Select
                          defaultValue=""
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={10}>Institution 1</MenuItem>
                          <MenuItem value={20}>Institution 2</MenuItem>
                          <MenuItem value={30}>Institution 3</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Charge Type</TableCell>
                        <TableCell>Currency </TableCell>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Charge Count</TableCell>
                        <TableCell>Terminal Type</TableCell>
                        <TableCell>Scheme</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>No.of Installments</TableCell>
                        <TableCell>Charge First transaction</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Max Amnt</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {NonActivityFeesData.map((row, i) => (
                        <TableRow
                          key={i}
                        >
                          <TableCell>{row.ChargeType}</TableCell>
                          <TableCell>{row.Currency}</TableCell>
                          <TableCell>{row.TransactionID}</TableCell>
                          <TableCell>{row.ChargeCount}</TableCell>
                          <TableCell>{row.TerminalType}</TableCell>
                          <TableCell>{row.Scheme}</TableCell>
                          <TableCell>{row.Frequency}</TableCell>
                          <TableCell>{row.NoofInstallments}</TableCell>
                          <TableCell>{row.ChargeFirsttransaction}</TableCell>
                          <TableCell>{row.Amount}</TableCell>
                          <TableCell>{row.MaxAmnt}</TableCell>
                          <TableCell>{row.StartDate}</TableCell>
                          <TableCell>{row.EndDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="panel-footer btns-block right">
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button disableElevation variant="contained">
                  Save
                </Button>
              </div>
            </TabPanel>
            <TabPanel value={value} index={5}>
              <div className="panel-body">
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group">
                      <label>Address 1</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>Address 2</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>Address 3</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>Address 4</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>Other details</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group">
                      <label>Country </label>
                      <FormControl fullWidth >
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={"10"}>Ten</MenuItem>
                          <MenuItem value={"20"}>Twenty</MenuItem>
                          <MenuItem value={"30"}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>City </label>
                      <FormControl fullWidth >
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={"10"}>Ten</MenuItem>
                          <MenuItem value={"20"}>Twenty</MenuItem>
                          <MenuItem value={"30"}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>Postal Code</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>Geo Code</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group">
                      <label>Phone 1</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>Phone 2</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>Mobile 1</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>Mobile 2</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group">
                      <label>Fax</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>URL</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group">
                      <label>Email 1</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label>Email 2</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write" error
                          fullWidth
                        />
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="panel-footer btns-block right">
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button disableElevation variant="contained">
                  Save
                </Button>
              </div>
            </TabPanel>
            <TabPanel value={value} index={6}>
              <div className="panel-body">
                <div className="title-block">
                  <div className="left-block mb-0">
                  </div>
                  <div className="right-block">
                    <Button
                      variant="contained"
                      disableElevation
                      className="btn-light"
                      endIcon={<img src={add_rounded} alt="add" />}
                      onClick={contactModalOpen}
                    >
                      Add Contact
                    </Button>
                  </div>
                </div>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Contact Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Receive E-statement</TableCell>
                        <TableCell align="center" width="190px">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contactData.map((row, i) => (
                        <TableRow
                          key={i}
                        >
                          <TableCell>{row.ContactName}</TableCell>
                          <TableCell>{row.Role}</TableCell>
                          <TableCell>{row.ReceiveEstatement}</TableCell>
                          <TableCell align="center" width="190px">
                            <div className="action btns-block">
                              <IconButton className="border-icon-btn no-border sm">
                                <img src={edit_ic} alt="edit" />
                              </IconButton>
                              <IconButton className="border-icon-btn no-border sm">
                                <img src={delete_ic} alt="delete" />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="panel-footer btns-block right">
                <Button
                  disableElevation
                  variant="contained"
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button disableElevation variant="contained">
                  Save
                </Button>
              </div>
            </TabPanel>
          </div>

        </main >
        <Dialog open={openAccModal} onClose={accModalClose} className="c-dialog">
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  Add Account Number
                </Typography>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Account Nbr*</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Account Nbr" error
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">IBAN*</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="IBAN" error
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Bank Code*</label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        placeholder="Select"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={"10"}>Ten</MenuItem>
                        <MenuItem value={"20"}>Twenty</MenuItem>
                        <MenuItem value={"30"}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Settlment Currency</label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        placeholder="Select"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={"10"}>Ten</MenuItem>
                        <MenuItem value={"20"}>Twenty</MenuItem>
                        <MenuItem value={"30"}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Transfer Currency</label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        placeholder="Select"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={"10"}>Ten</MenuItem>
                        <MenuItem value={"20"}>Twenty</MenuItem>
                        <MenuItem value={"30"}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} className="p-0">
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Currency Markup</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter Percentage" error
                        fullWidth
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton>
                              <img src={ic_per} alt="lock" />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions className="btns-block right">
            <Button
              disableElevation
              variant="contained"
              color="secondary"
              className="sm"
              onClick={accModalClose}
            >
              Cancel
            </Button>
            <Button disableElevation variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openTerminalModal} onClose={terminalModalClose} className="c-dialog">
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  Terminal Definition
                </Typography>
                <p>Add or Update a Terminal</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label form-group">
                    <label className="lg">Serial No*</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Serial No" error
                        fullWidth
                      />
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group">
                    <label className="lg">Type*</label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        placeholder="Select"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={"10"}>Ten</MenuItem>
                        <MenuItem value={"20"}>Twenty</MenuItem>
                        <MenuItem value={"30"}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group">
                    <label className="lg">Type*</label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        placeholder="Select"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={"10"}>Ten</MenuItem>
                        <MenuItem value={"20"}>Twenty</MenuItem>
                        <MenuItem value={"30"}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="form-group input-with-label mb-0 center">
                    <label className="lg center">Enable/disable</label>
                    <Switch className="custom" />
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label form-group">
                    <label className="lg">Currency*</label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                        placeholder="Select"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={"10"}>Ten</MenuItem>
                        <MenuItem value={"20"}>Twenty</MenuItem>
                        <MenuItem value={"30"}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="input-with-label form-group">
                    <label className="lg">E-Commerce</label>
                    <FormControl fullWidth>
                      <RadioGroup
                        row
                      >
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="input-with-label  date-select-input form-group">
                    <label className="lg">Start Date</label>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={dateValue}
                          onChange={(newValue) => {
                            setDateValue(newValue);
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
                  <div className="input-with-label  date-select-input form-group">
                    <label className="lg">Termination Date</label>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={dateValue}
                          onChange={(newValue) => {
                            setDateValue(newValue);
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
          </DialogContent>
          <DialogActions className="btns-block right">
            <Button
              disableElevation
              variant="contained"
              color="secondary"
              className="sm"
              onClick={terminalModalClose}
            >
              Cancel
            </Button>
            <Button disableElevation variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openContactModal} onClose={contactModalClose} className="c-dialog lg">
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>Contact Definition</Typography>
                <p className="pb-0">Add a Contact</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <div className="form-group">
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">First Name*</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">Middle Name*</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">Last Name*</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">Professional Title</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Enter Numbers" fullWidth />
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </div>

              <div className="form-group">
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group">
                      <label className="lg">Address 1</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Address 2</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Address 3</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group mb-0">
                      <label className="lg">Address 4</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group">
                      <label className="lg">Country</label>
                      <FormControl fullWidth>
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={"10"}>Ten</MenuItem>
                          <MenuItem value={"20"}>Twenty</MenuItem>
                          <MenuItem value={"30"}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">City</label>
                      <FormControl fullWidth>
                        <Select
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <img src={down_arrow_icon} alt="" />}
                          placeholder="Select"
                        >
                          <MenuItem value="">
                            <em>Select</em>
                          </MenuItem>
                          <MenuItem value={"10"}>Ten</MenuItem>
                          <MenuItem value={"20"}>Twenty</MenuItem>
                          <MenuItem value={"30"}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Postal Code</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group mb-0">
                      <label className="lg">Geo Code</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label form-group">
                      <label className="lg">Phone 1*</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Enter Your Number" fullWidth />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Phone 2</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Enter Your Number" fullWidth />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">Mobile 1*</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Enter Your Number" fullWidth />
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group mb-0">
                      <label className="lg">Mobile 2</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Enter Your Number" fullWidth />
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </div>

              <div className="form-group mb-0">
                <Grid spacing={3} container>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">Fax</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">Email 1</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">Email 2</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Write your name" fullWidth />
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <div className="input-with-label">
                      <label className="lg">URL</label>
                      <FormControl fullWidth>
                        <InputBase placeholder="Enter Numbers" fullWidth />
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="btns-block right">
            <Button
              disableElevation
              variant="contained"
              color="secondary"
              className="sm"
              onClick={contactModalClose}
            >
              Cancel
            </Button>
            <Button disableElevation variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div >
    </>
  );
}

export default DesignerAddEntities;
