import React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { History, Location } from "history";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListIcon from "@material-ui/icons/List";
import useStyles from "./styles";
import { useParty } from "@daml/react";

type SidebarLinkProps = {
  path : string
  icon : JSX.Element
  label : string
  location : Location<History.PoorMansUnknown>
}

const Sidebar = ({ location } : RouteComponentProps) => {
  const classes = useStyles();
  const party = useParty();
  const isProvider = party === "Provider1" || party === "Provider2";

  return (
    <Drawer open variant="permanent" className={classes.drawer} classes={{ paper: classes.drawer }}>
      <div className={classes.toolbar} />
      <List style={{ width: "100%" }}>
        { !isProvider && <SidebarLink key={0} label="KYC Requests" path="/app/kycrequests" icon={(<ListIcon />)} location={location} /> }
        { !isProvider && <SidebarLink key={1} label="KYC Records" path="/app/kycrecords" icon={(<ListIcon />)} location={location} /> }
        { party === "Provider1" && <SidebarLink key={2} label="CIP Requests" path="/app/ciprequests" icon={(<ListIcon />)} location={location} /> }
        { party === "Provider2" && <SidebarLink key={3} label="CDD Requests" path="/app/cddrequests" icon={(<ListIcon />)} location={location} /> }
      </List>
    </Drawer>
  );
};

const SidebarLink = ({ path, icon, label, location } : SidebarLinkProps) => {
  const classes = useStyles();
  const active = path && (location.pathname === path || location.pathname.indexOf(path) !== -1);

  return (
    <ListItem button component={Link} to={path} className={classes.link} classes={{ root: active ? classes.linkActive : classes.linkRoot }} disableRipple>
      <ListItemIcon className={active ? classes.linkIconActive : classes.linkIcon}>{icon}</ListItemIcon>
      <ListItemText classes={{ primary: active ? classes.linkTextActive : classes.linkText }} primary={label} />
    </ListItem>
  );
}

export default withRouter(Sidebar);
