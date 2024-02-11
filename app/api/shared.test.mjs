import { handleDeposit, handleTransfer } from './shared';
import { open } from 'sqlite';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle deposit successfully', async () => {
    const mockDB = {
      run: jest.fn(),
      all: jest.fn().mockResolvedValue([{ balance: 50 }]),
    };

    open.mockResolvedValueOnce(mockDB);

    const result = await handleDeposit(mockReq, 'savings');

    expect(result.status).toEqual(200);
    expect(result.headers['content-type']).toEqual('application/json');
    expect(mockDB.run).toHaveBeenCalledTimes(3); // BEGIN, UPDATE, INSERT
    expect(mockDB.all).toHaveBeenCalledWith(`SELECT * FROM account where user_id = 1 and type = 'savings'`);
  });

  it('should handle deposit failure', async () => {
    const mockDB = {
      run: jest.fn().mockRejectedValueOnce(new Error('Transaction failed')),
    };

    open.mockResolvedValueOnce(mockDB);

    const result = await handleDeposit(mockReq, 'savings');

    expect(result.status).toEqual(500);
    expect(result.headers['content-type']).toEqual('application/json');
    expect(mockDB.run).toHaveBeenCalledTimes(2); // BEGIN, ROLLBACK
    expect(mockDB.all).toHaveBeenCalledWith(`SELECT * FROM account where user_id = 1 and type = 'savings'`);
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
      json: jest.fn().mockResolvedValue({ value: '100' }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle transfer successfully', async () => {
    const mockDB = {
      run: jest.fn(),
      all: jest.fn().mockResolvedValue([{ type: 'checking', balance: 200 }, { type: 'savings', balance: 100 }]),
    };

    open.mockResolvedValueOnce(mockDB);

    const result = await handleTransfer(mockReq, 'checking', 'savings');

    expect(result.status).toEqual(200);
    expect(result.headers['content-type']).toEqual('application/json');
    expect(mockDB.run).toHaveBeenCalledTimes(5); // BEGIN, SELECT, UPDATE, UPDATE, INSERT
  });

  it('should handle transfer failure', async () => {
    const mockDB = {
      run: jest.fn().mockRejectedValueOnce(new Error('Not enough funds')),
    };

    open.mockResolvedValueOnce(mockDB);

    const result = await handleTransfer(mockReq, 'checking', 'savings');

    expect(result.status).toEqual(500);
    expect(result.headers['content-type']).toEqual('application/json');
    expect(mockDB.run).toHaveBeenCalledTimes(2); // BEGIN, ROLLBACK
  });
});
