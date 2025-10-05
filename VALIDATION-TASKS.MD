# Validation Tasks

## High Priority Tasks

### 1. Complete Missing Schema Implementations
- [x] Add budget category schema with name, allocated amount, spent amount validation and budget limit check (budgetCategoryFormSchema implemented)
- [ ] Add savings goal schema with target amount, current amount, target date, and description validation (database table missing)
- [ ] Add dowry item schema with type enum, amount, description, and optional proof URL validation (database table missing)
- [ ] Add souvenir schema with type, quantity, cost, and vendor ID validation (database table missing)

### 2. Enhance Existing Schemas
- [x] Implement cross-field validation using Zod's superRefine for more sophisticated checks (expenseFormSchema and scheduleEventFormSchema use superRefine)
- [x] Add dynamic validation based on user selections (e.g., required fields based on vendor status) (taskFormSchema has conditional validation based on priority)

### 3. Improve Error Handling
- [x] Standardize error messages to use the validationMessages object from messages.ts (messages.ts exists but schemas use inline messages)
- [x] Add context-aware messages with dynamic values (e.g., "Amount exceeds budget by $X") (some schemas have dynamic messages)
- [x] Include recovery suggestions in error messages ("Try reducing the amount or increasing the budget") (some messages have suggestions)
- [x] Fix schema consistency between client forms and server actions (resolved "invalid type" errors by using form schemas in actions)

## Medium Priority Tasks

### 4. Form UX Enhancements
- [ ] Implement real-time validation with debounced validation for expensive checks
- [ ] Add progressive disclosure to show/hide fields based on selections with validation updates
- [ ] Implement auto-save drafts with form state persistence and validation feedback
- [ ] Clear validation errors when dependent fields change

### 5. Accessibility Improvements
- [x] Add ARIA integration with aria-describedby linking form fields to error messages (UI components have aria-invalid)
- [x] Ensure screen reader support with immediate announcement of validation messages (aria-invalid helps)
- [x] Implement proper focus management and keyboard navigation for validation errors (comprehensive focus management system implemented)
- [x] Ensure error states meet WCAG guidelines for color and contrast (aria-invalid styling)

### 6. Testing Strategy Expansion
- [x] Add unit tests for expense validation schema (tested in message-standardization.test.ts, dedicated budget/document/schedule/task/vendor test files exist)
- [ ] Add integration tests for complete form workflows including validation and submission
- [x] Test edge cases including boundary values, special characters, and malicious inputs (some tests have edge cases)
- [x] Verify sanitization functions work correctly with dedicated tests (some tests check sanitization)

## Low Priority Tasks

### 7. Performance Optimizations
- [ ] Implement schema memoization to cache compiled schemas and reduce recompilation overhead
- [ ] Add lazy validation with debounced validation for API-dependent checks
- [ ] Optimize bundle by ensuring Zod is properly tree-shaken and consider schema splitting

### 8. Security Enhancements
- [ ] Implement client-side rate limiting for form submissions
- [ ] Ensure all forms include proper CSRF tokens for protection
- [ ] Add server-side validation that mirrors client schemas
- [ ] Implement audit logging for validation failures to enable security monitoring

### 9. Code Organization Improvements
- [ ] Create higher-order schema builders for common validation patterns
- [ ] Implement reusable validation middleware for actions
- [x] Leverage Zod's type inference for better TypeScript integration (types are exported)

### 10. Future-Proofing
- [x] Keep Zod and superforms versions synchronized for compatibility (compatible versions)
- [x] Design schemas to easily accommodate new fields and future requirements (schemas are extensible)
- [ ] Add validation failure tracking for UX improvements and monitoring