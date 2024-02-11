"use client";
import React, { useState, useEffect, useImperativeHandle } from "react";
import {
  List,
  ListItem,
  ListItemText
} from "@mui/material";

const BalanceList = ({transaction, balanceListRef}) => {
  const [transactions, setTransactions] = useState([]);
  const [checkingBalance, setCheckingBalance] = useState([]);
  const [savingBalance, setSavingBalance] = useState([]);
  const fetchTransactions = () => {
    fetch("http://localhost:3000/api/transaction", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const { balances, transactions } = data;
        if (balances[0]?.type === "saving")
        setSavingBalance(data.balances[0].balance);
        if (balances[1]?.type === "checking")
        setCheckingBalance(data.balances[1].balance);
        setTransactions(transactions);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
  useImperativeHandle(balanceListRef, () => ({
    fetchTransactions() {
      fetchTransactions();
    }
  }));


  useEffect(() => {
    fetchTransactions();
  }, [transaction]); 

  return (
    <>
      <h3>Checking: {checkingBalance}</h3>
      <h3>Saving: {savingBalance}</h3>
      <List sx={{ width: 400, bgcolor: "background.paper" }}>
  <ListItem
    disablePadding
    sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%'
    }}
  >
    <ListItemText primary="Amount" sx={{ flexBasis: '18%' }} />
    <ListItemText primary="Type" sx={{ flexBasis: '35%' }} />
    <ListItemText primary="Date" sx={{ flexBasis: '43%' }} />
  </ListItem>
  
  {transactions.length > 0 && transactions.map((data) => {
    const labelId = `checkbox-list-label-${data.id}`;
    return (
      <ListItem
        key={data.id}
        disablePadding
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <ListItemText
          primary={data.amount}
          sx={{ flexBasis: '14%' }}
        />
        <ListItemText
          primary={data.type}
          sx={{ flexBasis: '43%' }}
        />    
        <ListItemText
          primary={data.date}
          sx={{ flexBasis: '43%' }}
        />   
      </ListItem>
    );
  })}
</List>
    </>
  );
};

export default BalanceList;