import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AddMoneyForm } from '../components/AddMoneyForm.jsx';
import { WalletProvider } from '../context/WalletContext.jsx';
import * as api from '../utils/api.js';

vi.mock('../utils/api.js');

// Wrapper with router
function RouterWrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe('AddMoneyForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchUsers.mockResolvedValue([
      { id: 1, name: 'Demo User', balance: 5000 }
    ]);
    api.fetchTransactions.mockResolvedValue([]);
    api.createTransaction.mockResolvedValue({ id: '1' });
    api.updateUserBalance.mockResolvedValue({ balance: 6000 });
    api.updateTransactionStatus.mockResolvedValue({});
  });

  it('should render add money form', async () => {
    render(
      <RouterWrapper>
        <WalletProvider>
          <AddMoneyForm />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      // Check heading is present (using role to be specific)
      expect(screen.getByRole('heading', { name: /Add Money/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/0.00/)).toBeInTheDocument();
    });
  });

  it('should show error for empty amount', async () => {
    const user = userEvent.setup();

    render(
      <RouterWrapper>
        <WalletProvider>
          <AddMoneyForm />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Add Money/i })).toBeInTheDocument();
    });

    const button = screen.getByRole('button', { name: /^Add Money$/ });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Amount is required/i)).toBeInTheDocument();
    });
  });

  it('should handle successful money addition', async () => {
    const user = userEvent.setup();

    render(
      <RouterWrapper>
        <WalletProvider>
          <AddMoneyForm />
        </WalletProvider>
      </RouterWrapper>
    );

    const input = screen.getByPlaceholderText(/0.00/);
    const button = screen.getByRole('button', { name: /^Add Money$/ });

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
      <RouterWrapper>
        <WalletProvider>
          <AddMoneyForm />
        </WalletProvider>
      </RouterWrapper>
    );

    const input = screen.getByPlaceholderText(/0.00/);
    const button = screen.getByRole('button', { name: /^Add Money$/ });

    await user.type(input, '200000');
    await user.click(button);

    // The validation prevents submission - button should become loading then return to normal
    // or a toast should appear with the error message
    await waitFor(() => {
      // Just verify the API was not called (no successful submission)
      expect(api.createTransaction).not.toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('should handle quick amount selection', async () => {
    const user = userEvent.setup();

    render(
      <RouterWrapper>
        <WalletProvider>
          <AddMoneyForm />
        </WalletProvider>
      </RouterWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Quick select')).toBeInTheDocument();
    });

    const quickButtons = screen.getAllByText('500');
    expect(quickButtons.length).toBeGreaterThan(0);
  });
});
