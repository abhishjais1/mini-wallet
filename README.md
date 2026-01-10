# Mini FinTech Wallet - Frontend Application

A modern, lightweight wallet application built with React, featuring money management, transaction history, and intuitive UI with Tailwind CSS.

## 🎯 Features

### Core Functionality
- **Dashboard**: View wallet balance, recent transactions, and quick actions
- **Add Money**: Deposit funds to wallet with transaction recording
- **Transfer Money**: Send money to other users with configurable fee and limits
- **Transaction History**: View all transactions with filtering by date, status, and type
- **Soft Delete**: Mark transactions as deleted without permanent removal
- **Error Handling**: Comprehensive error messages and graceful degradation

### Business Rules
- **Transaction Fee**: 2% of transfer amount (configurable in `config/appConfig.js`)
- **Transfer Limit**: Maximum ₹10,000 per transaction (configurable)
- **Transaction Status**: Pending, Success, Failed
- **Transaction Types**: Credit, Debit, Fee

### UI/UX Features
- Loading skeletons during API calls
- Empty state visualizations
- Toast notifications for success/error messages
- Confirmation modal for transfers
- Responsive design with Tailwind CSS
- Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0**: UI library with hooks
- **React Router 7.11**: Client-side routing
- **React Hook Form 7.70**: Lightweight form management
- **Axios 1.13**: HTTP client for API requests
- **Tailwind CSS 4.1**: Utility-first CSS framework

### Backend/Database
- **json-server 1.0**: Mock REST API
- **db.json**: JSON-based data storage

### Testing
- **Vitest 4.0**: Fast unit test framework
- **React Testing Library 16.3**: Component testing utilities
- **jsdom 27.4**: DOM environment for tests

### Development
- **Vite 7.2**: Next-gen build tool
- **ESLint 9.39**: Code linting
- **PostCSS 8.5**: CSS processing

## 🏗️ Architecture

### State Management
The app uses **React Context API with useReducer** pattern for global state management:

```
WalletContext.jsx
├── State: { user, transactions, loading, error }
├── Actions: addMoney, transferMoney, deleteTransaction, retryTransaction
└── Reducer: Handles state transitions with action types
```

**Why Context + useReducer?**
- Predictable state updates through reducer pattern
- Centralized business logic
- Easy testing with action dispatch
- No external dependencies (Redux-like without Redux)

### Data Flow
```
User Action → Dispatch Action → API Call → Reducer Update → UI Re-render
     ↓              ↓              ↓             ↓              ↓
  Button       addMoney()    POST /txn     SET_USER      Balance updates
```

### Component Architecture
```
App.jsx (Router)
├── Dashboard.jsx (useWallet hook)
│   └── Recent transactions, Quick actions
├── AddMoneyForm.jsx (react-hook-form)
│   └── Validation, API call, Toast feedback
├── TransferMoneyForm.jsx
│   └── Recipient select, Fee calc, Confirmation modal
└── TransactionHistory.jsx
    └── Filters, Soft delete, Status badges
```

### API Layer
- **Axios instance** with base URL configuration
- **Centralized API functions** in `utils/api.js`
- **Error handling** with try-catch and error propagation
- **Mock backend** with json-server for development

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- Windows/Mac/Linux OS

## 🚀 Setup & Installation

### 1. Clone/Extract Repository
```bash
cd mini-wallet-app1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start JSON Server (Backend Mock API)
Open a new terminal and run:
```bash
npm run server
```
The API will be available at `http://localhost:3001`

### 4. Start Development Server
In another terminal:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

## 📖 Usage

### Navigation
The app has a navigation bar with links to:
- **Dashboard**: View balance and recent transactions
- **Add Money**: Deposit funds
- **Transfer**: Send money to another user
- **History**: View all transactions with filters

### Add Money Flow
1. Navigate to "Add Money"
2. Enter amount (₹1 - ₹100,000)
3. Click "Add Money"
4. Transaction is recorded as credit
5. Balance updates immediately

### Transfer Money Flow
1. Navigate to "Transfer"
2. Select recipient from dropdown
3. Enter amount (₹1 - ₹10,000)
4. Review fee calculation (2% of amount)
5. Click "Continue"
6. Confirm transfer in modal
7. Both debit and fee transactions are recorded
8. Balance updates with debit + fee deducted

