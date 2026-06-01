import React from "react";
import Button from '@mui/material/Button';
import { add_rounded, clone_ic, delete_ic, down_arrow_icon, edit_ic, search_ic } from "../../../assets/images";
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputBase, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

const rows = [
  { EntityName: '', DBAName: '', BusinessType: '', EntityLevel: '', Parent: '', BankCode: '', ContractDate: '', Status: '', Onhold: '', Hot: '' },
]
function DesignerEntities() {

  const [openCloneModal, setCloneModalOpen] = React.useState(false);

  const cloneModalOpen = () => {
    setCloneModalOpen(true);
  };
  const cloneModalClose = () => {
    setCloneModalOpen(false);
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
                <Typography variant={"h2"} className="pb-0">Entities</Typography>
              </div>
              <div className="right-block">
                <FormControl>
                  <InputBase placeholder="Search"
                    fullWidth
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton>
                          <img src={search_ic} alt="lock" />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Button variant="contained" disableElevation color="secondary" className="btn-light" endIcon={<img src={clone_ic} alt="clone" />} onClick={cloneModalOpen}>
                  Clone Entity
                </Button>
                <Button variant="contained" disableElevation className="btn-light" endIcon={<img src={add_rounded} alt="add" />}>
                  Add Entity
                </Button>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Entity Name</TableCell>
                    <TableCell>DBA Name</TableCell>
                    <TableCell>Business Type</TableCell>
                    <TableCell>Entity Level</TableCell>
                    <TableCell>Parent</TableCell>
                    <TableCell>Bank Code</TableCell>
                    <TableCell>Contract Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>On hold</TableCell>
                    <TableCell>Hot</TableCell>
                    <TableCell align="center" width="190px">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      key={i}
                    >
                      <TableCell>{row.EntityName}</TableCell>
                      <TableCell>{row.DBAName}</TableCell>
                      <TableCell>{row.BusinessType}</TableCell>
                      <TableCell>{row.EntityLevel}</TableCell>
                      <TableCell>{row.Parent}</TableCell>
                      <TableCell>{row.BankCode}</TableCell>
                      <TableCell>{row.ContractDate}</TableCell>
                      <TableCell>{row.Status}</TableCell>
                      <TableCell>{row.Onhold}</TableCell>
                      <TableCell>{row.Hot}</TableCell>
                      <TableCell align="center" width="190px">
                        <div className="action btns-block">
                          <IconButton className="border-icon-btn no-border sm">
                            <img src={edit_ic} alt="edit" />
                          </IconButton>
                          <IconButton className="border-icon-btn no-border sm">
                            <img src={delete_ic} alt="delete" />
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
        <Dialog open={openCloneModal} onClose={cloneModalClose} className="c-dialog sm">
          <DialogTitle component={"div"}>
            <div className="title-block mb-0">
              <div className="left-block mb-0">
                <Typography variant={"h2"}>
                  Clone Entity
                </Typography>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="inner-card mb-0">
              <Grid spacing={3} container>
                <Grid item xs={12}>
                  <div className="input-with-label">
                    <label>Entity name</label>
                    <FormControl fullWidth>
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
              </Grid>
            </div>
          </DialogContent>
          <DialogActions className="btns-block right">
            <Button
              disableElevation
              variant="contained"
              color="secondary"
              className="sm"
              onClick={cloneModalClose}
            >
              Cancel
            </Button>
            <Button disableElevation variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div >
    </>
  );
}

export default DesignerEntities;
