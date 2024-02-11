"use client";
import React, { useRef, useState } from "react"; // Import React
import BalanceList from "./components/balanceList.js";
import Add from "./components/add.js";
import Divider from "@mui/material/Divider";

export default function Home() {
  const [transaction, setTransaction] = useState(false);
  const balanceListRef = useRef();
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Welcome, User</h1>
      <h1 style={{ textAlign: "center" }}>My Transactions 🏦</h1>
      <Divider sx={{ height: ".1px", bgcolor: "grey.500", my: 2, mt: -1 }} />
      <Add setTransaction={setTransaction} fetchTransactions={() => balanceListRef.current.fetchTransactions()} />
      <BalanceList  transaction={transaction} balanceListRef={balanceListRef} />
    </>
  );
}
