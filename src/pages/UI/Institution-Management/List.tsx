import React from "react";
import Button from '@mui/material/Button';
import { add_rounded, delete_ic, edit_ic } from "../../../assets/images";
import { IconButton, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

const rows = [
  { InstitutionID: '01', Name: '', AltName: '', Type: '' },
  { InstitutionID: '02', Name: '', AltName: '', Type: '' },
  { InstitutionID: '03', Name: '', AltName: '', Type: '' },
]
function DesignerInstitutionList() {
  return (
    <>
      <div className="wrapper">
        <DesignerHeader />
        <DesignerSidebar />
        <main className="main-content" >
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"}>Institutions</Typography>
                <p className="pb-0">View or edit the list of defined institutions</p>
              </div>
              <div className="right-block">
                <Button variant="contained" disableElevation className="btn-light" endIcon={<img src={add_rounded} alt="add" />}>
                  Add Institution
                </Button>
              </div>
            </div>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Institution ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Alt Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="center" width="190px">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      key={i}
                    >
                      <TableCell>
                        {row.InstitutionID}
                      </TableCell>
                      <TableCell>{row.Name}</TableCell>
                      <TableCell>{row.AltName}</TableCell>
                      <TableCell>{row.Type}</TableCell>
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
      </div >
    </>
  );
}

export default DesignerInstitutionList;
