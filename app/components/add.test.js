import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for custom matchers
import Add from "./add";

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Task added successfully" }),
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

  test("adds a task when submitted", async () => {
    const { getByText, getByTestId } = render(<Add />);
    const addButton = getByText("Add/Transfer Founds");
    fireEvent.click(addButton);

    const taskInput = getByTestId("task-input");
    fireEvent.change(taskInput, { target: { value: "New Task" } });

    const submitButton = getByTestId("submit-button");
    fireEvent.click(submitButton);

    // Wait for the task to be added
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/selectedOption", {
        method: "POST",
        body: JSON.stringify({ value: "New Task" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    });
  });

  // Add more tests as needed
});
