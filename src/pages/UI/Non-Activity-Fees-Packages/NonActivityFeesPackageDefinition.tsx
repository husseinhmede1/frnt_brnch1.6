import React from "react";
import Button from "@mui/material/Button";
import {
  add_rounded,
  delete_ic,
  down_arrow_icon,
  edit_ic,
  info_ic,
} from "../../../assets/images";
import {
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
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

const rows = [
  {
    ChargeType: "Recurring",
    Currency: " ",
    TranID: " ",
    ChargeCount: " ",
    TerminalType: " ",
    Scheme: " ",
    Freq: " ",
    NoOfInst: " ",
    Charge: " ",
    Amount: "25,0000",
    MaxAmnt: "25,0000",
    StartDate: "02-08-2022",
    EndDate: "02-08-2023",
    Exponent: "-",
  },
  {
    ChargeType: "Recurring",
    Currency: " ",
    TranID: " ",
    ChargeCount: " ",
    TerminalType: " ",
    Scheme: " ",
    Freq: " ",
    NoOfInst: " ",
    Charge: " ",
    Amount: "25,0000",
    MaxAmnt: "25,0000",
    StartDate: "02-08-2022",
    EndDate: "02-08-2023",
    Exponent: "-",
  },
  {
    ChargeType: "One time",
    Currency: " ",
    TranID: " ",
    ChargeCount: " ",
    TerminalType: " ",
    Scheme: " ",
    Freq: " ",
    NoOfInst: " ",
    Charge: " ",
    Amount: "25,0000",
    MaxAmnt: "25,0000",
    StartDate: "02-08-2022",
    EndDate: "02-08-2023",
    Exponent: "-",
  },
];

function DesignerNonActivityFeesPackages() {
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

  const [chargeValue, setChargeValue] = React.useState("yes");

  const chargeValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChargeValue((event.target as HTMLInputElement).value);
  };

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
                  Non Activity Fees Package Definition
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
                  Add Record
                </Button>
              </div>
            </div>
            <div className="form-group">
            <Grid spacing={3} container>
              <Grid item xs={12} lg={4} sm={6} xl={4}>
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
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Charge Type</TableCell>
                    <TableCell>Currency</TableCell>
                    <TableCell>Tran. ID</TableCell>
                    <TableCell>Charge Count</TableCell>
                    <TableCell>Terminal Type</TableCell>
                    <TableCell>Scheme</TableCell>
                    <TableCell>Freq.</TableCell>
                    <TableCell>No. of Inst.</TableCell>
                    <TableCell>
                      <div className="tooltip-wrapper">
                        Charge.
                        <Tooltip
                          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                          arrow
                        >
                          <IconButton>
                            <img src={info_ic} alt="info" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Max Amnt</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell align="center" width="190px">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.ChargeType}</TableCell>
                      <TableCell>{row.Currency}</TableCell>
                      <TableCell>{row.TranID}</TableCell>
                      <TableCell>{row.ChargeCount}</TableCell>
                      <TableCell>{row.TerminalType}</TableCell>
                      <TableCell>{row.Scheme}</TableCell>
                      <TableCell>{row.Freq}</TableCell>
                      <TableCell>{row.NoOfInst}</TableCell>
                      <TableCell>{row.Charge}</TableCell>
                      <TableCell>{row.Amount}</TableCell>
                      <TableCell>{row.MaxAmnt}</TableCell>
                      <TableCell>{row.StartDate}</TableCell>
                      <TableCell>{row.EndDate}</TableCell>
                      <TableCell align="center" width="190px">
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
        </main>
        <Dialog open={open} onClose={handleClose} className="c-dialog lg">
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  Non Activity Package Details Record definition
                </Typography>
                <p className="pb-0">Add a package details record</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label form-group">
                    <label className="lg">Charge Type</label>
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
                    <label className="center lg">Charge Count</label>
                    <FormControl fullWidth>
                      <RadioGroup
                        row
                        value={chargeValue}
                        onChange={chargeValueChange}
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
                    <label className="lg">Terminal type</label>
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
                    <label className="lg">Tran. ID</label>
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
                    <label className="lg">Currency</label>
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
                    <label className="lg">Frequency</label>
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
                    <label className="lg">
                      <div className="tooltip-wrapper">
                        Installments
                        <Tooltip
                          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                          arrow
                        >
                          <IconButton>
                            <img src={info_ic} alt="info" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter Numbers" fullWidth />
                    </FormControl>
                  </div>

                  <div className="input-with-label form-group mb-0">
                    <label className="center lg">
                      Charge First Transaction
                    </label>
                    <FormControl fullWidth>
                      <RadioGroup
                        row
                        value={chargeValue}
                        onChange={chargeValueChange}
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
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label form-group">
                    <label className="lg">Amount</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter Numbers" fullWidth />
                    </FormControl>
                  </div>
                  
                  <div className="input-with-label form-group">
                    <label className="lg">Max Amount</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter Date" fullWidth />
                    </FormControl>
                  </div>

                  <div className="input-with-label form-group">
                    <label className="lg">Start Date</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter date" fullWidth />
                    </FormControl>
                  </div>

                  <div className="input-with-label form-group mb-0">
                    <label className="lg">End Date</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter date" fullWidth />
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
              onClick={handleClose}
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

export default DesignerNonActivityFeesPackages;
