import React from "react";
import Button from '@mui/material/Button';
import { down_arrow_icon } from "../../../assets/images";
import { FormControl, Grid, InputBase, MenuItem, Select, SelectChangeEvent, Switch, Typography } from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

function DesignerCardSchemeAdd() {
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
                <Typography variant={"h2"}>Card Scheme Definition</Typography>
                <p className="pb-0">Add or Update Card Scheme</p>
              </div>
            </div>
            <div className="inner-card">
              <Grid spacing={2} container>
                <Grid item xs={12} lg={6} xl={4}>
                  <div className="form-group input-with-label">
                    <label className="lg">Scheme Name*</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Write your name" error
                        fullWidth
                      />
                    </FormControl>
                  </div>
                  <div className="form-group input-with-label ">
                    <label className="lg">Scheme Specific*</label>
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
                  </div>
                  <div className="form-group input-with-label mb-0 center">
                    <label className="lg center">Enable/disable</label>
                    <Switch className="custom" />
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

export default DesignerCardSchemeAdd;
