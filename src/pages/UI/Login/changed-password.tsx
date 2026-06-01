import React from "react";
import Button from '@mui/material/Button';
import { lockIcon, logo } from "../../../assets/images";
import { Card, CardContent, CardHeader, FormControl, FormGroup, IconButton, InputAdornment, InputBase, Typography } from "@mui/material";

function DesignerChangePass() {
  return (
    <section className="login-wrapper">
      {/* <a href="/designer/login" title="MDSL"  className="logo" >MAS Prime</a> */}
      <em className="logo"> <img src={logo} alt="Logo" /></em>
      <Card className="login-card change-pass">
        <CardHeader
          title="Change Password"
          subheader="Change your login Password"
          titleTypographyProps={{ variant: "h2", component: "h2" }}
          subheaderTypographyProps={{ variant: "h4", component: "h4" }}
        />
        <CardContent className="f-align-center">
          <div className="left">
            <FormGroup>
              <FormControl>
                <InputBase placeholder="Old Password"
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
          </div>
          <div className="password-info">
            <Typography variant="h5">Password Policy</Typography>
            <ul>
              <li>Minimum 8 Characters</li>
              <li>1 Lowercase</li>
              <li>1 uppercase</li>
              <li>1 number</li>
            </ul>
          </div>

          <Button disableElevation variant="contained" className="submit-btn">Update Password</Button>
        </CardContent>
      </Card>
    </section>
  );
}

export default DesignerChangePass;
