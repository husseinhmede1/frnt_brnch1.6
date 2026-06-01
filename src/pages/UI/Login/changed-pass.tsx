import React from "react";
import Button from '@mui/material/Button';
import { lockIcon, logo } from "../../../assets/images";
import { Card, CardContent, CardHeader, FormControl, FormGroup, IconButton, InputAdornment, InputBase } from "@mui/material";

function DesignerReset() {
  return (
    <section className="login-wrapper">
      {/* <a href="/designer/login" title="MDSL"  className="logo" >MAS Prime</a> */}
      <em className="logo"> <img src={logo} alt="Logo" /></em>
      <Card className="login-card">
        <CardHeader
          title="Reset Password"
          subheader="To your account password will be reset"
          titleTypographyProps={{ variant: "h2", component: "h2" }}
          subheaderTypographyProps={{ variant: "h4", component: "h4" }}
        />
        <CardContent>
          <FormGroup>
            <FormControl>
              <InputBase placeholder="New Password"
                fullWidth
                id="password"
                type="password"
                autoComplete="off"
                className="bg-primary"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton>
                      <img src={lockIcon} alt="lock" />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </FormGroup>
          <FormGroup>
            <FormControl>
              <InputBase placeholder="Confirm Password"
                fullWidth
                id="password"
                type="password"
                autoComplete="off"
                className="bg-primary"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton>
                      <img src={lockIcon} alt="lock" />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </FormGroup>
          <div className="default-link">
            <a href="/designer/login" title="Forgot Password">Sign in?</a>
          </div>
          <Button disableElevation variant="contained" className="submit-btn">Submit</Button>
        </CardContent>
      </Card>
    </section>
  );
}

export default DesignerReset;
