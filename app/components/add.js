"use client";
import AddForm from "./addForm";
import React, { useState } from "react";
import Button from "@mui/material/Button";

const add = ({setTransaction, fetchTransactions}) => {
  const [addForm, setAddForm] = useState(false);

  const [transaction, setTransactions] = useState("");

  const handleTransactionReset = () => setTransactions(() => "");

  const handleAddFormToggle = () => {
    setAddForm((prev) => !prev);
    handleTransactionReset();
  };

  const handleAddTransaction = (e, selectedOption) => {
    e.preventDefault();
    fetch(`http://localhost:3000/api/${selectedOption}`, {
      method: "POST",
      body: JSON.stringify({ value: transaction }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add transaction");
        }
        return response.json();
      })
      .then((data) => {
        setTransaction(true);
        fetchTransactions();
        handleTransactionReset();
      })
      .catch((error) => {
        // Log any errors
        console.error("Error: ", error);
      });
  };

  return (
    <>
      <Button
        size="medium"
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mb: 1 }}
        onClick={() => handleAddFormToggle()}
      >
        Add/Transfer Founds
      </Button>
      {addForm ? (
        <div data-testid="add-form">
          <AddForm
          handleAddFormToggle={handleAddFormToggle}
          handleAddTransaction={(event, selectedOption) => handleAddTransaction(event, selectedOption)}
          setTransaction={setTransactions}
          transaction={transaction}
        />
        </div>
      ) : null}
    </>
  );
};

export default add;