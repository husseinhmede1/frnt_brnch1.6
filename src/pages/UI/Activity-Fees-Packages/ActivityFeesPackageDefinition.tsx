import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import {
  add_rounded,
  date_ic,
  delete_ic,
  down_arrow_icon,
  edit_ic,
} from "../../../assets/images";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
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

const rows = [
  {
    ChargeMethod: "Recurring",
    CurrencyCode: "Online",
    TranGroup: "3 people",
    TranID: "2658947",
    Scheme: "Normal",
    Tips: "Yes",
    Amount: "25,0000",
    PercentageAmount: "25",
    MinAmnt: "5,000",
    MaxAmnt: "25,0000",
    StartDate: "02-08-2022",
    EndDate: "02-08-2023",
    Exponent: "-",
  },
  {
    ChargeMethod: "Recurring",
    CurrencyCode: "Online",
    TranGroup: "3 people",
    TranID: "2658947",
    Scheme: "Normal",
    Tips: "Yes",
    Amount: "25,0000",
    PercentageAmount: "25",
    MinAmnt: "5,000",
    MaxAmnt: "25,0000",
    StartDate: "02-08-2022",
    EndDate: "02-08-2023",
    Exponent: "-",
  },
  {
    ChargeMethod: "One time",
    CurrencyCode: "Online",
    TranGroup: "3 people",
    TranID: "2658947",
    Scheme: "Normal",
    Tips: "Yes",
    Amount: "25,0000",
    PercentageAmount: "25",
    MinAmnt: "5,000",
    MaxAmnt: "25,0000",
    StartDate: "02-08-2022",
    EndDate: "02-08-2023",
    Exponent: "-",
  },
];

const popupData = [
  {
    AccumulationFrequency: "",
    VolumeCount: "25,000",
    PercentageAmount: "25,000",
    FixAmount: "25,000",
    UptoAmount: "25,000",
    Exponent: "-",
  },
];

