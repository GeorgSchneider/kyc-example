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
import { KYCRequest, ClientData, RequestCip, RequestCdd, CipResponse, CipRequest, CddRequest, CddResponse } from "@daml.js/ex-kyc-0.0.1/lib/Workflow";
import { InputDialog, InputDialogProps } from "../InputDialog";
import useStyles from "./styles";
import { CheckCircle, HelpOutline } from "@material-ui/icons";

export default function KYCRequests() {
  const classes = useStyles();
  const party = useParty();
  const ledger : Ledger = useLedger();
  const kycRequests = useStreamQuery(KYCRequest).contracts;
  const cipRequests = useStreamQuery(CipRequest).contracts;
  const cipResponses = useStreamQuery(CipResponse).contracts;
  const cddRequests = useStreamQuery(CddRequest).contracts;
  const cddResponses = useStreamQuery(CddResponse).contracts;

  const entries = kycRequests.map(kyc => {
    return {
      kycRequest: kyc,
      cipRequest: cipRequests.find(r => r.payload.clientData.name === kyc.payload.clientData.name),
      cipResponse: cipResponses.find(r => r.payload.clientData.name === kyc.payload.clientData.name),
      cddRequest: cddRequests.find(r => r.payload.clientData.name === kyc.payload.clientData.name),
      cddResponse: cddResponses.find(r => r.payload.clientData.name === kyc.payload.clientData.name)
    }
  });

  const defaultCipProps : InputDialogProps<RequestCip> = {
    open: false,
    title: "Request CIP",
    defaultValue: { provider : "Provider1" },
    fields: {
      provider : {
        label: "CIP Provider",
        type: "selection",
        items: [ "Provider1", "Provider2" ] } },
    onClose: async function() {}
  };
  const [ cipProps, setCipProps ] = useState(defaultCipProps);
  function showCip(kycRequestCid : ContractId<KYCRequest>) {
    async function onClose(state : RequestCip | null) {
      setCipProps({ ...defaultCipProps, open: false});
      if (!state) return;
      await ledger.exercise(KYCRequest.RequestCip, kycRequestCid, state);
    };
    setCipProps({ ...defaultCipProps, open: true, onClose})
  };

  const defaultCddProps : InputDialogProps<RequestCdd> = {
    open: false,
    title: "Request CDD",
    defaultValue: { provider: "Provider2" },
    fields: {
      provider : {
        label: "CDD Provider",
        type: "selection",
        items: [ "Provider1", "Provider2" ]
       }
      },
    onClose: async function() {}
  };
  const [ cddProps, setCddProps ] = useState(defaultCddProps);
  function showCdd(kycRequestCid : ContractId<KYCRequest>) {
    async function onClose(state : RequestCdd | null) {
      setCddProps({ ...defaultCddProps, open: false});
      if (!state) return;
      await ledger.exercise(KYCRequest.RequestCdd, kycRequestCid, state);
    };
    setCddProps({...defaultCddProps, open: true, onClose});
  };

  const defaultNewKYCProps : InputDialogProps<ClientData> = {
    open: false,
    title: "New KYC Request",
    defaultValue: {
      name: "",
      address : "",
      city : "",
      postalCode : "",
      country : ""
    },
    fields: {
      name: {
        label: "Name",
        type: "text"
      },
      address: {
        label: "Address",
        type: "text"
      },
      city: {
        label: "City",
        type: "text"
      },
      postalCode: {
        label: "Postal code",
        type: "text"
      },
      country: {
        label: "Country",
        type: "selection",
        items: [ "Austria", "Germany", "Switzerland" ]
      },
    },
    onClose: async function() {}
  };
  const [newKYCProps, setNewKYCProps] = useState(defaultNewKYCProps);
  function showNewKYC() {
    async function onClose(state : ClientData | null) {
      setNewKYCProps({ ...defaultNewKYCProps, open: false});
      if (!state) return;
      const args = { sales: "Sales", operations: "Operations", compliance: "Compliance", clientData: state};
      await ledger.create(KYCRequest, args);
    };
    setNewKYCProps({...defaultNewKYCProps, open: true, onClose});
  };

  async function onboard(kycRequestCid : ContractId<KYCRequest>, cipResponseCid : ContractId<CipResponse>, cddResponseCid : ContractId<CddResponse>) {
    await ledger.exercise(KYCRequest.CompleteOnboarding, kycRequestCid, { cipResponseCid, cddResponseCid });
  };

  return (
    <>
      <InputDialog { ...cipProps } />
      <InputDialog { ...cddProps } />
      <InputDialog { ...newKYCProps } />
      { party === "Sales" && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" onClick={() => showNewKYC()}>
        Create New KYC Request
      </Button> }
      <Table size="small">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell key={0} className={classes.tableCell}>Name</TableCell>
            <TableCell key={1} className={classes.tableCell}>Address</TableCell>
            <TableCell key={2} className={classes.tableCell}>City</TableCell>
            <TableCell key={3} className={classes.tableCell}>PostalCode</TableCell>
            <TableCell key={4} className={classes.tableCell}>Country</TableCell>
            <TableCell key={5} className={classes.tableCell}>CIP</TableCell>
            <TableCell key={6} className={classes.tableCell}>CDD</TableCell>
            <TableCell key={7} className={classes.tableCell}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map(r => (
            <TableRow key={r.kycRequest.contractId} className={classes.tableRow}>
              <TableCell key={0} className={classes.tableCell}>{r.kycRequest.payload.clientData.name}</TableCell>
              <TableCell key={1} className={classes.tableCell}>{r.kycRequest.payload.clientData.address}</TableCell>
              <TableCell key={2} className={classes.tableCell}>{r.kycRequest.payload.clientData.city}</TableCell>
              <TableCell key={3} className={classes.tableCell}>{r.kycRequest.payload.clientData.postalCode}</TableCell>
              <TableCell key={4} className={classes.tableCell}>{r.kycRequest.payload.clientData.country}</TableCell>
              <TableCell key={5} className={classes.tableCellButton}>
                { !!r.cipRequest && <HelpOutline fontSize="small" /> }
                { !r.cipRequest && !!r.cipResponse && <CheckCircle fontSize="small" /> }
                { !r.cipRequest && !r.cipResponse && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" disabled={r.kycRequest.payload.operations !== party} onClick={() => showCip(r.kycRequest.contractId)}>Request</Button> }
              </TableCell>
              <TableCell key={6} className={classes.tableCellButton}>
                { !!r.cddRequest && <HelpOutline fontSize="small" /> }
                { !r.cddRequest && !!r.cddResponse && <CheckCircle fontSize="small" /> }
                { !r.cddRequest && !r.cddResponse && <Button color="primary" size="small" className={classes.choiceButton} variant="contained" disabled={r.kycRequest.payload.operations !== party} onClick={() => showCdd(r.kycRequest.contractId)}>Request</Button> }
              </TableCell>
              <TableCell key={7} className={classes.tableCellButton}>
              <Button color="primary" size="small" className={classes.choiceButton} variant="contained" disabled={!r.cipResponse || !r.cddResponse || r.kycRequest.payload.compliance !== party} onClick={() => onboard(r.kycRequest.contractId, r.cipResponse!.contractId, r.cddResponse!.contractId)}>Onboard</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
