import React from "react";
import Button from '@mui/material/Button';
import { add_rounded, delete_ic, edit_ic } from "../../../assets/images";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputBase, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

const rows = [
  { CurrencyCode: '01253', CurrencyName: 'Dollar', CodeALPHA2: ' ', TCodeALPHA3: ' ', Exponent: ' ' },
  { CurrencyCode: '01253', CurrencyName: 'Rupee', CodeALPHA2: ' ', TCodeALPHA3: ' ', Exponent: ' ' },
  { CurrencyCode: '01253', CurrencyName: 'Dirham', CodeALPHA2: ' ', TCodeALPHA3: ' ', Exponent: ' ' },
]
function DesignerCurrencyList() {

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
                <Typography variant={"h2"}>Currency</Typography>
                <p className="pb-0">List of  Currencies</p>
              </div>
              <div className="right-block">
                <Button variant="contained" disableElevation className="btn-light" endIcon={<img src={add_rounded} alt="add" />} onClick={handleClickOpen}>
                  Add Currency
                </Button>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Currency Code</TableCell>
                    <TableCell>Currency Name</TableCell>
                    <TableCell>Code ALPHA 2</TableCell>
                    <TableCell>TCode ALPHA 3</TableCell>
                    <TableCell>Exponent</TableCell>
                    <TableCell align="center" width="190px">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      key={i}
                    >
                      <TableCell>
                        {row.CurrencyCode}
                      </TableCell>
                      <TableCell>{row.CurrencyName}</TableCell>
                      <TableCell>{row.CodeALPHA2}</TableCell>
                      <TableCell>{row.TCodeALPHA3}</TableCell>
                      <TableCell>{row.Exponent}</TableCell>
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
                <Typography variant={"h2"}>Currency Definition</Typography>
                <p className="pb-0">Add or Update currency</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12} lg={6}>
                  <div className="input-with-label">
                    <label>Currency Code*</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your code" error
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <div className="input-with-label">
                    <label>Name*</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your name" error
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <div className="input-with-label">
                    <label>Code ALPHA 2</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your code" error
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <div className="input-with-label">
                    <label>Code ALPHA 3</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your code" error
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <div className="input-with-label">
                    <label>Exponent</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your exponent" error
                        fullWidth
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

export default DesignerCurrencyList;
