# Mini Wallet Implementation Plan

## Executive Summary

This plan addresses all issues in the current codebase and implements the full requirements per `Requirements.md`. The current implementation has significant architectural, design, and quality issues that need systematic resolution.

---

## Current Codebase Issues Identified

### 1. Design & UX Issues
| Issue | Severity | Fix |
|-------|----------|-----|
| Generic Bootstrap-like aesthetic | High | Implement Neo-Fi design system |
| Emoji icons instead of proper icons | High | Replace all emojis with lucide-react |
| Clashing color gradients | High | Unified indigo-purple color scheme |
| Low contrast status badges | Medium | Use proper contrast with borders |
| No distinctive loading states | Low | Add proper skeleton loaders |
| Poor empty states | Low | Redesign with icons + actions |

### 2. Architecture Issues
| Issue | Severity | Fix |
|-------|----------|-----|
| Split context files (Context.jsx + Provider.jsx) | Medium | Consolidate into single file each |
| Multiple redundant hooks wrapping same context | Medium | Consolidate to single useWallet hook |
| React Router Link not used correctly | High | Replace `<a href="">` with `<Link to="">` |
| API calls directly in provider | High | Extract to custom hook or service layer |
| No proper error boundary for React errors | High | Implement proper ErrorBoundary with componentDidCatch |
| ESLint disable suppressing real issues | Low | Fix the underlying issues |

### 3. Missing Requirements
| Requirement | Status | Action |
|-------------|--------|--------|
| Dashboard with balance + last 10 transactions | Partial | Improve design, add proper loading/empty |
| Add money with validation | Complete | Keep, improve UX |
| Transfer with fee + limit + confirmation | Partial | Modal exists but needs improvement |
| Transaction history with filters | Partial | Add date range filter, improve pagination |
| Delete transaction (soft delete) | Complete | Keep |
| Loading indicators | Partial | Improve skeletons |
| Error handling with toasts | Partial | Better error messages, global handler |
| Mock API endpoints | Complete | Keep json-server setup |
| Business rules (fee 2%, limit 10,000) | Complete | Already in config |
| Transaction status (pending → success/failed) | Missing | Implement status flow |
| 8-10 tests | Partial | Currently has ~8, improve quality |
| Integration test | Missing | Add for critical flow |
| README with setup | Missing | Create |

---

## Implementation Plan

### Phase 1: Foundation & Architecture (Day 1)

#### 1.1 Restructure Context Layer
**Files to modify**: `src/context/WalletContext.jsx`, `src/context/WalletProvider.jsx`, `src/context/ThemeContext.jsx`, `src/context/ThemeProvider.jsx`, `src/hooks/index.js`

**Actions**:
1. Merge `WalletContext.jsx` and `WalletProvider.jsx` into single `WalletContext.jsx`
2. Merge `ThemeContext.jsx` and `ThemeProvider.jsx` into single `ThemeContext.jsx`
3. Consolidate hooks into a single `useWallet()` hook that returns everything
4. Remove redundant hooks: `useUser`, `useTransactions`, `useBalance`, `useTransactionActions`, `useAppState`

**New structure**:
```
src/context/
├── WalletContext.jsx    (exports WalletContext, WalletProvider, useWallet)
└── ThemeContext.jsx     (exports ThemeContext, ThemeProvider, useTheme)
```

#### 1.2 Extract API Layer
**New file**: `src/services/walletService.js`

**Actions**:
1. Create service layer that wraps all API calls
2. Add proper error handling with meaningful messages
3. Add optimistic update support
4. Include retry logic for failed requests

#### 1.3 Fix React Router Usage
**Files to modify**: `src/components/Dashboard.jsx`, `src/App.jsx`

**Actions**:
1. Replace all `<a href="/path">` with `<Link to="/path">` from react-router-dom
2. Ensure navigation works without page reloads

---

### Phase 2: Design System Implementation (Day 1-2)

#### 2.1 Add Design Tokens
**New file**: `src/styles/tokens.css`

**Actions**:
1. Define all CSS variables per `design-prompt.md`
2. Configure Tailwind theme in `tailwind.config.js`
3. Add custom animations

#### 2.2 Add Google Fonts
**Files to modify**: `src/index.html`

**Actions**:
1. Add Plus Jakarta Sans, Inter, JetBrains Mono
2. Define font families in Tailwind config

#### 2.3 Create Base Components
**New files**:
- `src/components/ui/Button.jsx`
- `src/components/ui/Card.jsx`
- `src/components/ui/Input.jsx`
- `src/components/ui/Select.jsx`
- `src/components/ui/Badge.jsx`
- `src/components/ui/Icon.jsx`
- `src/components/ui/Skeleton.jsx`
- `src/components/ui/EmptyState.jsx`
- `src/components/ui/Modal.jsx`
- `src/components/ui/Toast.jsx`

