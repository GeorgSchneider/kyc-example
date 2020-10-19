import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import DamlLedger from "@daml/react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useUserState } from "../../context/UserContext";
import { wsBaseUrl, httpBaseUrl } from "../../config";
import useStyles from "./styles";
import KYCRequests from "../../pages/kycrequests/KYCRequests";
import CIPRequests from "../../pages/ciprequests/CIPRequests";
import CDDRequests from "../../pages/cddrequests/CDDRequests";
import KYCRecords from "../../pages/KYCRecords/KYCRecords";
import KYCRecord from "../../pages/KYCRecords/KYCRecord";

const Layout = () => {
  const classes = useStyles();
  const user = useUserState();

  if(!user.isAuthenticated){
    return null;
  } else {
    return (
      <DamlLedger party={user.party} token={user.token} httpBaseUrl={httpBaseUrl} wsBaseUrl={wsBaseUrl}>
        <div className={classes.root}>
            <>
              <Header />
              <Sidebar />
              <div className={classes.content}>
                <div className={classes.fakeToolbar} />
                <Switch>
                  <Route path="/app/kycrequests" component={KYCRequests} />
                  <Route path="/app/ciprequests" component={CIPRequests} />
                  <Route path="/app/cddrequests" component={CDDRequests} />
                  <Route exact path="/app/kycrecords/kycrecord/:contractId" component={KYCRecord} />
                  <Route path="/app/kycrecords" component={KYCRecords} />
                </Switch>
              </div>
            </>
        </div>
      </DamlLedger>
    );
  }
}

export default withRouter(Layout);
