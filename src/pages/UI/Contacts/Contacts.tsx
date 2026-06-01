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
  Typography,
} from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

const rows = [
  {
    ContactID: " ",
    FirstName: " ",
    MiddleName: " ",
    LastName: " ",
    ProfessionalTitle: " ",
    Phone: " ",
    Exponent: "-",
  },
  {
    ContactID: " ",
    FirstName: " ",
    MiddleName: " ",
    LastName: " ",
    ProfessionalTitle: " ",
    Phone: " ",
    Exponent: "-",
  },
  {
    ContactID: " ",
    FirstName: " ",
    MiddleName: " ",
    LastName: " ",
    ProfessionalTitle: " ",
    Phone: " ",
    Exponent: "-",
  },
];

function DesignerContacts() {
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
                <Typography variant={"h2"}>Contacts</Typography>
                <p className="pb-0">List of Entity Contacts</p>
              </div>
              <div className="right-block">
                <Button
                  variant="contained"
                  disableElevation
                  className="btn-light"
                  endIcon={<img src={add_rounded} alt="add" />}
                  onClick={handleClickOpen}
                >
                  Add Contact
                </Button>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Contact ID</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Middle Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Professional Title</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell align="center" width="190px">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.ContactID}</TableCell>
                      <TableCell>{row.FirstName}</TableCell>
                      <TableCell>{row.MiddleName}</TableCell>
                      <TableCell>{row.LastName}</TableCell>
                      <TableCell>{row.ProfessionalTitle}</TableCell>
                      <TableCell>{row.Phone}</TableCell>
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
                      <label className="lg">Professional Title*</label>
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
                          <MenuItem value={10}>India</MenuItem>
                          <MenuItem value={20}>Spain</MenuItem>
                          <MenuItem value={30}>France</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="input-with-label form-group">
                      <label className="lg">City</label>
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
                          <MenuItem value={10}>Delhi</MenuItem>
                          <MenuItem value={20}>Madrid</MenuItem>
                          <MenuItem value={30}>Paris</MenuItem>
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
                      <label className="lg">Phone 2*</label>
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

export default DesignerContacts;
