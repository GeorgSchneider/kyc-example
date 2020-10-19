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
import { CddRequest } from "@daml.js/ex-kyc-0.0.1/lib/Workflow";
import { InputDialog, InputDialogProps } from "../InputDialog";
import useStyles from "./styles";

export default function CDDRequests() {
  const classes = useStyles();
  const party = useParty();
  const ledger : Ledger = useLedger();
  const cddRequests = useStreamQuery(CddRequest).contracts;

  const toBool = (s : string) => {
    return s === "True" ? true : false;
  };

  const defaultCddProps : InputDialogProps<any> = {
    open: false,
    title: "Provide CIP",
    defaultValue: { ssn: "", tin: "", naic: "" },
    fields: {
      isUsPerson : {
        label: "Is US Person",
        type: "selection",
        items: [ "True", "False" ]
      },
      ofacCheck : {
        label: "OFAC Check",
        type: "selection",
        items: [ "True", "False" ]
      },
      sanctionsCheck : {
        label: "Sanctions Check",
        type: "selection",
        items: [ "True", "False" ]
      },
      criminalRecordCheck : {
        label: "Criminal Record Check",
        type: "selection",
        items: [ "True", "False" ]
      },
      mediaCheck : {
        label: "Media Check",
        type: "selection",
        items: [ "True", "False" ]
      }
    },
    onClose: async function() {}
  };
  const [ cddProps, setCddProps ] = useState(defaultCddProps);
  function showCdd(cddRequestCid : ContractId<CddRequest>) {
    async function onClose(state : any | null) {
      setCddProps({ ...defaultCddProps, open: false});
      if (!state) return;
      const args = {
        isUsPerson: toBool(state.isUsPerson),
        ofacCheck: toBool(state.ofacCheck),
        sanctionsCheck: toBool(state.sanctionsCheck),
        criminalRecordCheck: toBool(state.criminalRecordCheck),
        mediaCheck: toBool(state.mediaCheck),
      };
      await ledger.exercise(CddRequest.RespondCdd, cddRequestCid, args);
    };
    setCddProps({ ...defaultCddProps, open: true, onClose})
  };

  return (
    <>
      <InputDialog { ...cddProps } />
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
          {cddRequests.map(r => (
            <TableRow key={r.contractId} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.payload.clientData.name}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.payload.clientData.address}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.payload.clientData.city}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{r.payload.clientData.postalCode}</TableCell>
              <TableCell key={4} className={classes.tableCell}>{r.payload.clientData.country}</TableCell>
              <TableCell key={5} className={classes.tableCellButton}>
                <Button color="primary" size="small" className={classes.choiceButton} variant="contained" disabled={r.payload.provider !== party} onClick={() => showCdd(r.contractId)}>Respond</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
