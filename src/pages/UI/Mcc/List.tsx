import React from "react";
import Button from '@mui/material/Button';
import { add_rounded, delete_ic, down_arrow_icon, edit_ic } from "../../../assets/images";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputBase, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

const rows = [
  { CardScheme: '', MCC: '', MerchantType: 'Medical', Description: '' },
  { CardScheme: '', MCC: '', MerchantType: 'Legal', Description: '' },
  { CardScheme: '', MCC: '', MerchantType: 'Legal', Description: '' },
]
function DesignerMcc() {

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
        <main className="main-content" >
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"}>MCC List</Typography>
                <p className="pb-0">List of defined MCCs</p>
              </div>
              <div className="right-block">
                <Button variant="contained" disableElevation className="btn-light" endIcon={<img src={add_rounded} alt="add" />} onClick={handleClickOpen}>
                  Add MCC
                </Button>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Card Scheme</TableCell>
                    <TableCell>MCC</TableCell>
                    <TableCell>Merchant Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center" width="190px">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      key={i}
                    >
                      <TableCell>{row.CardScheme}</TableCell>
                      <TableCell>{row.MCC}</TableCell>
                      <TableCell>{row.MerchantType}</TableCell>
                      <TableCell>{row.Description}</TableCell>
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
        </main >
        <Dialog
          open={open}
          onClose={handleClose}
          className="c-dialog"
        >
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>MCC Defintion</Typography>
                <p className="pb-0">Add or Update MCC</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label ">
                    <label>Card Scheme*</label>
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
                <Grid item xs={12} md={6}>
                  <div className="input-with-label ">
                    <label>Merchant Type*</label>
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
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label>MCC*</label>
                    <FormControl fullWidth>
                      <InputBase error
                        fullWidth
                        placeholder="Write your MCC"
                      />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="input-with-label">
                    <label>Description*</label>
                    <FormControl fullWidth>
                      <InputBase error
                        fullWidth
                        placeholder="Write your description"
                      />
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions className="btns-block right">
            <Button disableElevation variant="contained" color="secondary" className="sm" onClick={handleClose}>Cancel</Button>
            <Button disableElevation variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </div >
    </>
  );
}

export default DesignerMcc;
