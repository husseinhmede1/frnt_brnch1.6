import React from "react";
import Button from "@mui/material/Button";
import {
  date_ic,
  down_arrow_icon,
  ic_flag,
  ic_hand,
  ic_info_orange,
  ic_reload,
} from "../../../assets/images";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Radio,
  RadioGroup,
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
    ProcessingDate: "07/02/2022",
    Card: "12347567281",
    TransId: "Purchase",
    TransDate: "06/02/2022",
    TransAmount: "50",
    TransCurrency: "EGP",
    AuthCode: "100232",
    SettAmount: "50",
  },
  {
    Outlet: "100013",
    Name: "Azadea city mall",
    Terminal: "300",
    ProcessingDate: "07/02/2022",
    Card: "12347567282",
    TransId: "Purchase",
    TransDate: "06/02/2022",
    TransAmount: "100",
    TransCurrency: "EGP",
    AuthCode: "100232",
    SettAmount: "100",
  },
  {
    Outlet: "100014",
    Name: "Azadea city mall",
    Terminal: "302",
    ProcessingDate: "07/02/2022",
    Card: "12347567283",
    TransId: "Purchase",
    TransDate: "06/02/2022",
    TransAmount: "30",
    TransCurrency: "EGP",
    AuthCode: "100232",
    SettAmount: "30",
  },
  {
    Outlet: "100015",
    Name: "Azadea city mall",
    Terminal: "300",
    ProcessingDate: "07/02/2022",
    Card: "12347567284",
    TransId: "Purchase",
    TransDate: "06/02/2022",
    TransAmount: "30",
    TransCurrency: "EGP",
    AuthCode: "100232",
    SettAmount: "70",
  },
];
function DesignerAcquiringTransactions() {
  const [openReverseTransitionModal, setReverseTransitionModalOpen] =
    React.useState(false);

  const reverseTransitionModalOpen = () => {
    setReverseTransitionModalOpen(true);
  };
  const reverseTransitionModalClose = () => {
    setReverseTransitionModalOpen(false);
  };

  const [openRePresentmentModal, setRePresentmentModalOpen] =
    React.useState(false);

  const rePresentmentModalOpen = () => {
    setRePresentmentModalOpen(true);
  };
  const rePresentmentModalClose = () => {
    setRePresentmentModalOpen(false);
  };

  const [openHaltPayModal, setHaltPayModalOpen] = React.useState(false);

  const haltPayModalOpen = () => {
    setHaltPayModalOpen(true);
  };
  const haltPayModalClose = () => {
    setHaltPayModalOpen(false);
  };

  const [openTransactionDetailsModal, setTransactionDetailsModalOpen] =
    React.useState(false);

  const TransactionDetailsModalOpen = () => {
    setTransactionDetailsModalOpen(true);
  };
  const TransactionDetailsModalClose = () => {
    setTransactionDetailsModalOpen(false);
  };

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
                  Acquiring Transactions
                </Typography>
                <p className="pb-0">Add or update Activity Fees Packages</p>
              </div>
            </div>
            <div className="input-elements">
              <Grid spacing={3} container className="compact-grid">
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <div className="input-with-label">
                    <label className="lg">
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
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <div className="input-with-label">
                    <label className="lg">
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
                      <InputBase placeholder="Write" fullWidth disabled />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <div className="input-with-label">
                    <label className="lg">Terminal ID</label>
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
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <div className="input-with-label">
                    <label className="lg">Manual</label>
                    <FormControl fullWidth>
                      <RadioGroup row>
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
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <div className="input-with-label date-select-input">
                    <label className="lg">
                      From processing date
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
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <div className="input-with-label date-select-input">
                    <label className="lg">
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
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <div className="input-with-label">
                    <label className="lg">Card Number</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4} xl={3}>
                  <div className="input-with-label">
                    <label className="lg">
                      Transaction Id<span className="required-field">*</span>
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
                    <TableCell>Trans ID</TableCell>
                    <TableCell>Trans. date</TableCell>
                    <TableCell>Trans. Amount</TableCell>
                    <TableCell>Trans. Currency</TableCell>
                    <TableCell>Auth. Code</TableCell>
                    <TableCell>Sett. Amount</TableCell>
                    <TableCell align="center" width="205px">
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
                      <TableCell>{row.TransId}</TableCell>
                      <TableCell>{row.TransDate}</TableCell>
                      <TableCell>{row.TransAmount}</TableCell>
                      <TableCell>{row.TransCurrency}</TableCell>
                      <TableCell>{row.AuthCode}</TableCell>
                      <TableCell>{row.SettAmount}</TableCell>
                      <TableCell align="center" width="205px">
                        <div className="action btns-block">
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={TransactionDetailsModalOpen}
                          >
                            <img src={ic_info_orange} alt="info" />
                          </IconButton>
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={haltPayModalOpen}
                          >
                            <img src={ic_flag} alt="flag" />
                          </IconButton>
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={rePresentmentModalOpen}
                          >
                            <img src={ic_hand} alt="hand" />
                          </IconButton>
                          <IconButton
                            className="border-icon-btn no-border sm"
                            onClick={reverseTransitionModalOpen}
                          >
                            <img src={ic_reload} alt="reload" />
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
        <Dialog
          open={openReverseTransitionModal}
          onClose={reverseTransitionModalClose}
          className="c-dialog sm"
        >
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>Reverse Transaction</Typography>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="lg">
                      Reversal Reason<span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder="Select"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={"10"}>Select 1</MenuItem>
                        <MenuItem value={"20"}>Select 2</MenuItem>
                        <MenuItem value={"30"}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="lg">
                      Reversal Comment<span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your comment" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="lg">Original/Reversal</label>
                    <Checkbox />
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
              onClick={reverseTransitionModalClose}
            >
              Cancel
            </Button>
            <Button disableElevation variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openRePresentmentModal}
          onClose={rePresentmentModalClose}
          className="c-dialog sm"
        >
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>Re Presentment</Typography>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="lg">
                      Presentment Reason
                      <span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder="Select"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={"10"}>Select 1</MenuItem>
                        <MenuItem value={"20"}>Select 2</MenuItem>
                        <MenuItem value={"30"}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="lg">
                      Comment<span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your comment" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="lg">To be paid to merchant</label>
                    <Checkbox />
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
              onClick={rePresentmentModalClose}
            >
              Cancel
            </Button>
            <Button disableElevation variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openHaltPayModal}
          onClose={haltPayModalClose}
          className="c-dialog sm"
        >
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>Halt/Pay</Typography>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="lg">
                      Halt/Pay Status<span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                        placeholder="Select"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        <MenuItem value={"10"}>Select 1</MenuItem>
                        <MenuItem value={"20"}>Select 2</MenuItem>
                        <MenuItem value={"30"}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="lg">
                      Comment<span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your comment" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="lg">Confirm Stopping Payment</label>
                    <FormControl fullWidth>
                      <RadioGroup row>
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
          </DialogContent>
          <DialogActions className="btns-block right">
            <Button
              disableElevation
              variant="contained"
              color="secondary"
              className="sm"
              onClick={haltPayModalClose}
            >
              Cancel
            </Button>
            <Button disableElevation variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openTransactionDetailsModal}
          onClose={TransactionDetailsModalClose}
          className="c-dialog lg"
        >
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>Transaction details</Typography>
              </div>
              <div className="right-block mb-0">
                <Button
                  disableElevation
                  variant="contained"
                  className="sm"
                  onClick={TransactionDetailsModalClose}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <Grid spacing={3} container>
              <Grid item xs={12} md={6} lg={3}>
                <div className="input-with-label form-group">
                  <label className="lg">MicroFilm Ref No.</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Sequence Ref No.</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">PAN</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Card Scheme</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">Linkup code</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Card No.</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Processing Code</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Transaction ID</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Reversal</label>
                  <Checkbox />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Transaction Amount</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Transaction Currency</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">Billing Amount</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Billing Currency</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">Local Amount</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Local Currency</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">Tips Amount</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Tips Currency</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">DCC Amount</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">DCC Currency</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">DCC Merchant Amount</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">DCC Merchant Sett. Amount</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">
                    DCC Merchant Sett. Amount currency
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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

              <Grid item xs={12} md={6} lg={3}>
                <div className="input-with-label form-group">
                  <label className="lg">Merchant Commission No.</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Merchant Markup No.</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">CH Markup No.</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Fee Amount 1</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Fee amount 1 Currency</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">Feed Amount 2</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Feed amount 2 Currency</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">Transaction Date</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Transaction Time</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Authorization No.</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Mask Pan</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Billing Processing flag</label>
                  <Checkbox />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Settlement Pro. flag</label>
                  <Checkbox />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Settlement Pro. No.</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Settlement Merchant Halt</label>
                  <Checkbox />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Merchant Markup</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">CH Markup</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Terminal ID</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Merchant Country</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Acquirer ID</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Issuer ID</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Issuer Ref. No.</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <div className="input-with-label form-group">
                  <label className="lg">Outlet Code</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Merchant Name</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Merchant Account No.</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">Merchant Account Currency</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">Merchant Category</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Terminal Location.</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Acquirer Data</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Issuer Data</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Terminal Data</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">E-commerce</label>
                  <Checkbox />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Origin Network</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">Destination Network</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">Processing Date</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Merchant Sett. Date</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Sett. Amount</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Sett. Currency</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
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
                <div className="input-with-label form-group">
                  <label className="lg">Reversal Reason</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Reversal Comment</label>
                  <Checkbox />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Manual Entry</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Manual Comment</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Chargeback reason</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Chargeback Comment</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <div className="input-with-label form-group">
                  <label className="lg">Pay halt Comment</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Acquirer record to appear</label>
                  <Checkbox />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Issuer record to appear</label>
                  <Checkbox />
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Processing Ref. No. 1</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Processing Ref. No. 2</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Processing Ref. No. 3</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group">
                  <label className="lg">Processing Ref. No. 4</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
                <div className="input-with-label form-group mb-0">
                  <label className="lg">Processing Ref. No. 5</label>
                  <FormControl fullWidth>
                    <InputBase placeholder="Write" fullWidth />
                  </FormControl>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default DesignerAcquiringTransactions;
