import React from "react";
import Button from '@mui/material/Button';
import { blogging } from "../../../assets/images";
import DesignerHeader from "../Component/header";
import DesignerSidebar from "../Component/sidebar";

function DesignerLanding() {

  return (
    <>
      <div className="wrapper">
        <DesignerHeader />
        <DesignerSidebar />
        <main className="main-content" >
          <div className="main-card landing-block">
            <em><img src={blogging} alt="home" /></em>
            <h2>Welcome, Jose!</h2>
            <p>Get familiar with the dashboard, here are some ways to get started.</p>
            <Button variant="contained" disableElevation>Go to Home</Button>
          </div>
        </main >
      </div >
    </>
  );
}

export default DesignerLanding;
