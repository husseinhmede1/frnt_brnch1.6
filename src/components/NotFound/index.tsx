import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { notFound } from "../../assets/images";

function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <div className="main-card landing-block" >
            <em ><img src={notFound} alt="home" /></em>
            <h2>Page Not Found</h2>
            <Button variant="contained" disableElevation onClick={() => navigate("/dashboard")}>
              Go to Home
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}

export default NotFound;
