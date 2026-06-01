import React from "react";
import Button from '@mui/material/Button';
import { logo, userIcon } from "../../../assets/images";
import { Card, CardContent, CardHeader, FormControl, FormGroup, InputAdornment, InputBase } from "@mui/material";

function DesignerForgot() {
  return (
    <section className="login-wrapper">
    {/* <a href="/designer/login" title="MDSL"  className="logo" >MAS Prime</a> */}
    <em className="logo"> <img src={logo} alt="Logo" /></em>
      <Card className="login-card">
        <CardHeader
          title="Forgot Password"
          titleTypographyProps={{ variant: "h2", component: "h2" }}
          subheader="Please enter the email address"
          subheaderTypographyProps={{ variant: "h4", component: "h4" }}
        />
        <CardContent>
          <FormGroup>
            <FormControl>
              <InputBase placeholder="User Name" error
                fullWidth
                id="username"
                autoComplete="off"
                aria-describedby="error-helper-text"
                className="bg-primary"
                endAdornment={
                  <InputAdornment position="end">
                    <em>
                      <img src={userIcon} alt="user" />
                    </em>
                  </InputAdornment>
                }
              />
              {/* <FormHelperText id="error-helper-text" error>
                Incorrect entry.
              </FormHelperText> */}
            </FormControl>
          </FormGroup>
          <Button disableElevation variant="contained" className="submit-btn">Submit</Button>
        </CardContent>
      </Card>
    </section>
  );
}

export default DesignerForgot;
