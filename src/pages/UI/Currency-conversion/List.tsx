import React from "react";
import Button from "@mui/material/Button";
import {
  add_rounded,
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
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

const rows = [
  {
    Currency: "01253",
    BaseCurrency: "Dollar",
    RoundingRule: "No",
    RateExpression: "",
    MIDRateUsed: "",
  },
  {
    Currency: "01253",
    BaseCurrency: "Rupee",
    RoundingRule: "Trunk",
    RateExpression: "",
    MIDRateUsed: "",
  },
  {
    Currency: "01253",
    BaseCurrency: "Dirham",
    RoundingRule: "Down",
    RateExpression: "",
    MIDRateUsed: "",
  },
  {
    Currency: "01253",
    BaseCurrency: "Dollar",
    RoundingRule: "No",
    RateExpression: "",
    MIDRateUsed: "",
  },
];
function DesignerCurrencyConversion() {
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

  return (
    <>
      <div className="wrapper">
        <DesignerHeader />
        <DesignerSidebar />
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"}>Currency Conversion</Typography>
                <p className="pb-0">List of Conversions</p>
              </div>
              <div className="right-block">
                <Button
                  variant="contained"
                  disableElevation
                  className="btn-light"
                  endIcon={<img src={add_rounded} alt="add" />}
                  onClick={handleClickOpen}
                >
                  Add Currency Conversion
                </Button>
              </div>
            </div>
            <Grid spacing={3} container>
              <Grid item xs={12} lg={4} sm={6} xl={4}>
                <div className="input-with-label form-group">
                  <label>Institution</label>
                  <FormControl fullWidth>
                    <Select
                      value={selectVal}
                      onChange={handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      IconComponent={() => <img src={down_arrow_icon} alt="" />}
                    >
                      <MenuItem value="">
                        <em>Select Institution</em>
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
                    <TableCell>Currency</TableCell>
                    <TableCell>Base Currency</TableCell>
                    <TableCell>Rounding Rule</TableCell>
                    <TableCell>Rate Expression</TableCell>
                    <TableCell>MID Rate Used</TableCell>
                    <TableCell align="center" width="190px">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.Currency}</TableCell>
                      <TableCell>{row.BaseCurrency}</TableCell>
                      <TableCell>{row.RoundingRule}</TableCell>
                      <TableCell>{row.RateExpression}</TableCell>
                      <TableCell>{row.MIDRateUsed}</TableCell>
                      <TableCell align="center" width="190px">
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
        <Dialog open={open} onClose={handleClose} className="c-dialog">
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  Currency Conversion Definition
                </Typography>
                <p className="pb-0">Add Currency Conversion</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Institution*</label>
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
                          <em>Default Institution selected</em>
                        </MenuItem>
                        <MenuItem value={10}>Institution 1</MenuItem>
                        <MenuItem value={20}>Institution 2</MenuItem>
                        <MenuItem value={30}>Institution 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} className="p-0"></Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label className="lg">Currency*</label>
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
                  <div className="input-with-label ">
                    <label className="lg">Rounding Rule*</label>
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
                  <div className="input-with-label ">
                    <label className="lg">Base Currency*</label>
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
                  <div className="input-with-label ">
                    <label className="lg">Rate Expression*</label>
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
                  <div className="input-with-label ">
                    <label className="lg">MID Rate Used</label>
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

export default DesignerCurrencyConversion;
