import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { notFound, unauthorised } from "../../assets/images";

function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <div className="main-card landing-block" >
            <h2 style={{fontSize:"50px"}}>OOPS!</h2>
            <p style={{fontWeight:"500"}}>You don't have permission to view this area.</p>
            <em ><img src={unauthorised} alt="home" /></em>
            <Button sx={{mt:"20px"}} variant="contained" disableElevation onClick={() => navigate("/dashboard")}>
              Go to Home
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}

export default NotFound;