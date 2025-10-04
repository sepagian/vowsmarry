# Form Validation Improvement Tasks

This file contains bite-sized tasks derived from VALIDATIONS.MD recommendations. Each task is designed to be completable in 1-2 hours.

## Schema Enhancements
- [ ] Add email format validation to user-related schemas using `z.email()`
- [ ] Implement phone number validation with regex pattern for contact fields
- [ ] Add URL validation for website/social media fields using `z.url()`
- [ ] Create custom validator for Instagram handle format (allow @ prefix, alphanumeric + dots/underscores)
- [ ] Add file type validation for document uploads (PDF, JPG, PNG only)
- [ ] Implement date range validation for event dates (end date after start date)

## Error Message Improvements
- [ ] Replace generic "Please insert" messages with specific, helpful text
- [ ] Add context-specific error messages (e.g., "Price must be greater than 0" instead of "Price must be more than 0")
- [ ] Ensure consistent error message tone across all schemas
- [ ] Prepare error messages for future internationalization by using message keys

## Server-Side Validation
- [ ] Audit server action handlers to ensure they mirror client Zod schemas
- [ ] Add database constraint validation (unique fields, foreign keys) with proper error returns
- [ ] Implement input sanitization in server actions to prevent XSS attacks
- [ ] Add rate limiting to form submission endpoints

## Form UX Enhancements
- [ ] Add loading spinners to form submit buttons during submission
- [ ] Implement auto-focus on first invalid field when validation fails
- [ ] Add progressive disclosure for conditional fields (e.g., vendor status-dependent fields)
- [ ] Implement form draft auto-save for long forms using localStorage

## Accessibility Improvements
- [ ] Add ARIA labels and descriptions to all form fields
- [ ] Ensure keyboard navigation works for all form controls (tabs, selects)
- [ ] Implement ARIA live regions for dynamic error announcements
- [ ] Verify error message color contrast meets WCAG standards

## Testing Implementation
- [ ] Write unit tests for Zod schemas using Vitest
- [ ] Add integration tests for complete form validation flows
- [ ] Test edge cases: empty inputs, maximum lengths, special characters
- [ ] Test form submission with network failures and timeouts

## Code Organization
- [ ] Extract common validation patterns into shared utility functions
- [ ] Refactor schemas to use Zod composition for reusability
- [ ] Ensure TypeScript types are properly inferred from schemas
- [ ] Add JSDoc comments to complex validation functions

## Performance Optimizations
- [ ] Implement debounced validation for expensive checks (if any async validations added)
- [ ] Cache compiled Zod schemas to avoid recompilation
- [ ] Review bundle size impact of validation libraries

## Security Enhancements
- [ ] Add input sanitization functions for text fields
- [ ] Implement CSRF token validation for forms
- [ ] Add validation for file upload sizes and types on server side
- [ ] Sanitize HTML content if rich text fields are added

## New Feature Validations
- [ ] Create validation schema for rundown/schedule forms (populate schedule.ts)
- [ ] Add validation for user registration/login forms
- [ ] Implement validation for invitation/guest management forms
- [ ] Add validation for budget category and item forms

## Monitoring and Maintenance
- [ ] Add logging for validation failures to track common issues
- [ ] Set up automated checks for Zod and superforms version compatibility
- [ ] Document validation rules in code comments for future maintainers
- [ ] Create a validation testing checklist for new form implementations</content>
</xai:function_call</xai:function_call name="run">
<parameter name="command">git status