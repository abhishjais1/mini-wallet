import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransferMoneyForm } from '../components/TransferMoneyForm.jsx';
import { WalletProvider } from '../context/WalletProvider.jsx';
import * as api from '../utils/api.js';

vi.mock('../utils/api.js');

describe('TransferMoneyForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchUsers.mockResolvedValue([
      { id: 1, name: 'Abhishek', balance: 5000 },
      { id: 2, name: 'Priya', balance: 8000 }
    ]);
    api.fetchTransactions.mockResolvedValue([]);
    api.createTransaction.mockResolvedValue({ id: '1' });
    api.updateUserBalance.mockResolvedValue({ balance: 4800 });
  });

  it('should render transfer form with user options', async () => {
    render(
      <WalletProvider>
        <TransferMoneyForm />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Transfer Money/i)).toBeInTheDocument();
      expect(screen.getByText('Priya (₹8000)')).toBeInTheDocument();
    });
  });

  it('should display fee calculation', async () => {
    const user = userEvent.setup();

    render(
      <WalletProvider>
        <TransferMoneyForm />
      </WalletProvider>
    );

    // Wait for users to be loaded first
    await waitFor(() => {
      expect(screen.getByText('Priya (₹8000)')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox', { name: /Recipient/i });
    const input = screen.getByPlaceholderText(/Enter amount/i);

    await user.selectOptions(select, '2');
    await user.type(input, '1000');

    await waitFor(() => {
      expect(screen.getByText(/Transaction Fee/i)).toBeInTheDocument();
      expect(screen.getByText(/₹20.00/)).toBeInTheDocument();
      expect(screen.getByText(/₹1020.00/)).toBeInTheDocument();
    });
  });

  it('should reject transfer exceeding max limit', async () => {
    const user = userEvent.setup();

    render(
      <WalletProvider>
        <TransferMoneyForm />
      </WalletProvider>
    );

    // Wait for users to be loaded first
    await waitFor(() => {
      expect(screen.getByText('Priya (₹8000)')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox', { name: /Recipient/i });
    const input = screen.getByPlaceholderText(/Enter amount/i);
    const button = screen.getByRole('button', { name: /Continue/i });

    await user.selectOptions(select, '2');
    await user.type(input, '15000');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Maximum transfer limit/i)).toBeInTheDocument();
    });
  });

  it('should show confirmation modal', async () => {
    const user = userEvent.setup();

    render(
      <WalletProvider>
        <TransferMoneyForm />
      </WalletProvider>
    );

    // Wait for users to be loaded first
    await waitFor(() => {
      expect(screen.getByText('Priya (₹8000)')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox', { name: /Recipient/i });
    const input = screen.getByPlaceholderText(/Enter amount/i);
    const button = screen.getByRole('button', { name: /Continue/i });

    await user.selectOptions(select, '2');
    await user.type(input, '1000');
    await user.click(button);

    await waitFor(() => {
      // Use queryAllByText to get multiple matches and check the modal header specifically
      const confirmTexts = screen.getAllByText(/Confirm Transfer/i);
      expect(confirmTexts.length).toBeGreaterThan(0);
    });
  });
});