**Each component follows Neo-Fi design specifications.**

---

### Phase 3: Redesign Pages (Day 2-3)

#### 3.1 Dashboard Redesign
**File**: `src/components/Dashboard.jsx`

**Requirements**:
1. Balance card with gradient text and subtle glow
2. Quick action cards with proper hover effects
3. Recent transactions list (max 10)
4. Loading skeleton state
5. Empty state when no transactions
6. Use Link components for navigation

#### 3.2 Add Money Form Redesign
**File**: `src/components/AddMoneyForm.jsx`

**Requirements**:
1. Clean form with bottom-border inputs
2. Real-time validation feedback
3. Loading state during submission
4. Success toast after completion
5. Quick link to dashboard

#### 3.3 Transfer Money Form Redesign
**File**: `src/components/TransferMoneyForm.jsx`

**Requirements**:
1. Recipient select with user names
2. Amount input with real-time fee calculation preview
3. Balance check before submission
4. Confirmation modal before processing
5. Show fee breakdown clearly
6. Enforce 10,000 limit with clear error

#### 3.4 Transaction History Redesign
**File**: `src/components/TransactionHistory.jsx`

**Requirements**:
1. Filters: status, type, date range (start and end dates)
2. Paginated list (configurable items per page)
3. Delete button with confirmation
4. Export functionality (bonus)
5. Loading skeleton
6. Empty state with filter reset option

---

### Phase 4: Transaction Status Flow (Day 3)

#### 4.1 Implement Status Transitions
**New file**: `src/services/transactionService.js`

**Actions**:
1. Create function to simulate transaction processing
2. Start transactions as "pending"
3. Simulate network delay (1-2 seconds)
4. Randomly fail 10% of transactions for demo
5. Update status to "success" or "failed" with reason

#### 4.2 Update UI for Status
**Files to modify**: All components showing transactions

**Actions**:
1. Show pending status with spinner
2. Show failed status with error reason
3. Allow retry on failed transactions

---

### Phase 5: Navigation & App Shell (Day 3)

#### 5.1 Redesign Navigation
**File**: `src/App.jsx`

**Requirements**:
1. Clean top navigation bar
2. Active state indication
3. Mobile responsive (hamburger menu)
4. Remove theme toggle (Neo-Fi is dark-only)
5. Logo using icon, not emoji

#### 5.2 Proper Error Boundary
**New file**: `src/components/ErrorBoundary.jsx`

**Actions**:
1. Create class component with componentDidCatch
2. Catch React errors, display fallback UI
3. Add retry mechanism
4. Log errors for debugging

---

### Phase 6: Testing (Day 4)

#### 6.1 Improve Existing Tests
**Files**: `src/test/*.test.jsx`

**Actions**:
1. Fix brittle tests
2. Add more assertions
3. Test error cases
4. Test loading states

#### 6.2 Add Missing Tests
**New files**:
- `src/test/TransactionHistory.test.jsx` (improve existing)
- `src/test/TransactionStatusFlow.test.jsx` (new)
- `src/test/integration/transferFlow.test.jsx` (new integration test)

**Target**: 12-15 tests total

#### 6.3 Test Coverage Goals
- Components: >80%
- Hooks: >80%
- Services: >70%
- Critical user flow: 100% covered

---

### Phase 7: Documentation & Polish (Day 5)

#### 7.1 Create README.md
**New file**: `README.md` at root

**Contents**:
1. Project overview
2. Features list
3. Setup instructions
4. Running the app
5. Running tests
6. Architecture notes
7. Assumptions made
8. Known limitations

#### 7.2 Add db.json Seed
**File**: `db.json` (ensure it exists with proper structure)

**Contents**:
```json
{
  "users": [
    { "id": 1, "name": "Demo User", "balance": 5000 },
    { "id": 2, "name": "Alice Johnson", "balance": 12500 },
    { "id": 3, "name": "Bob Smith", "balance": 3500 }
  ],
  "transactions": []
}
```

#### 7.3 Polish & Micro-interactions
1. Add entrance animations for lists
2. Improve hover states
3. Add keyboard navigation
4. Focus management in modals
5. Aria labels for accessibility

---

## File Structure After Refactor