function DesignerActivityFeesPackageDefinition() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [selectVal, setSelectVal] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectVal(event.target.value);
  };

  const [addChargeOpen, setaddChargeOpen] = React.useState(false);

  const handleAddChargeOpen = () => {
    setaddChargeOpen(true);
  };
  const handleAddChargeClose = () => {
    setaddChargeOpen(false);
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
                  Activity Fees Package Definition
                </Typography>
                <p className="pb-0">Add or update Activity Fees Packages</p>
              </div>
              <div className="right-block">
                <Button
                  variant="contained"
                  disableElevation
                  className="btn-light"
                  endIcon={<img src={add_rounded} alt="add" />}
                  onClick={handleClickOpen}
                >
                  Add record
                </Button>
              </div>
            </div>
            <div className="form-group">
              <Grid spacing={3} container>
                <Grid item xs={12} sm={6} lg={4} xl={4}>
                  <div className="input-with-label">
                    <label>Package Name</label>
                    <FormControl fullWidth>
                      <InputBase
                        placeholder="Write your package name"
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} lg={4} xl={4}>
                  <div className="input-with-label">
                    <label>Institution</label>
                    <FormControl fullWidth>
                      <Select
                        disabled
                        value={selectVal}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        IconComponent={() => (
                          <img src={down_arrow_icon} alt="" />
                        )}
                      >
                        <MenuItem value="">
                          <em>Default Selected Institution</em>
                        </MenuItem>
                        <MenuItem value={10}>Selected 1</MenuItem>
                        <MenuItem value={20}>Selected 2</MenuItem>
                        <MenuItem value={30}>Selected 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="form-group">
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Charge Method</TableCell>
                      <TableCell>Currency Code</TableCell>
                      <TableCell>Tran. Group</TableCell>
                      <TableCell>Tran. ID</TableCell>
                      <TableCell>Scheme</TableCell>
                      <TableCell>Tips (Y/N)</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>% Amount</TableCell>
                      <TableCell>Min Amnt</TableCell>
                      <TableCell>Max Amnt</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell align="center" width="190px" className="last-column-border-header">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.ChargeMethod}</TableCell>
                        <TableCell>{row.CurrencyCode}</TableCell>
                        <TableCell>{row.TranGroup}</TableCell>
                        <TableCell>{row.TranID}</TableCell>
                        <TableCell>{row.Scheme}</TableCell>
                        <TableCell>{row.Tips}</TableCell>
                        <TableCell>{row.Amount}</TableCell>
                        <TableCell>{row.PercentageAmount}</TableCell>
                        <TableCell>{row.MinAmnt}</TableCell>
                        <TableCell>{row.MaxAmnt}</TableCell>
                        <TableCell>{row.StartDate}</TableCell>
                        <TableCell>{row.EndDate}</TableCell>
                        <TableCell align="center" width="190px" className="last-column-border">
                          <div className="action btns-block">
                            <Switch className="custom" />
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

            <div className="btns-block right">
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                className="sm"
              >
                Cancel
              </Button>
              <Button disableElevation variant="contained">
                Save
              </Button>
            </div>
          </div>
        </main>
        <Dialog open={open} onClose={handleClose} className="c-dialog lg">
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>Package Details</Typography>
                <p className="pb-0">Add a package details record</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card">
              <Grid spacing={3} container>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label form-group">
                    <label className="lg">Charge Method*</label>
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

                  <div className="input-with-label form-group">
                    <label className="lg">Currency*</label>
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

                  <div className="input-with-label form-group">
                    <label className="lg">Tran. Group*</label>
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

                  <div className="input-with-label form-group mb-0">
                    <label className="lg">Tran. ID*</label>
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
                  <div className="input-with-label form-group">
                    <label className="lg">Card Scheme*</label>
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

                  <div className="input-with-label form-group">
                    <label className="lg">Issuer*</label>
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

                  <div className="input-with-label date-select-input form-group">
                    <label className="lg">Start date*</label>
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

                  <div className="input-with-label date-select-input form-group mb-0">
                    <label className="lg">End date*</label>
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
                  <div className="input-with-label form-group">
                    <label className="lg">Fees Amount*</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write amount" fullWidth />
                    </FormControl>
                  </div>

                  <div className="input-with-label form-group">
                    <label className="lg">%Amount*</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter Date" fullWidth />
                    </FormControl>
                  </div>

                  <div className="input-with-label form-group">
                    <label className="lg">Min Amount*</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter Date" fullWidth />
                    </FormControl>
                  </div>

                  <div className="input-with-label form-group mb-0">
                    <label className="lg">Max Amount*</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter Date" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"} className="pb-0">
                  Charge Details
                </Typography>
              </div>
              <div className="right-block mb-0">
                <Button
                  endIcon={<img src={add_rounded} alt="add" />}
                  className="link"
                  onClick={handleAddChargeOpen}
                >
                  Add Charge Detail
                </Button>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Accumulation Frequency</TableCell>
                    <TableCell>Volume/Count</TableCell>
                    <TableCell>Percentage Amount</TableCell>
                    <TableCell>Fix Amount</TableCell>
                    <TableCell>Up to Amount</TableCell>
                    <TableCell align="center" width="190px" className="last-column-border-header">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {popupData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {row.AccumulationFrequency === "" ? (
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
                        ) : (
                          row.AccumulationFrequency
                        )}
                      </TableCell>
                      <TableCell>{row.VolumeCount}</TableCell>
                      <TableCell>{row.PercentageAmount}</TableCell>
                      <TableCell>{row.FixAmount}</TableCell>
                      <TableCell>{row.UptoAmount}</TableCell>
                      <TableCell align="center" width="190px" className="last-column-border">
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
          </DialogContent>
          <DialogActions className="btns-block right">
            <Button
              disableElevation
              variant="contained"
              color="secondary"
              className="sm"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button disableElevation variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={addChargeOpen}
          onClose={handleAddChargeClose}
          className="c-dialog"
        >
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>Add Charge details</Typography>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Accumulation frequency</label>
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
                        <MenuItem value={"10"}>Ten</MenuItem>
                        <MenuItem value={"20"}>Twenty</MenuItem>
                        <MenuItem value={"30"}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Percentage Amount</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your Number" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Volume/count</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your name" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Fix Amount</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your amount" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Up to Amount</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your amount" fullWidth />
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
              onClick={handleAddChargeClose}
            >
              Cancel
            </Button>
            <Button disableElevation variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default DesignerActivityFeesPackageDefinition;
