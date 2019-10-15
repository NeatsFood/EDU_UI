import React from 'react';
import { withCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

function profile() {

  return (
    <div className="container-fluid p-0 m-0">
      <div className="row align-items-center mt-5">
        <div className="col-3 mx-auto my-auto">
          <h3><FontAwesomeIcon icon={faExclamationTriangle} /> Coming Soon</h3>
        </div>
      </div>

    </div>
  );
}

export default withCookies(profile);
