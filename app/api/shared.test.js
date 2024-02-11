import { handleDeposit, handleTransfer } from './shared';
import { open } from 'sqlite';
import '@testing-library/jest-dom';
jest.mock('sqlite3');
jest.mock('sqlite');


describe('handleDeposit', () => {
  let mockResponse;
  let mockReq;

  beforeEach(() => {
    mockResponse = {
      json: jest.fn(),
    };
    mockReq = {
      json: jest.fn().mockResolvedValue({ value: '100' }),
    };
  });
  global.Response = jest.fn((message) => ({
    json: jest.fn().mockReturnValue({ message })
  }));
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle deposit successfully', async () => {
    const mockDB = {
      run: jest.fn(),
      all: jest.fn().mockResolvedValue([{ balance: 500 }]),
    };
    
    open.mockResolvedValueOnce(mockDB);

    await handleDeposit(mockReq, 'saving');
    expect(mockDB.run).toHaveBeenCalledTimes(4);
    expect(mockDB.all).toHaveBeenCalledWith(`SELECT * FROM account where user_id = 1 and type = 'saving'`);
    await handleDeposit(mockReq, 'checking');
  });

  it('should handle deposit failure', async () => {
    const mockDB = {
      run: jest.fn().mockRejectedValueOnce(new Error('Transaction failed')),
    };

    open.mockResolvedValueOnce(mockDB);

    await handleDeposit(mockReq, 'saving');

    expect(mockDB.run).toHaveBeenCalledTimes(0);
  });
});

describe('handleTransfer', () => {
  let mockResponse;
  let mockReq;

  beforeEach(() => {
    mockResponse = {
      json: jest.fn(),
    };
    mockReq = {
      json: jest.fn().mockResolvedValue({ value: 100 }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle transfer successfully', async () => {
    const mockDB = {
      run: jest.fn(),
      all: jest.fn().mockResolvedValueOnce([
        { type: 'saving', balance: 200 },
      ]).mockResolvedValueOnce([
        { type: '', balance: 100 }
      ]),
    };

    open.mockResolvedValueOnce(mockDB);

    await handleTransfer(mockReq, 'checking', 'saving');

    expect(mockDB.run).toHaveBeenCalledTimes(0);
  });

  it('should handle transfer failure', async () => {
    const mockDB = {
      run: jest.fn().mockRejectedValueOnce(new Error('Not enough funds')),
    };

    open.mockResolvedValueOnce(mockDB);

    await handleTransfer(mockReq, 'checking', 'saving');

    expect(mockDB.run).toHaveBeenCalledTimes(0);
  });
});
