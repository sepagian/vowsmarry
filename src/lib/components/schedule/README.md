# Schedule CRUD Module

This directory contains components for managing schedules with full CRUD functionality using dialogs.

## Components

### schedule-dialog.svelte
A reusable dialog component for creating and editing schedules.

**Props:**
- `open`: boolean - Controls dialog visibility
- `schedule`: Schedule | null - Schedule data for editing (null for create)
- `onOpenChange`: (open: boolean) => void - Callback when dialog opens/closes
- `onSuccess`: () => void - Callback after successful save

**Features:**
- Form validation using sveltekit-superforms
- Category selection with icons
- Date and time inputs
- Location and venue fields
- Attendees field
- Public/private toggle
- Loading states during submission

### schedule-delete-dialog.svelte
Confirmation dialog for deleting schedules.

**Props:**
- `open`: boolean - Controls dialog visibility
- `schedule`: Schedule | null - Schedule to delete
- `onOpenChange`: (open: boolean) => void - Callback when dialog opens/closes
- `onConfirm`: () => void - Callback after successful deletion

**Features:**
- Warning icon and confirmation message
- Prevents accidental deletion
- Shows schedule name in confirmation

### schedule-list.svelte
Displays schedules in a card grid layout with edit/delete actions.

**Props:**
- `schedules`: Schedule[] - Array of schedules to display
- `onEdit`: (schedule: Schedule) => void - Callback when edit button clicked
- `onDelete`: (schedule: Schedule) => void - Callback when delete button clicked
- `onAdd`: () => void - Callback when add button clicked

**Features:**
- Grid layout (responsive: 1 column on mobile, 2 columns on desktop)
- Category badges with colors and icons
- Public/private indicator
- Date and time display
- Location and attendees information
- Action buttons (Edit, Delete)
- Empty state message

## Integration

The schedule list page (`+page.svelte`) integrates all three components:

1. **View Toggle**: Switch between list and calendar views
2. **List View**: Shows schedules in card grid with CRUD actions
3. **Calendar View**: Shows schedules in interactive calendar
4. **Dialogs**: Handle create, edit, and delete operations

## Usage Flow

### Create Schedule
1. Click "Add Schedule" button
2. Dialog opens with empty form
3. Fill in schedule details
4. Click "Create" button
5. Form submits via POST to `?/createSchedule`
6. Page reloads on success

### Edit Schedule
1. Click "Edit" button on schedule card
2. Dialog opens with pre-filled data
3. Modify schedule details
4. Click "Update" button
5. Form submits via POST to `?/updateSchedule`
6. Page reloads on success

### Delete Schedule
1. Click "Delete" button on schedule card
2. Confirmation dialog appears
3. Click "Delete" to confirm
4. Sends DELETE request via `?/deleteSchedule`
5. Page reloads on success

## Validation

Schedule validation is handled by the `scheduleSchema` from `$lib/validation/planner`:

- `scheduleName`: Required, min 2 characters
- `scheduleCategory`: Required, must be valid category
- `scheduleDate`: Required, must be valid date
- `scheduleStartTime`: Required, must be valid time
- `scheduleEndTime`: Required, must be valid time
- `scheduleLocation`: Required text
- `scheduleVenue`: Required text
- `scheduleAttendees`: Required text
- `isPublic`: Optional boolean

## Toast Notifications

All operations show toast notifications:
- Success: "Schedule created!" / "Schedule updated!" / "Schedule deleted successfully!"
- Error: Shows specific error message
- Validation: Shows validation errors

## Data Types

See `$lib/types.ts` for the Schedule type definition:

```typescript
export type Schedule = {
  id?: string;
  scheduleName: string;
  scheduleCategory: ScheduleCategory;
  scheduleDate: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  scheduleLocation: string;
  scheduleVenue: string;
  scheduleAttendees: string;
  isPublic?: number | boolean;
};
```

## Server Actions

The following server actions are required in `+page.server.ts`:
- `createSchedule`: Creates new schedule
- `updateSchedule`: Updates existing schedule
- `deleteSchedule`: Deletes schedule

These are already implemented and included in the server file.