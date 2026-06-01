import React from "react";
import Button from '@mui/material/Button';
import { down_arrow_icon } from "../../../assets/images";
import { FormControl, Grid, InputBase, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

function DesignerInstitutionAdd() {
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
              <div className="left-block mb-0">
                <Typography variant={"h2"}>Institutions Definition</Typography>
                <p className="pb-0">Add update Institution</p>
              </div>
            </div>
            <div className="inner-card">
              <Grid spacing={2} container>
                <Grid item xs={12} lg={6} xl={4}>
                  <div className="form-group input-with-label">
                    <label>Name</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your name" error
                        fullWidth
                      />
                      {/* <FormHelperText id="error-helper-text" error>
                        Incorrect entry.
                      </FormHelperText> */}
                    </FormControl>
                  </div>
                  <div className="form-group input-with-label">
                    <label>ALT Name</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your ALT name" error
                        fullWidth
                      />
                    </FormControl>
                  </div>
                  <div className="form-group input-with-label mb-0">
                    <label>Type</label>
                    <FormControl fullWidth >
                      <Select
                        value={selectVal}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        IconComponent={() => <img src={down_arrow_icon} alt="" />}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="btns-block right">
              <Button disableElevation variant="contained" color="secondary" className="sm">Cancel</Button>
              <Button disableElevation variant="contained">Save</Button>
            </div>
          </div>
        </main >
      </div >
    </>
  );
}

export default DesignerInstitutionAdd;
