import React from "react";
import Button from "@mui/material/Button";
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
} from "../../../assets/images";
import {
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
    PackageName: "01",
    Institution: " ",
  },
  {
    PackageName: "02",
    Institution: " ",
  },
  {
    PackageName: "03",
    Institution: " ",
  },
];
function DesignerActivityFeesPackagesList() {
  const [selectVal, setSelectVal] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectVal(event.target.value);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
                <Typography variant={"h2"}>Activity Fees Packages</Typography>
                <p className="pb-0">List of defined Activity Fees Packages</p>
              </div>
              <div className="right-block">
                <Button
                  variant="contained"
                  disableElevation
                  className="btn-light"
                  endIcon={<img src={add_rounded} alt="add" />}
                >
                  Add Package
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
                    <TableCell width="30%">Package Name</TableCell>
                    <TableCell width="70%">Institution</TableCell>
                    <TableCell align="center" width="190px">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell width="30%">{row.PackageName}</TableCell>
                      <TableCell width="70%">{row.Institution}</TableCell>
                      <TableCell align="center" width="190px">
                        <div className="action btns-block">
                          <Button
                            variant="contained"
                            disableElevation
                            className="btn-light sm rounded"
                            onClick={handleClickOpen}
                          >
                            Assign/UnAssign
                          </Button>
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
        <Dialog open={open} onClose={handleClose} className="c-dialog md">
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>Package Details</Typography>
                <p className="pb-0">Add a package details record</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card to-do-block">
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <div className="title">
                    All Entities
                    <FormGroup row className="checbox-grp">
                      <FormControlLabel
                        control={
                          <Checkbox
                            icon={<img src={ic_check} alt="" />}
                            checkedIcon={<img src={ic_checked} alt="" />}
                          />}
                        label="Select All" labelPlacement="start" />
                    </FormGroup>
                  </div>
                  <div className="to-do-card">
                    <ul>
                      <li className="to-do-check">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon={<img src={uncheck_rounded} alt="" />}
                              checkedIcon={<img src={check_rounded} alt="" />}
                            />}
                          label="Entity 01" labelPlacement="start" />
                      </li>
                      <li className="to-do-check">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon={<img src={uncheck_rounded} alt="" />}
                              checkedIcon={<img src={check_rounded} alt="" />}
                            />}
                          label="Entity 02" labelPlacement="start" />
                      </li>
                      <li className="to-do-check">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon={<img src={uncheck_rounded} alt="" />}
                              checkedIcon={<img src={check_rounded} alt="" />}
                            />}
                          label="Entity 03" labelPlacement="start" />
                      </li>
                      <li className="to-do-check">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon={<img src={uncheck_rounded} alt="" />}
                              checkedIcon={<img src={check_rounded} alt="" />}
                            />}
                          label="Entity 04" labelPlacement="start" />
                      </li>
                    </ul>
                  </div>
                </Grid>
                <Grid item xs={12} md={2}>
                  <div className="left-right-btns">
                  <IconButton className="border-icon-btn no-border primary">
                    <img src={ios_arrow_forward} alt="ios_arrow_forward" />
                  </IconButton>
                  <IconButton className="border-icon-btn no-border primary">
                    <img src={ios_arrow_backward} alt="ios_arrow_backward" />
                  </IconButton>
                  </div>
                </Grid>
                <Grid item xs={12} md={5}>
                <div className="title">
                    All Entities
                    <FormGroup row className="checbox-grp">
                      <FormControlLabel
                        control={
                          <Checkbox
                            icon={<img src={ic_check} alt="" />}
                            checkedIcon={<img src={ic_checked} alt="" />}
                          />}
                        label="Select All" labelPlacement="start" />
                    </FormGroup>
                  </div>
                  <div className="to-do-card right">
                    <ul>
                      <li className="to-do-check">
                        <FormControlLabel
                        className="check"
                          control={
<></>}
                          label="Entity 01" labelPlacement="start" />
                      </li>
                      <li className="to-do-check">
                        <FormControlLabel
                        className=""
                          control={
<></>}
                          label="Entity 02" labelPlacement="start" />
                      </li>
                    </ul>
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

export default DesignerActivityFeesPackagesList;
