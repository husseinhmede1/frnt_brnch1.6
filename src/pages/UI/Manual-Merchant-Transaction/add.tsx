import React from "react";
import Button from "@mui/material/Button";
import { date_ic, down_arrow_icon } from "../../../assets/images";
import {
  FormControl,
  FormControlLabel,
  Grid,
  InputBase,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function DesignerManualMerchantTransactionAdd() {
  const [selectVal, setSelectVal] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectVal(event.target.value);
  };

  const [value, setValue] = React.useState<Date | null>(null);

  return (
    <>
      <div className="wrapper">
        <DesignerHeader />
        <DesignerSidebar />
        <main className="main-content">
          <div className="main-card">
            <div className="title-block">
              <div className="left-block">
                <Typography variant={"h2"} className="pb-0">
                  Manual Merchant Transaction
                </Typography>
              </div>
            </div>
            <div className="input-elements">
              <Grid spacing={3} container>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      Entity/Outlet<span className="required-field">*</span>
                    </label>
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
                        <MenuItem value={10}>Select 1</MenuItem>
                        <MenuItem value={20}>Select 2</MenuItem>
                        <MenuItem value={30}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className="input-with-label">
                    <label className="lg">
                      Terminal ID<span className="required-field">*</span>
                    </label>
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
                        <MenuItem value={10}>Select 1</MenuItem>
                        <MenuItem value={20}>Select 2</MenuItem>
                        <MenuItem value={30}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label form-group">
                    <label className="lg">
                      Card Number<span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter card number" fullWidth />
                    </FormControl>
                  </div>

                  <div className="input-with-label">
                    <label className="lg">Card Sequence</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter sequence" fullWidth />
                    </FormControl>
                  </div>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label date-select-input">
                    <label className="lg">Expiry date</label>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={value}
                          onChange={(newValue) => {
                            setValue(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          components={{
                            OpenPickerIcon: () => {
                              return <img src={date_ic} alt="date" />;
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </div>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label className="lg">
                      Transaction ID<span className="required-field">*</span>
                    </label>
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
                        <MenuItem value={10}>Select 1</MenuItem>
                        <MenuItem value={20}>Select 2</MenuItem>
                        <MenuItem value={30}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label date-select-input">
                    <label className="lg">
                      Transaction Date<span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={value}
                          onChange={(newValue) => {
                            setValue(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                          components={{
                            OpenPickerIcon: () => {
                              return <img src={date_ic} alt="date" />;
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label className="lg">Authorization Number</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter Authorization Number" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label className="lg">
                      Transaction Amount
                      <span className="required-field">*</span>
                    </label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter amount" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label className="lg">
                      Currency<span className="required-field">*</span>
                    </label>
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
                        <MenuItem value={10}>Select 1</MenuItem>
                        <MenuItem value={20}>Select 2</MenuItem>
                        <MenuItem value={30}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label className="lg">Reverse flag</label>
                    <FormControl fullWidth>
                      <RadioGroup row>
                        <FormControlLabel
                          value="yes"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="no"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label className="lg">Tips Amount</label>
                    <FormControl fullWidth>
                      <InputBase placeholder="Enter amount" fullWidth />
                    </FormControl>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label className="lg">Tips Currency</label>
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
                        <MenuItem value={10}>Select 1</MenuItem>
                        <MenuItem value={20}>Select 2</MenuItem>
                        <MenuItem value={30}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  sx={{ display: { xs: "none", md: "block" } }}
                ></Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <div className="input-with-label">
                    <label className="lg">Reason</label>
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
                        <MenuItem value={10}>Select 1</MenuItem>
                        <MenuItem value={20}>Select 2</MenuItem>
                        <MenuItem value={30}>Select 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  sx={{ display: { xs: "none", md: "block" } }}
                ></Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  sx={{ display: { xs: "none", md: "block" } }}
                ></Grid>
                <Grid item xs={12} md={6} lg={8}>
                  <div className="input-with-label">
                    <label className="lg">Description</label>
                    <FormControl fullWidth>
                      <TextareaAutosize minRows={2} />
                    </FormControl>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  sx={{ display: { xs: "none", md: "block" } }}
                ></Grid>
              </Grid>
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
              <Button disableElevation variant="contained">
                Save and Add New
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default DesignerManualMerchantTransactionAdd;
