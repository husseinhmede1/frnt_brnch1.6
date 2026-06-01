import React from "react";
import Button from '@mui/material/Button';
import { delete_ic, down_arrow_icon, edit_ic } from "../../../assets/images";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputBase, MenuItem, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

const rows = [
  { Code: 'Argentina', Name: 'Dollar', AlternateName: '', CodeALPHA2: '', CodeALPHA3: '', Currency: '', CurrencyPattern: '', DatePattern: '', EconomicAreaIND: '' },
  { Code: 'Russia', Name: 'Rupee', AlternateName: '', CodeALPHA2: '', CodeALPHA3: '', Currency: '', CurrencyPattern: '', DatePattern: '', EconomicAreaIND: '' },
  { Code: 'Belgium', Name: 'Dirham', AlternateName: '', CodeALPHA2: '', CodeALPHA3: '', Currency: '', CurrencyPattern: '', DatePattern: '', EconomicAreaIND: '' },
]
function DesignerManageCountry() {

  const [open, setOpen] = React.useState(false);

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
              <div className="left-block mb-0">
                <Typography variant={"h2"}>Countries</Typography>
                <p className="pb-0">List of Countries</p>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Alternate Name</TableCell>
                    <TableCell>Code ALPHA 2</TableCell>
                    <TableCell>Code ALPHA 3</TableCell>
                    <TableCell>Currency</TableCell>
                    <TableCell>Currency Pattern</TableCell>
                    <TableCell>Date Pattern</TableCell>
                    <TableCell>Economic Area IND</TableCell>
                    <TableCell align="center" width="190px">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      key={i}
                    >
                      <TableCell>{row.Code}</TableCell>
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>{row.AlternateName}</TableCell>
                      <TableCell>{row.CodeALPHA2}</TableCell>
                      <TableCell>{row.CodeALPHA3}</TableCell>
                      <TableCell>{row.Currency}</TableCell>
                      <TableCell>{row.CurrencyPattern}</TableCell>
                      <TableCell>{row.DatePattern}</TableCell>
                      <TableCell>{row.EconomicAreaIND}</TableCell>
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
                    <label>Card Scheme</label>
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
                    <label>Merchant Type</label>
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
                    <label>MCC</label>
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
                    <label>Description</label>
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

export default DesignerManageCountry;
