import React from "react";
import { useStreamQuery } from "@daml/react";
import { Typography, Grid, Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { RouteComponentProps, useParams, withRouter } from "react-router-dom";
import { KYCRecord as KYCRecordContract } from "@daml.js/ex-kyc-0.0.1/lib/Workflow";
import useStyles from "./styles";

const KYCRecord : React.FC<RouteComponentProps> = ({ history } : RouteComponentProps) => {
  const classes = useStyles();

  const params = useParams() as any;
  const cid = params.contractId.replace("_", "#");

  const kycRecord = useStreamQuery(KYCRecordContract).contracts.find(r => r.contractId === cid);

  if (!kycRecord) return (null);

  return (
    <>
      <Grid container direction="column" spacing={8}>
        <Grid item xs={12}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3" className={classes.heading}>Client Data</Typography>
            </Grid>
            <Grid item xs={12}>
              <Table size="small">
                <TableBody>
                  <TableRow key={0} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Name</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.clientData.name}</TableCell>
                  </TableRow>
                  <TableRow key={1} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Address</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.clientData.address}</TableCell>
                  </TableRow>
                  <TableRow key={2} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>City</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.clientData.city}</TableCell>
                  </TableRow>
                  <TableRow key={3} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Postal Code</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.clientData.postalCode}</TableCell>
                  </TableRow>
                  <TableRow key={4} className={classes.tableRow}>
                    <TableCell key={0} className={classes.tableCell}><b>Country</b></TableCell>
                    <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.clientData.country}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row" spacing={4}>
            <Grid item xs={6}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h3" className={classes.heading}>CIP Data</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Table size="small">
                    <TableBody>
                      <TableRow key={0} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>SSN</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.cipData.ssn}</TableCell>
                      </TableRow>
                      <TableRow key={1} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>TIN</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.cipData.tin}</TableCell>
                      </TableRow>
                      <TableRow key={2} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>NAIC</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.cipData.naic}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h3" className={classes.heading}>CDD Data</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Table size="small">
                    <TableBody>
                      <TableRow key={0} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Is US Person</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.cddData.isUsPerson.toString()}</TableCell>
                      </TableRow>
                      <TableRow key={1} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>OFAC Check</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.cddData.ofacCheck.toString()}</TableCell>
                      </TableRow>
                      <TableRow key={2} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Sactions Check</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.cddData.sanctionsCheck.toString()}</TableCell>
                      </TableRow>
                      <TableRow key={3} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Criminal Record Check</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.cddData.criminalRecordCheck.toString()}</TableCell>
                      </TableRow>
                      <TableRow key={4} className={classes.tableRow}>
                        <TableCell key={0} className={classes.tableCell}><b>Media Check</b></TableCell>
                        <TableCell key={1} className={classes.tableCell}>{kycRecord.payload.cddData.mediaCheck.toString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default withRouter(KYCRecord);