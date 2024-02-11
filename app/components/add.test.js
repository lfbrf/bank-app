import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Add from "./add";

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Transaction added successfully" }),
  })
);

describe("Add Component", () => {
  test("renders the Add button", () => {
    const { getByText } = render(<Add />);
    expect(getByText("Add/Transfer Founds")).toBeInTheDocument();
  });

  test("opens the AddForm when Add button is clicked", () => {
    const { getByText, getByTestId } = render(<Add />);
    const addButton = getByText("Add/Transfer Founds");
    fireEvent.click(addButton);
    const addForm = getByTestId("add-form");
    expect(addForm).toBeInTheDocument();
  });

  test("closes the AddForm when clicked again", () => {
    const { getByText, getByTestId, queryByTestId } = render(<Add />);
    const addButton = getByText("Add/Transfer Founds");
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    const addForm = queryByTestId("add-form");
    expect(addForm).toBeNull();
  });

  test("adds a transaction when submitted", async () => {
    const { getByText, getByTestId } = render(<Add />);
    const addButton = getByText("Add/Transfer Founds");
    fireEvent.click(addButton);

    const transactionInput = getByTestId("transaction-input");
    fireEvent.keyDown(transactionInput, { key: '1', keyCode: 49 });
    fireEvent.keyPress(transactionInput, { key: '1', charCode: 49 });
    fireEvent.keyUp(transactionInput, { key: '1', keyCode: 49 });

    const submitButton = getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/api/checking", {
        method: "POST",
        body: JSON.stringify({ value: "" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });
});
