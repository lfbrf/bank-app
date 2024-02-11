import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for custom matchers
import AddForm from "./AddForm";

describe("AddForm Component", () => {
  test("renders AddForm with default values", () => {
    const { getByLabelText, getByText } = render(<AddForm />);

    // Assert that select component and its options are rendered with default values
    const selectElement = getByLabelText("Select");
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue("checking"); // Default value is "checking"

    const depositCheckingOption = getByText("Deposit Checking");
    expect(depositCheckingOption).toBeInTheDocument();

    // Assert that TextField component is rendered with default value
    const textFieldElement = getByLabelText("Required");
    expect(textFieldElement).toBeInTheDocument();
    expect(textFieldElement).toHaveValue("");

    // Assert that "Add" and "Cancel" buttons are rendered
    const addButton = getByText("add");
    expect(addButton).toBeInTheDocument();

    const cancelButton = getByText("cancel");
    expect(cancelButton).toBeInTheDocument();
  });

  test("allows user to select options", () => {
    const { getByLabelText } = render(<AddForm />);

    // Simulate user selecting different options from the dropdown
    const selectElement = getByLabelText("Select");
    fireEvent.change(selectElement, { target: { value: "saving" } });

    expect(selectElement).toHaveValue("saving");
  });

  test("allows user to enter text", () => {
    const { getByLabelText } = render(<AddForm />);

    // Simulate user entering text into the TextField
    const textFieldElement = getByLabelText("Required");
    fireEvent.change(textFieldElement, { target: { value: "100" } });

    expect(textFieldElement).toHaveValue("100");
  });

  test("calls handleAddTask function when 'Add' button is clicked", () => {
    const handleAddTask = jest.fn();
    const { getByText } = render(<AddForm handleAddTask={handleAddTask} />);

    // Simulate user clicking the "Add" button
    const addButton = getByText("add");
    fireEvent.click(addButton);

    // Assert that handleAddTask function is called
    expect(handleAddTask).toHaveBeenCalledTimes(1);
  });

  test("calls handleAddFormToggle function when 'Cancel' button is clicked", () => {
    const handleAddFormToggle = jest.fn();
    const { getByText } = render(<AddForm handleAddFormToggle={handleAddFormToggle} />);

    // Simulate user clicking the "Cancel" button
    const cancelButton = getByText("cancel");
    fireEvent.click(cancelButton);

    // Assert that handleAddFormToggle function is called
    expect(handleAddFormToggle).toHaveBeenCalledTimes(1);
  });
});
