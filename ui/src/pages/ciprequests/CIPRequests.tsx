import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import Ledger from "@daml/ledger";
import { useStreamQuery, useLedger, useParty } from "@daml/react";
import { ContractId } from "@daml/types";
import { CipRequest } from "@daml.js/ex-kyc-0.0.1/lib/Workflow";
import { InputDialog, InputDialogProps } from "../InputDialog";
import useStyles from "./styles";

export default function CIPRequests() {
  const classes = useStyles();
  const party = useParty();
  const ledger : Ledger = useLedger();
  const cipRequests = useStreamQuery(CipRequest).contracts;

  const defaultCipProps : InputDialogProps<any> = {
    open: false,
    title: "Provide CIP",
    defaultValue: { ssn: "", tin: "", naic: "" },
    fields: {
      ssn : {
        label: "SSN",
        type: "text"
      },
      tin : {
        label: "TIN",
        type: "text"
      },
      naic : {
        label: "NAIC",
        type: "text"
      },
    },
    onClose: async function() {}
  };
  const [ cipProps, setCipProps ] = useState(defaultCipProps);
  function showCip(cipRequestCid : ContractId<CipRequest>) {
    async function onClose(state : any | null) {
      setCipProps({ ...defaultCipProps, open: false});
      if (!state) return;
      await ledger.exercise(CipRequest.RespondCip, cipRequestCid, state);
    };
    setCipProps({ ...defaultCipProps, open: true, onClose})
  };

  return (
    <>
      <InputDialog { ...cipProps } />
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Name</TableCell>
            <TableCell key={1} className={classes.tableCell}>Address</TableCell>
            <TableCell key={2} className={classes.tableCell}>City</TableCell>
            <TableCell key={3} className={classes.tableCell}>PostalCode</TableCell>
            <TableCell key={4} className={classes.tableCell}>Country</TableCell>
            <TableCell key={5} className={classes.tableCell}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cipRequests.map(r => (
            <TableRow key={r.contractId} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.payload.clientData.name}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.payload.clientData.address}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.payload.clientData.city}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{r.payload.clientData.postalCode}</TableCell>
              <TableCell key={4} className={classes.tableCell}>{r.payload.clientData.country}</TableCell>
              <TableCell key={5} className={classes.tableCellButton}>
                <Button color="primary" size="small" className={classes.choiceButton} variant="contained" disabled={r.payload.provider !== party} onClick={() => showCip(r.contractId)}>Respond</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
