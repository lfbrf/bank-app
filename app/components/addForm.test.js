import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddForm from './addForm';
jest.mock('./currencyInput', () => () => <input />);

describe('AddForm', () => {
  test('renders correctly', () => {
    const handleAddFormToggle = jest.fn();
    const handleAddTransaction = jest.fn();
    const setTransaction = jest.fn();
    const transaction = '';

    const { getByText } = render(
      <AddForm
        handleAddFormToggle={handleAddFormToggle}
        handleAddTransaction={handleAddTransaction}
        setTransaction={setTransaction}
        transaction={transaction}
      />
    );

    expect(getByText('Required')).toBeInTheDocument();
    expect(getByText('add')).toBeInTheDocument();
    expect(getByText('cancel')).toBeInTheDocument();
  });

  test('calls handleAddTransaction when add button is clicked', () => {
    const handleAddFormToggle = jest.fn();
    const handleAddTransaction = jest.fn();
    const setTransaction = jest.fn();
    const transaction = '';
    const { getByText } = render(
      <AddForm
        handleAddFormToggle={handleAddFormToggle}
        handleAddTransaction={handleAddTransaction}
        setTransaction={setTransaction}
        transaction={transaction}
      />
    );

    fireEvent.click(getByText('add'));

    expect(handleAddTransaction).toHaveBeenCalled();
  });

  test('calls handleAddFormToggle when cancel button is clicked', () => {
    const handleAddFormToggle = jest.fn();
    const handleAddTransaction = jest.fn();
    const setTransaction = jest.fn();
    const transaction = '';
    const { getByText } = render(
      <AddForm
        handleAddFormToggle={handleAddFormToggle}
        handleAddTransaction={handleAddTransaction}
        setTransaction={setTransaction}
        transaction={transaction}
      />
    );

    fireEvent.click(getByText('cancel'));

    expect(handleAddFormToggle).toHaveBeenCalled();
  });

  test('updates selectedOption state when Select component changes', () => {
    const handleAddFormToggle = jest.fn();
    const handleAddTransaction = jest.fn();
    const setTransaction = jest.fn();
    const transaction = '';
    const { getByText, getByTestId } = render(
      <AddForm
        handleAddFormToggle={handleAddFormToggle}
        handleAddTransaction={handleAddTransaction}
        setTransaction={setTransaction}
        transaction={transaction}
      />
    );

    const select = getByTestId('demo-simple-select');
    fireEvent.mouseDown(select);

    const option = getByText('Deposit Checking');
    fireEvent.click(option);

    expect(select.textContent).toContain('Deposit Checking');
  });
});
