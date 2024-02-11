"use client";
import AddForm from "./addForm";
import React, { useState } from "react";
import Button from "@mui/material/Button";

const add = ({setTransaction, fetchTransactions}) => {
  const [addForm, setAddForm] = useState(false);

  const [task, setTask] = useState("");

  const handleTaskReset = () => setTask(() => "");

  const handleAddFormToggle = () => {
    setAddForm((prev) => !prev);
    handleTaskReset();
  };

  const handleAddTask = (e, selectedOption) => {
    e.preventDefault();
    fetch(`http://localhost:3000/api/${selectedOption}`, {
      method: "POST",
      body: JSON.stringify({ value: task }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add task");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Task added successfully:", data);
        setTransaction(true);
        fetchTransactions();
        handleTaskReset();
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
        <AddForm
          handleAddFormToggle={handleAddFormToggle}
          handleAddTask={(event, selectedOption) => handleAddTask(event, selectedOption)}
          setTask={setTask}
          task={task}
        />
      ) : null}
    </>
  );
};

export default add;