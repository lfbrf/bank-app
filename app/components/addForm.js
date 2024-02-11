"use client";
import React, { useState } from "react";
import { Box, TextField, Button, ButtonGroup, Select, MenuItem } from "@mui/material";
import CurrencyInput from "./currencyInput";


const AddForm = ({ handleAddFormToggle, handleAddTransaction, setTransaction, transaction }) => {
  const [selectedOption, setSelectedOption] = useState('checking');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  return (
    <Box>
        <Select
          labelId="select-label"
          id="demo-simple-select"
          margin="normal"
          color="primary"
          variant="outlined"
          fontColor="primary"
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.light",
            },
            "& .MuiInputLabel-root": {
              color: "primary.light",
            },
            "& .MuiOutlinedInput-input": {
              color: "text.main",
            },
            mb: 2,
          }}
          value={selectedOption}
          onChange={handleChange}
          data-testid="demo-simple-select"
        >
          <MenuItem value="checking">Deposit Checking</MenuItem>
          <MenuItem value="saving" >Deposit Saving</MenuItem>
          <MenuItem value="transferToSaving">Transfer Checking to Saving</MenuItem>
          <MenuItem value="transferToChecking">Transfer Saiving to Checking</MenuItem>
        </Select>
      <TextField
        required
        fullWidth
        id="outlined-required"
        label="Required"
        margin="normal"
        color="primary"
        variant="outlined"
        fontColor="primary"
        value={transaction}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.light",
          },
          "& .MuiInputLabel-root": {
            color: "primary.light",
          },
          "& .MuiOutlinedInput-input": {
            color: "text.main",
          },
          mb: 2,
        }}
        InputProps={{
          inputComponent: CurrencyInput,
        }}
        data-testid="transaction-input"
        onChange={(e) => setTransaction((prev) => e.target.value.replace('$', '').replace(',', ''))}
      />
      <ButtonGroup fullWidth sx={{ mb: 2 }}>
        <Button variant="outlined" color="primary" data-testid="submit-button" onClick={(e)=> handleAddTransaction(e, selectedOption) }>
          add
        </Button>
        <Button variant="outlined" color="error" onClick={handleAddFormToggle}>
          cancel
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default AddForm;