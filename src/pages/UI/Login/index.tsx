import React from "react";
import Button from '@mui/material/Button';
import { lockIcon, logo, userIcon } from "../../../assets/images";
import { Card, CardContent, CardHeader, FormControl, FormGroup, IconButton, InputAdornment, InputBase } from "@mui/material";

function DesignerLogin() {
  return (
    <section className="login-wrapper">
      {/* <a href="/designer/login" title="MDSL"  className="logo" >MAS Prime</a> */}
      <em className="logo"> <img src={logo} alt="Logo" /></em>
      <Card className="login-card">
        <CardHeader 
          title="Sign In"
          subheader="To your Account to manage Customer Cards"
          titleTypographyProps={{ variant: "h2", component: "h2" }}
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
          <FormGroup className="mb-0">
            <FormControl>
              <InputBase placeholder="Password"
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
            <a href="/designer/forgot" title="Forgot Password">Forgot Password?</a>
          </div>
          <Button disableElevation variant="contained" className="submit-btn">Submit</Button>
        </CardContent>
      </Card>
    </section>
  );
}

export default DesignerLogin;
