import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddMoneyForm } from '../components/AddMoneyForm.jsx';
import { WalletProvider } from '../context/WalletProvider.jsx';
import * as api from '../utils/api.js';

vi.mock('../utils/api.js');

describe('AddMoneyForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchUsers.mockResolvedValue([
      { id: 1, name: 'Abhishek', balance: 5000 }
    ]);
    api.fetchTransactions.mockResolvedValue([]);
    api.createTransaction.mockResolvedValue({ id: '1' });
    api.updateUserBalance.mockResolvedValue({ balance: 6000 });
  });

  it('should render add money form', async () => {
    render(
      <WalletProvider>
        <AddMoneyForm />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Add Money to Wallet/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter amount/i)).toBeInTheDocument();
    });
  });

  it('should show error for empty amount', async () => {
    const user = userEvent.setup();

    render(
      <WalletProvider>
        <AddMoneyForm />
      </WalletProvider>
    );

    const button = screen.getByRole('button', { name: /Add Money/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Amount is required/i)).toBeInTheDocument();
    });
  });

  it('should handle successful money addition', async () => {
    const user = userEvent.setup();

    render(
      <WalletProvider>
        <AddMoneyForm />
      </WalletProvider>
    );

    const input = screen.getByPlaceholderText(/Enter amount/i);
    const button = screen.getByRole('button', { name: /Add Money/i });

    await user.type(input, '1000');
    await user.click(button);

    await waitFor(() => {
      expect(api.createTransaction).toHaveBeenCalled();
      expect(api.updateUserBalance).toHaveBeenCalledWith(1, 6000);
    });
  });

  it('should reject amount exceeding max limit', async () => {
    const user = userEvent.setup();

    render(
      <WalletProvider>
        <AddMoneyForm />
      </WalletProvider>
    );

    const input = screen.getByPlaceholderText(/Enter amount/i);
    const button = screen.getByRole('button', { name: /Add Money/i });

    await user.type(input, '200000');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Maximum amount/i)).toBeInTheDocument();
    });
  });
});
