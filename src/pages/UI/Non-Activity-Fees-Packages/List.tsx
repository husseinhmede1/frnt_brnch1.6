import React from "react";
import Button from "@mui/material/Button";
import {
  add_rounded,
  delete_ic,
  down_arrow_icon,
  edit_ic,
} from "../../../assets/images";
import {
  FormControl,
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
    PackageName: " ",
    Institution: " ",
  },
  {
    PackageName: " ",
    Institution: " ",
  },
  {
    PackageName: " ",
    Institution: " ",
  },
];

function DesignerNonActivityFeesPackageDefinitionList() {
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
                <Typography variant={"h2"}>
                  Non Activity Fees Packages
                </Typography>
                <p className="pb-0">List of defined Non Activity Fees Packages</p>
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
              <Grid item xs={12} sm={6} lg={4} xl={4}>
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
            <div className="form-group">
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

            <div className="btns-block right">
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                className="sm"
              >
                Cancel
              </Button>
              <Button disableElevation variant="contained">
                Save
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default DesignerNonActivityFeesPackageDefinitionList;
