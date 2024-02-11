import React from "react";
import { render, waitFor } from "@testing-library/react";
import BalanceList from "./balanceList";
import '@testing-library/jest-dom';

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        balances: [
          { type: "checking", balance: 100 },
          { type: "saving", balance: 200 }
        ],
        transactions: [
          { id: 1, amount: 50, type: "withdrawal", date: "2024-02-10" },
          { id: 2, amount: 100, type: "deposit", date: "2024-02-11" }
        ]
      })
  })
);

describe("BalanceList Component", () => {
  test("renders checking and saving balances", async () => {
    const { getByText } = render(<BalanceList />);
    await waitFor(() => {
        expect(getByText(/Checking:/)).toBeInTheDocument();
        expect(getByText(/Saving:/)).toBeInTheDocument();
    });
  });

  test("renders transactions list", async () => {
    const { getByText } = render(<BalanceList />);
    await waitFor(() => {
      expect(getByText("Amount")).toBeInTheDocument();
      expect(getByText("Type")).toBeInTheDocument();
      expect(getByText("Date")).toBeInTheDocument();
      expect(getByText("50")).toBeInTheDocument();
      expect(getByText("withdrawal")).toBeInTheDocument();
      expect(getByText("2024-02-10")).toBeInTheDocument();
      expect(getByText("100")).toBeInTheDocument();
      expect(getByText("deposit")).toBeInTheDocument();
      expect(getByText("2024-02-11")).toBeInTheDocument();
    });
  });

  // Add more tests as needed
});