```
src/
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Badge.jsx
│   │   ├── Icon.jsx
│   │   ├── Skeleton.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Modal.jsx
│   │   └── Toast.jsx
│   ├── Dashboard.jsx            # Feature pages
│   ├── AddMoneyForm.jsx
│   ├── TransferMoneyForm.jsx
│   ├── TransactionHistory.jsx
│   └── ErrorBoundary.jsx        # Error boundary
├── context/
│   ├── WalletContext.jsx         # Consolidated wallet context
│   └── ThemeContext.jsx          # Consolidated theme context
├── services/
│   ├── walletService.js          # Business logic layer
│   └── transactionService.js     # Transaction processing
├── hooks/
│   └── index.js                  # Export useWallet, useTheme
├── styles/
│   └── tokens.css                # Design tokens
├── utils/
│   └── formatters.js             # Currency/date formatting
├── config/
│   └── appConfig.js              # Business rules (keep existing)
├── test/
│   ├── setup.js
│   ├── Dashboard.test.jsx
│   ├── AddMoneyForm.test.jsx
│   ├── TransferMoneyForm.test.jsx
│   ├── TransactionHistory.test.jsx
│   └── integration/
│       └── transferFlow.test.jsx
├── App.jsx
├── App.css                       # Remove most, use tokens
├── main.jsx
└── index.css                     # Base styles + imports
```

---

## Detailed Implementation Checklist

### Day 1: Foundation
- [ ] Restructure context files (merge pairs)
- [ ] Consolidate hooks to single useWallet
- [ ] Create walletService.js
- [ ] Add design tokens to CSS
- [ ] Configure Tailwind theme
- [ ] Add Google Fonts to HTML
- [ ] Create Button component
- [ ] Create Card component
- [ ] Create Input component
- [ ] Install lucide-react (if not present)

### Day 2: Design System + Dashboard
- [ ] Create Select, Badge, Icon components
- [ ] Create Skeleton, EmptyState components
- [ ] Create Modal, Toast components
- [ ] Redesign Dashboard with new components
- [ ] Fix React Router Link usage
- [ ] Add proper loading states
- [ ] Add empty states

### Day 3: Forms + Transaction Flow
- [ ] Redesign AddMoneyForm
- [ ] Redesign TransferMoneyForm with improved modal
- [ ] Implement transaction status flow (pending → success/failed)
- [ ] Create transactionService.js
- [ ] Redesign TransactionHistory
- [ ] Add date range filter

### Day 4: Navigation + Testing
- [ ] Redesign navigation bar
- [ ] Remove emojis, add lucide icons
- [ ] Create proper ErrorBoundary
- [ ] Fix and improve existing tests
- [ ] Add TransactionStatusFlow.test
- [ ] Add transferFlow integration test
- [ ] Run tests and ensure >80% coverage

### Day 5: Polish + Documentation
- [ ] Add micro-interactions (hover, focus, animations)
- [ ] Improve accessibility (aria labels, keyboard nav)
- [ ] Create comprehensive README.md
- [ ] Add db.json seed file
- [ ] Test all flows manually
- [ ] Final bug fixes
- [ ] Code cleanup and linting

---

## Assumptions & Constraints

1. **Single User Focus**: App auto-logs in first user from db.json (no auth per requirements)
2. **json-server Backend**: Using json-server on port 3001 for mock API
3. **Dark Mode Only**: Neo-Fi design is dark-only, remove theme toggle
4. **No Persistence**: Data resets on json-server restart (acceptable per requirements)
5. **Mock Network Delay**: 1-2 second simulated delay for realism
6. **Browser Support**: Modern browsers (ES2020+)

---

## Known Limitations (to document in README)

1. No real authentication (demo user auto-selected)
2. Data resets when json-server restarts
3. No real payment processing (mock only)
4. Transaction failures are randomly simulated
5. No pagination implemented yet (can be added)
6. Date filter uses simple date comparison

---

## Success Criteria

The implementation is complete when:

1. All functional requirements from Requirements.md are met
2. All current issues are resolved
3. Design follows Neo-Fi specifications
4. At least 12 tests passing
5. One integration test covers critical flow
6. README.md documents setup and architecture
7. No ESLint errors or warnings
8. Manual testing confirms all flows work
9. Accessibility passes basic checks (keyboard nav, focus states)

---

## Priority Order

If time-constrained, implement in this order:

1. **Must Have**: Fix React Router, proper error boundary, consolidate contexts
2. **Must Have**: Implement Neo-Fi design system (tokens, base components)
3. **Must Have**: Redesign all pages with new components
4. **Should Have**: Transaction status flow (pending → success/failed)
5. **Should Have**: Tests at current coverage + integration test
6. **Nice to Have**: Date range filter, export, micro-animations
7. **Nice to Have**: README improvements

---

This plan systematically addresses all identified issues while delivering a polished, professional fintech application that meets the assignment requirements.
