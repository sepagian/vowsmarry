# Form Validation Improvements and Recommendations

## Current State Analysis
The codebase uses Zod v4 for schema validation with sveltekit-superforms and the zod4 adapter. Validation schemas are defined for core entities (documents, expenses, tasks, vendors) with basic constraints like minimum lengths, number ranges, enums, and file size limits. Forms display field-level errors and handle success/error states with toast notifications.

## Recommendations for Robust Form Validation

### 1. Enhance Schema Validation
- **Add format validations**: Implement email, phone number, URL, and date format validations using Zod's built-in methods (e.g., `z.string().email()`, `z.string().url()`).
- **Custom validators**: Create reusable custom validators for common patterns like Instagram handles, currency amounts, or file types.
- **Advanced constraints**: Add regex patterns for specific formats (e.g., Instagram username validation).
- **Conditional validation**: Use Zod's `refine()` for cross-field validations (e.g., end date must be after start date).

### 2. Improve Error Messages
- **User-friendly messages**: Replace generic messages with context-specific ones (e.g., "Instagram handle must start with @" instead of "Please insert instagram handle").
- **Consistent tone**: Ensure all error messages follow a consistent, helpful tone.
- **Localization support**: Prepare schemas for internationalization by using message keys instead of hardcoded strings.

### 3. Server-Side Validation Consistency
- **Mirror client schemas**: Ensure server-side validation in action handlers matches client Zod schemas to prevent discrepancies.
- **Database constraints**: Validate against database constraints (e.g., unique fields, foreign keys) and return appropriate error messages.
- **Sanitization**: Add input sanitization to prevent XSS and other injection attacks.

### 4. Form UX Enhancements
- **Loading states**: Add loading indicators during form submission to prevent double-submits.
- **Progressive disclosure**: Show/hide fields based on selections (e.g., conditional fields for vendor status).
- **Auto-save drafts**: Implement auto-save for long forms to prevent data loss.
- **Field focus management**: Automatically focus first invalid field on validation errors.

### 5. Accessibility Improvements
- **ARIA attributes**: Add proper ARIA labels and descriptions for screen readers.
- **Keyboard navigation**: Ensure all form controls are keyboard accessible.
- **Error announcements**: Use ARIA live regions to announce validation errors dynamically.
- **Color contrast**: Ensure error messages meet WCAG contrast requirements.

### 6. Testing Strategy
- **Unit tests**: Write tests for Zod schemas using Vitest or similar.
- **Integration tests**: Test complete form flows including validation and submission.
- **Edge cases**: Test with invalid inputs, network failures, and boundary values.

### 7. Code Organization
- **Shared utilities**: Extract common validation patterns into reusable functions.
- **Schema composition**: Use Zod's composition features to build complex schemas from simpler ones.
- **Type safety**: Leverage TypeScript to ensure form data types match schema expectations.

### 8. Performance Considerations
- **Lazy validation**: Implement debounced validation for expensive checks (e.g., API calls).
- **Schema memoization**: Cache compiled schemas to avoid recompilation on each render.
- **Bundle optimization**: Ensure Zod and superforms are properly tree-shaken.

### 9. Security Enhancements
- **Input sanitization**: Strip potentially dangerous characters from user inputs.
- **Rate limiting**: Implement rate limiting on form submissions to prevent abuse.
- **CSRF protection**: Ensure forms include proper CSRF tokens.

### 10. Future-Proofing
- **Version compatibility**: Keep Zod and superforms versions in sync and update regularly.
- **Extensibility**: Design schemas to easily accommodate new fields or validation rules.
- **Monitoring**: Add logging for validation failures to identify common user issues.

## Specific Implementation Tips

### For Existing Schemas
```typescript
// Enhanced vendor schema example
export const vendorFormSchema = z.object({
  name: z.string().min(1, { message: 'Vendor name is required' }),
  instagram: z.string()
    .min(1, { message: 'Instagram handle is required' })
    .regex(/^@?[a-zA-Z0-9._]+$/, { message: 'Invalid Instagram handle format' }),
  price: z.coerce.number()
    .min(0.01, { message: 'Price must be greater than 0' })
    .max(1000000000, { message: 'Price seems unreasonably high' }),
  // ... other fields
});
```

### For New Features
- Add validation for rundown/schedule forms (currently missing in schedule.ts)
- Implement validation for user registration/login forms
- Add validation for file uploads with proper MIME type checking

### Best Practices
- Always validate on both client and server
- Provide clear, actionable error messages
- Test validation with real user data patterns
- Keep validation logic separate from business logic
- Document validation rules for future maintainers</content>
</xai:function_call</xai:function_call name="run">
<parameter name="command">git status