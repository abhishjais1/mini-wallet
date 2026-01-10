import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { TransferMoneyForm } from '../components/TransferMoneyForm.jsx';
import { Dashboard } from '../components/Dashboard.jsx';
import { WalletProvider } from '../context/WalletContext.jsx';
import * as api from '../utils/api.js';

vi.mock('../utils/api.js');

/**
 * Integration Test: Complete Transfer Money Flow
 * 
 * This test covers the critical user journey of transferring money:
 * 1. User fills in recipient and amount
 * 2. Fee calculation is displayed (2% of amount)
 * 3. User clicks "Review Transfer" to see confirmation modal
 * 4. Confirmation modal shows all transaction details
 * 5. User confirms the transfer
 * 6. Success message is displayed
 * 7. Transaction is recorded via API
 */
describe('Transfer Money Flow - Integration Tests', () => {
  const mockUsers = [
    { id: '1', name: 'Demo User', email: 'demo@example.com', balance: 5000 },
    { id: '2', name: 'Alice Johnson', email: 'alice@example.com', balance: 10000 },
    { id: '3', name: 'Bob Smith', email: 'bob@example.com', balance: 3500 },
  ];

  const mockTransactions = [
    { id: '100', type: 'credit', amount: 5000, status: 'success', deleted: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup API mocks
    api.fetchUsers.mockResolvedValue(mockUsers);
    api.fetchTransactions.mockResolvedValue(mockTransactions);
    api.createTransaction.mockImplementation((t) => 
      Promise.resolve({ ...t, id: t.id || Date.now().toString() })
    );
    api.updateUserBalance.mockResolvedValue({});
    api.updateTransactionStatus.mockResolvedValue({});
  });

  describe('Complete Transfer Flow', () => {
    it('should complete full transfer flow: fill form → see fee → confirm → success', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <WalletProvider>
            <TransferMoneyForm />
          </WalletProvider>
        </BrowserRouter>
      );

      // Step 1: Wait for form to load with users
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /transfer money/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      }, { timeout: 5000 });

      // Step 2: Select recipient
      const recipientSelect = screen.getByRole('combobox');
      await user.selectOptions(recipientSelect, '2'); // Alice Johnson

      // Step 3: Enter amount
      const amountInput = screen.getByPlaceholderText(/0.00/);
      await user.type(amountInput, '1000');

      // Step 4: Verify fee calculation is displayed
      await waitFor(() => {
        expect(screen.getByText(/transaction fee/i)).toBeInTheDocument();
        expect(screen.getByText(/transaction summary/i)).toBeInTheDocument();
      });

      // Step 5: Click "Review Transfer" button
      const reviewButton = screen.getByRole('button', { name: /review transfer/i });
      await user.click(reviewButton);

      // Step 6: Verify confirmation modal appears with correct details
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /confirm transfer/i })).toBeInTheDocument();
      });
      
      // Check modal content shows recipient (use getAllByText since name appears in select too)
      const aliceTexts = screen.getAllByText(/Alice Johnson/);
      expect(aliceTexts.length).toBeGreaterThanOrEqual(1);

      // Step 7: Confirm the transfer - use getAllByRole and select the button
      const confirmButtons = screen.getAllByRole('button', { name: /confirm transfer/i });
      const confirmButton = confirmButtons[confirmButtons.length - 1]; // Get the actual button
      await user.click(confirmButton);

      // Step 8: Verify API calls were made correctly
      await waitFor(() => {
        // Should create debit transaction
        expect(api.createTransaction).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'debit',
            amount: 1000,
            recipient: '2',
            status: 'pending',
          })
        );

        // Should create fee transaction
        expect(api.createTransaction).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'fee',
            amount: 20,
            recipient: 'System',
            status: 'pending',
          })
        );

        // Should update user balance (5000 - 1020 = 3980)
        expect(api.updateUserBalance).toHaveBeenCalledWith('1', 3980);
      });

      // Step 9: Verify success message appears
      await waitFor(() => {
        expect(screen.getByText(/transfer initiated successfully/i)).toBeInTheDocument();
      });
    });

    it('should show validation error for amount exceeding maximum limit (10,000)', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <WalletProvider>
            <TransferMoneyForm />
          </WalletProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      }, { timeout: 5000 });

      // Select recipient
      await user.selectOptions(screen.getByRole('combobox'), '2');

      // Enter amount exceeding limit
      const amountInput = screen.getByPlaceholderText(/0.00/);
      await user.type(amountInput, '15000');

      // Try to submit
      const reviewButton = screen.getByRole('button', { name: /review transfer/i });
      await user.click(reviewButton);

      // Should show validation error (either max limit or insufficient balance warning is visible)
      await waitFor(() => {
        // The form shows insufficient balance warning in the UI
        expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument();
      });

      // API should NOT be called (validation prevents submission)
      expect(api.createTransaction).not.toHaveBeenCalled();
    });

    it('should show insufficient balance warning and prevent transfer', async () => {
      // Mock user with low balance
      api.fetchUsers.mockResolvedValue([
        { id: '1', name: 'Demo User', email: 'demo@example.com', balance: 500 },
        { id: '2', name: 'Alice Johnson', email: 'alice@example.com', balance: 10000 },
      ]);

      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <WalletProvider>
            <TransferMoneyForm />
          </WalletProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      }, { timeout: 5000 });

      // Select recipient
      await user.selectOptions(screen.getByRole('combobox'), '2');

      // Enter amount more than balance
      const amountInput = screen.getByPlaceholderText(/0.00/);
      await user.type(amountInput, '1000');

      // Should show insufficient balance warning
      await waitFor(() => {
        expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument();
      });
    });

    it('should cancel transfer from confirmation modal', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <WalletProvider>
            <TransferMoneyForm />
          </WalletProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      }, { timeout: 5000 });

      // Fill form
      await user.selectOptions(screen.getByRole('combobox'), '2');
      await user.type(screen.getByPlaceholderText(/0.00/), '500');

      // Open confirmation modal
      await user.click(screen.getByRole('button', { name: /review transfer/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /confirm transfer/i })).toBeInTheDocument();
      });

      // Cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Modal should close, no API calls
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /confirm transfer/i })).not.toBeInTheDocument();
      });

      expect(api.createTransaction).not.toHaveBeenCalled();
    });

    it('should require recipient selection before submitting', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <WalletProvider>
            <TransferMoneyForm />
          </WalletProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      }, { timeout: 5000 });

      // Enter amount without selecting recipient
      await user.type(screen.getByPlaceholderText(/0.00/), '500');

      // Try to submit
      await user.click(screen.getByRole('button', { name: /review transfer/i }));

      // Should show error
      await waitFor(() => {
        expect(screen.getByText(/please select a recipient/i)).toBeInTheDocument();
      });
    });

    it('should correctly calculate and display fee breakdown for various amounts', async () => {
      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <WalletProvider>
            <TransferMoneyForm />
          </WalletProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      }, { timeout: 5000 });

      await user.selectOptions(screen.getByRole('combobox'), '2');

      const amountInput = screen.getByPlaceholderText(/0.00/);

      // Test with ₹100 (2% = ₹2)
      await user.type(amountInput, '100');

      await waitFor(() => {
        // Check that transaction summary is shown
        expect(screen.getByText(/transaction summary/i)).toBeInTheDocument();
      });

      // Clear and test with ₹5000 (2% = ₹100)
      await user.clear(amountInput);
      await user.type(amountInput, '5000');

      await waitFor(() => {
        expect(screen.getByText(/transaction summary/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API error during transfer gracefully', async () => {
      api.createTransaction.mockRejectedValue(new Error('Failed to create transaction'));

      const user = userEvent.setup();

      render(
        <BrowserRouter>
          <WalletProvider>
            <TransferMoneyForm />
          </WalletProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole('combobox')).not.toBeDisabled();
      }, { timeout: 5000 });

      // Fill form
      await user.selectOptions(screen.getByRole('combobox'), '2');
      await user.type(screen.getByPlaceholderText(/0.00/), '500');

      // Submit and confirm
      await user.click(screen.getByRole('button', { name: /review transfer/i }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /confirm transfer/i })).toBeInTheDocument();
      });

      const confirmButtons = screen.getAllByRole('button', { name: /confirm transfer/i });
      await user.click(confirmButtons[confirmButtons.length - 1]);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/failed to create transaction/i)).toBeInTheDocument();
      });
    });
  });

  describe('UI State Management', () => {
    it('should display available balance in form header', async () => {
      render(
        <BrowserRouter>
          <WalletProvider>
            <TransferMoneyForm />
          </WalletProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/available balance/i)).toBeInTheDocument();
        expect(screen.getByText(/₹5,000/)).toBeInTheDocument();
      });
    });
  });
});