### View Transaction History
1. Navigate to "History"
2. Filter by Status (All, Success, Failed, Pending)
3. Filter by Type (All, Credit, Debit, Fee)
4. Filter by Date using date picker
5. Delete transactions (soft delete - marked as deleted)

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Test Structure
The project includes **131 tests** across **9 test files**:

| Test File | Tests | Description |
|-----------|-------|-------------|
| `appConfig.test.js` | 17 | Business rules, fee calculation, validation |
| `formatters.test.js` | 45 | Currency, date, relative time formatting |
| `api.test.js` | 18 | API functions, error handling, CRUD operations |
| `WalletContext.test.jsx` | 22 | Context state, actions, reducer logic |
| `Dashboard.test.jsx` | 5 | Dashboard rendering, balance display |
| `AddMoneyForm.test.jsx` | 5 | Add money form validation |
| `TransferMoneyForm.test.jsx` | 5 | Transfer form with fee calculation |
| `TransactionHistory.test.jsx` | 6 | Transaction filtering and deletion |
| `TransferFlow.integration.test.jsx` | 8 | End-to-end transfer flow tests |

### Test Categories
- **Unit Tests**: Individual functions and utilities (formatters, api, config)
- **Component Tests**: React component rendering and interactions
- **Context Tests**: State management and reducer logic
- **Integration Tests**: Complete user flows across multiple components

### Running Specific Tests
```bash
# Run a specific test file
npx vitest run src/test/api.test.js

# Run tests matching a pattern
npx vitest run --grep "transfer"

# Run tests in watch mode
npx vitest

# Run with verbose output
npx vitest run --reporter=verbose
```

## 📁 Project Structure

```
mini-wallet-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx              # Main dashboard with balance & quick actions
│   │   ├── AddMoneyForm.jsx           # Add money form with validation
│   │   ├── TransferMoneyForm.jsx      # Transfer form with confirmation modal
│   │   ├── TransactionHistory.jsx     # Transaction list with filters & soft delete
│   │   ├── ErrorBoundary.jsx          # Error boundary for graceful error handling
│   │   └── ui/                         # Reusable UI components
│   │       ├── Badge.jsx               # Status badges
│   │       ├── Button.jsx              # Button component
│   │       ├── Card.jsx                # Card container
│   │       ├── EmptyState.jsx          # Empty state visualization
│   │       ├── Icon.jsx                # Icon wrapper for lucide-react
│   │       ├── Input.jsx               # Form input component
│   │       ├── Modal.jsx               # Modal dialog
│   │       ├── Select.jsx              # Dropdown select
│   │       ├── Skeleton.jsx            # Loading skeletons
│   │       ├── Toast.jsx               # Toast notifications
│   │       └── index.js                # UI component exports
│   ├── context/
│   │   ├── WalletContext.jsx          # Global state (Context + useReducer)
│   │   └── ThemeContext.jsx           # Theme management
│   ├── hooks/
│   │   └── index.js                   # Custom React hooks (useWallet, etc.)
│   ├── utils/
│   │   ├── api.js                     # Axios API client with CRUD operations
│   │   ├── formatters.js              # Currency, date, time formatters
│   │   └── cn.js                      # Tailwind class name utility
│   ├── config/
│   │   └── appConfig.js               # Business rules and configuration
│   ├── test/
│   │   ├── setup.js                   # Vitest setup with mocks
│   │   ├── appConfig.test.js          # Config & business rules tests
│   │   ├── formatters.test.js         # Formatter utility tests
│   │   ├── api.test.js                # API function tests
│   │   ├── WalletContext.test.jsx     # Context state & actions tests
│   │   ├── Dashboard.test.jsx         # Dashboard component tests
│   │   ├── AddMoneyForm.test.jsx      # Add money form tests
│   │   ├── TransferMoneyForm.test.jsx # Transfer form tests
│   │   ├── TransactionHistory.test.jsx # Transaction history tests
│   │   └── TransferFlow.integration.test.jsx # Integration tests
│   ├── assets/                        # Static assets (images, etc.)
│   ├── App.jsx                        # Main app with routing
│   ├── App.css                        # App styles
│   ├── index.css                      # Tailwind directives
│   └── main.jsx                       # Entry point
├── docs/                              # Documentation
│   ├── Requirements.md                # Project requirements
│   ├── design-prompt.md               # Design specifications
│   ├── basedesign.md                  # Base design document
│   └── implementation-plan.md         # Implementation plan
├── public/                            # Static assets
├── db.json                            # Mock database with sample data
├── package.json                       # Dependencies
├── vite.config.js                     # Vite configuration
├── vitest.config.js                   # Vitest configuration
├── postcss.config.js                  # PostCSS configuration
├── eslint.config.js                   # ESLint configuration
├── index.html                         # HTML entry point
└── README.md                          # This file
```

