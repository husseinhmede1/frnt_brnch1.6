import { Button } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { blogging } from "../../assets/images";
import {
  getLocalStorage,
  LOCALSTORAGE_KEYS
} from "../../utils/helper";
import PendingActivities from "../PendingActivity";

function Dashboard() {
  const navigate = useNavigate();
  const intl = useIntl();
  const loginUser = JSON.parse(
    getLocalStorage(LOCALSTORAGE_KEYS.USER) as string
  );
  return (
    <>
      <div className="wrapper">
        <main className="main-content">
          <PendingActivities />
        </main>
      </div>
    </>
  );
}

export default Dashboard;
