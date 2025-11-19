# Document Dashboard Improvements

This document outlines the tasks to enhance `/dashboard/document` by implementing features from `/dashboard/paperwork` in vowsmarry_legacy.

## High Priority Tasks

### 1. [ ] Implement Full CRUD Operations

- [ ] Add create, read, update, delete functionality for documents
- [ ] Replace overview-only approach with interactive forms
- [ ] Include modals for create/edit operations

### 2. [ ] Add Optimistic UI Updates

- [ ] Implement immediate UI feedback for all document operations
- [ ] Show loading states and temporary updates before server confirmation
- [ ] Handle rollback on operation failures

### 6. [ ] Complete File Upload Implementation

- [ ] Replace the TODO in server action with actual file upload logic
- [ ] Add file validation (type, size limits)
- [ ] Integrate with storage system

## Medium Priority Tasks

### 3. [ ] Implement Advanced Filtering System

- [ ] Add search functionality for document titles
- [ ] Include filters for status (pending/approved/rejected)
- [ ] Add type filtering (permit/license/contract/other)
- [ ] Implement due date filters (overdue/upcoming/no date)

### 4. [ ] Add Document Statistics Dashboard

- [ ] Display total document count
- [ ] Show approved, rejected, and pending counts
- [ ] Use visual cards with icons and colors

### 5. [ ] Implement Upcoming Deadlines Alerts

- [ ] Add alert section for documents due within 30 days
- [ ] Include overdue and due soon visual indicators
- [ ] Show due dates prominently

### 7. [ ] Add Document Preview Modal

- [ ] Create modal for previewing PDFs and images
- [ ] Handle different file types appropriately
- [ ] Include download and open-in-new-tab options

### 10. [ ] Add Comprehensive Validation

- [ ] Enhance client-side form validation
- [ ] Improve server-side error handling
- [ ] Provide clear error messages to users

### 11. [ ] Implement Proper File Management

- [ ] Handle file replacement when updating documents
- [ ] Clean up old files from storage on replacement/deletion
- [ ] Ensure file URLs are properly managed

## Low Priority Tasks

### 8. [ ] Enable Quick Status Updates

- [ ] Add inline dropdowns for status changes
- [ ] Implement quick update without full edit form
- [ ] Provide immediate feedback

### 9. [ ] Integrate Reminder Service

- [ ] Connect to reminder system for due date notifications
- [ ] Set up automatic reminders (e.g., 7 days before due date)
- [ ] Handle reminder updates when due dates change

### 12. [ ] Add Toast Notifications

- [ ] Implement success/error notifications for all operations
- [ ] Use toast system for user feedback
- [ ] Ensure consistent messaging across the dashboard

## Implementation Notes

- Start with high-priority tasks as they form the foundation
- Test each feature thoroughly before moving to the next
- Ensure proper error handling and user feedback throughout
- Maintain consistency with existing codebase patterns and styling
- Consider performance implications for large document lists

