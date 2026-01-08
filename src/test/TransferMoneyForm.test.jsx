import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TransferMoneyForm } from '../components/TransferMoneyForm.jsx';
import { WalletProvider } from '../context/WalletContext.jsx';
import * as api from '../utils/api.js';

vi.mock('../utils/api.js');

// Wrapper with router
function RouterWrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe('TransferMoneyForm Component', () => {
  const mockUsers = [
    { id: 1, name: 'Demo User', balance: 5000 },
    { id: 2, name: 'Alice Johnson', balance: 10000 },
    { id: 3, name: 'Bob Smith', balance: 3500 }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchUsers.mockResolvedValue(mockUsers);
    api.fetchTransactions.mockResolvedValue([]);
    api.createTransaction.mockResolvedValue({ id: '1' });
    api.updateUserBalance.mockResolvedValue({ balance: 4000 });
    api.updateTransactionStatus.mockResolvedValue({});
  });

  it('should render transfer money form', async () => {
    render(
      <RouterWrapper>
        <WalletProvider>
          <TransferMoneyForm />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Transfer Money/i })).toBeInTheDocument();
      // Check for the select input by role
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('should show error for empty recipient', async () => {
    const user = userEvent.setup();

    render(
      <RouterWrapper>
        <WalletProvider>
          <TransferMoneyForm />
        </WalletProvider>
      </RouterWrapper>
    );

    const input = screen.getByPlaceholderText(/0.00/);
    await user.type(input, '1000');

    const button = screen.getByRole('button', { name: /Review Transfer/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Please select a recipient/i)).toBeInTheDocument();
    });
  });

  it('should calculate fee correctly', async () => {
    const user = userEvent.setup();

    render(
      <RouterWrapper>
        <WalletProvider>
          <TransferMoneyForm />
        </WalletProvider>
      </RouterWrapper>
    );

    // Wait for users to be loaded and options to populate
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Transfer Money/i })).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');

    // Wait for options to be populated (select should not be disabled)
    await waitFor(() => {
      expect(select).not.toBeDisabled();
    }, { timeout: 3000 });

    await user.selectOptions(select, '2');

    const input = screen.getByPlaceholderText(/0.00/);
    await user.type(input, '1000');

    await waitFor(() => {
      expect(screen.getByText(/₹20/)).toBeInTheDocument(); // 2% of 1000
    });
  });

  it('should show insufficient balance warning', async () => {
    const user = userEvent.setup();

    render(
      <RouterWrapper>
        <WalletProvider>
          <TransferMoneyForm />
        </WalletProvider>
      </RouterWrapper>
    );

    // Wait for users to be loaded
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Transfer Money/i })).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');

    // Wait for options to be populated
    await waitFor(() => {
      expect(select).not.toBeDisabled();
    }, { timeout: 3000 });

    await user.selectOptions(select, '2');

    const input = screen.getByPlaceholderText(/0.00/);
    await user.type(input, '10000'); // More than balance

    await waitFor(() => {
      expect(screen.getByText(/Insufficient balance/i)).toBeInTheDocument();
    });
  });

  it('should filter out current user from recipients', async () => {
    render(
      <RouterWrapper>
        <WalletProvider>
          <TransferMoneyForm />
        </WalletProvider>
      </RouterWrapper>
    );

    // Wait for users to be loaded - check for select to be enabled
    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select).not.toBeDisabled();
    }, { timeout: 3000 });

    // Check that current user (Demo User) is not in the options
    expect(screen.queryByText('Demo User')).not.toBeInTheDocument();
    // The select shows "Name (ID: X)" format, so we check for partial matches
    expect(screen.getByText(/Alice Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/Bob Smith/)).toBeInTheDocument();
  });
});