## ⚙️ Configuration

### App Configuration (`src/config/appConfig.js`)
```javascript
// Transaction Fee
TRANSACTION_FEE.percentage = 2  // 2% fee

// Transfer Limits
LIMITS.maxTransferAmount = 10000
LIMITS.minTransferAmount = 1

// API Base URL
API.baseURL = 'http://localhost:3001'
```

### Modifying Rules
To change business rules:
1. Edit `src/config/appConfig.js`
2. Update fee percentage, limits, or other configs
3. Tests will validate new rules automatically

## 📊 Mock Data

The `db.json` file contains sample data:

### Users
```json
{
  "id": 1,
  "name": "Abhishek",
  "balance": 5000
}
```

### Transactions
```json
{
  "id": "1",
  "userId": 1,
  "type": "credit",
  "amount": 1000,
  "status": "success",
  "description": "Money Added",
  "timestamp": "2025-01-07T10:00:00Z",
  "deleted": false
}
```

## 🔌 API Endpoints (json-server)

### Users
- `GET /users` - Fetch all users
- `GET /users/:id` - Fetch user by ID
- `PATCH /users/:id` - Update user (balance)

### Transactions
- `GET /transactions` - Fetch all transactions
- `POST /transactions` - Create new transaction
- `PATCH /transactions/:id` - Update transaction (status, soft delete)

## 🚨 Error Handling

The app handles various error scenarios:
- **Validation Errors**: Form field-level errors with actionable messages
- **API Errors**: Network failures and server errors
- **Business Logic Errors**: 
  - Insufficient balance
  - Limit exceeded
  - Invalid amount
- **Error Boundary**: Catches unhandled errors with recovery option

## 📱 Responsive Design

The app is responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Card, button, input component layers
- **Animations**: Toast fade-in, loading spinners
- **Color Scheme**: Blue primary, green success, red danger

## 🔒 Security Measures

- **Input Validation**: Client-side validation for all forms
- **No Secrets in Repo**: Environment variables for sensitive data
- **Safe innerHTML**: No use of dangerouslySetInnerHTML
- **XSS Prevention**: React escapes content by default

## 📝 Assumptions & Limitations

### Assumptions
1. Single user mode - App works for one logged-in user (user ID 1)
2. Mock API - json-server runs locally, no production database
3. Client-side state - Balance updated in context, persists during session
4. No authentication - No login/logout flow implemented

### Limitations
1. **Data Persistence**: Data is stored in memory by json-server. Restarting the server resets data to db.json initial state
2. **Multi-user**: App is single-user. To support multiple users, would need proper backend authentication
3. **Real-time Updates**: Changes don't sync across browser tabs
4. **Offline Mode**: App requires running json-server to function
5. **Database**: No real database. For production, use actual backend (Node.js, Java, Python)

### Known Issues
- First load may show loading state briefly while fetching from json-server
- json-server has limitations on complex queries (use proper backend for production)

## 🔄 Future Enhancements

1. **User Management**
   - Login/Logout functionality
   - User profiles and settings
   - Multi-user support

2. **Analytics**
   - Transaction charts and graphs
   - Spending analytics
   - Export transaction history (CSV/PDF)

3. **Advanced Features**
   - Recurring transfers
   - Budget limits
   - Transaction tags/categories
   - Transaction search

4. **UI/UX**
   - Dark mode toggle
   - Internationalization (i18n)
   - Accessibility improvements
   - Mobile app (React Native)

5. **Backend**
   - Real Node.js/Express backend
   - Database (MongoDB, PostgreSQL)
   - Authentication (JWT)
   - Rate limiting

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Review the test files for usage examples
3. Check `appConfig.js` for configuration options

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

---

**Built with ❤️ for learning fintech concepts**

Last Updated: January 10, 2026
