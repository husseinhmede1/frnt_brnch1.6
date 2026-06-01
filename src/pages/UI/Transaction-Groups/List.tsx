import React from "react";
import Button from '@mui/material/Button';
import { add_rounded, delete_ic, down_arrow_icon, edit_ic } from "../../../assets/images";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputBase, MenuItem, Select, SelectChangeEvent, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

const rows = [
  { ID: '2658646131', Name: 'toretto' },
  { ID: '6448948948', Name: 'toretto' },
  { ID: '6165498498', Name: 'toretto' },
]

const popupData = [
  { TransactionId: '1001', Description: 'PURCHASE' },
  { TransactionId: '', Description: '' },
]

function DesignerTransactionGrp() {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [selectVal, setSelectVal] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectVal(event.target.value);
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
                <Typography variant={"h2"}>Transaction Groups</Typography>
                <p className="pb-0">List of transaction groups</p>
              </div>
              <div className="right-block">
                <Button variant="contained" disableElevation className="btn-light" endIcon={<img src={add_rounded} alt="add" />} onClick={handleClickOpen}>
                  Add Group
                </Button>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell width="30%">ID</TableCell>
                    <TableCell width="70%">Name</TableCell>
                    <TableCell align="center" width="190px">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      key={i}
                    >
                      <TableCell>
                        {row.ID}
                      </TableCell>
                      <TableCell>{row.Name}</TableCell>
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
          className="c-dialog md"
        >
          <form>
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>Transaction Group Definition</Typography>
                <p className="pb-0">Add or Update Transaction group</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12} lg={7}>
                  <div className="input-with-label">
                    <label>Name*</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your name" error
                        fullWidth
                      />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} lg={5}>
                  <div className="input-with-label mb-0 center">
                    <label className="center">Enable/disable</label>
                    <Switch className="custom" />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label className="base">Description</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your name" error
                        fullWidth
                        multiline
                        rows={3}
                      />
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"} className="pb-0">Charge Details</Typography>
              </div>
              <div className="right-block mb-0">
                <Button endIcon={<img src={add_rounded} alt="add" />} className="link"> Add Transaction</Button>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell width="30%">Transaction Id</TableCell>
                    <TableCell width="70%">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {popupData.map((row, i) => (
                    <TableRow
                      key={i}
                    >
                      <TableCell>
                        {row.TransactionId === "" ?
                          <FormControl fullWidth >
                            <Select
                              value={selectVal}
                              onChange={handleChange}
                              displayEmpty
                              inputProps={{ 'aria-label': 'Without label' }}
                              IconComponent={() => <img src={down_arrow_icon} alt="" />}
                            >
                              <MenuItem value="">
                                <em>Select</em>
                              </MenuItem>
                              <MenuItem value={10}>Ten</MenuItem>
                              <MenuItem value={20}>Twenty</MenuItem>
                              <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                          </FormControl>
                          : row.TransactionId
                        }
                      </TableCell>
                      <TableCell>{row.Description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions className="btns-block right">
            <Button disableElevation variant="contained" color="secondary" className="sm" onClick={handleClose}>Cancel</Button>
            <Button disableElevation variant="contained">Save</Button>
          </DialogActions>
          </form>
        </Dialog>
      </div >
    </>
  );
}

export default DesignerTransactionGrp;
