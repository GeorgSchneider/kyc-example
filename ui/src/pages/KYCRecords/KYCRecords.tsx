import React from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { useStreamQuery } from "@daml/react";
import { KYCRecord } from "@daml.js/ex-kyc-0.0.1/lib/Workflow";
import useStyles from "./styles";
import { KeyboardArrowRight } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";

const KYCRecords : React.FC<RouteComponentProps> = ({ history } : RouteComponentProps) => {
  const classes = useStyles();
  const kycRecords = useStreamQuery(KYCRecord).contracts;

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Name</TableCell>
            <TableCell key={1} className={classes.tableCell}>Address</TableCell>
            <TableCell key={2} className={classes.tableCell}>City</TableCell>
            <TableCell key={3} className={classes.tableCell}>PostalCode</TableCell>
            <TableCell key={4} className={classes.tableCell}>Country</TableCell>
            <TableCell key={7} className={classes.tableCell}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {kycRecords.map(r => (
            <TableRow key={r.contractId} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.payload.clientData.name}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.payload.clientData.address}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.payload.clientData.city}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{r.payload.clientData.postalCode}</TableCell>
              <TableCell key={4} className={classes.tableCell}>{r.payload.clientData.country}</TableCell>
              <TableCell key={5} className={classes.tableCellButton}>
                <IconButton color="secondary" size="small" component="span" onClick={() => history.push("/app/kycrecords/kycrecord/" + r.contractId.replace("#", "_"))}>
                  <KeyboardArrowRight fontSize="small"/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default withRouter(KYCRecords);
