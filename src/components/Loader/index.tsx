import React from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

const Loader = () => {
  return (
    <div id="loading" className={"loading spinner-disable"}>
      <div className="custom-loader">
        <PropagateLoader color="#F08557" />
      </div>
    </div>
  );
};

export default Loader;
