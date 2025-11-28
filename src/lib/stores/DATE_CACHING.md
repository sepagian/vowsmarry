# Date Caching Strategy

## Overview

Both `TasksState` and `ExpensesState` implement date caching to improve performance when filtering and sorting by due dates.

## Implementation

### Cache Structure

Each store maintains a private `Map<string, Date>` called `dueDateCache`:
- **Key**: Entity ID (task or expense)
- **Value**: Parsed `Date` object

### Cache Methods

#### `getDueDate(entity)`
- Returns cached Date object if available
- Creates and caches Date object if not cached
- Handles entities without IDs by returning uncached Date

#### `clearDateCache(id)`
- Removes cached date for specific entity
- Called when entity is updated or removed

#### `clearAllDateCaches()`
- Clears entire cache
- Called when `set()` replaces all items

### Cache Invalidation

The cache is automatically invalidated in these scenarios:

1. **set()** - Clears all caches when items are replaced
2. **update()** - Clears cache for specific item if `dueDate` field is updated
3. **remove()** - Clears cache for removed item

### Methods Using Cache

The following methods benefit from date caching:

**TasksState:**
- `overdue` getter - Filters tasks with due dates in the past
- `dueSoon` getter - Filters tasks due within 7 days
- `sortByDueDate()` - Sorts tasks by due date

**ExpensesState:**
- `overdue` getter - Filters unpaid expenses with due dates in the past
- `dueSoon` getter - Filters unpaid expenses due within 7 days
- `sortByDueDate()` - Sorts expenses by due date

## Performance Benefits

### Without Caching
```typescript
// Creates new Date object on every access
get overdue(): Task[] {
  const now = new Date();
  return this.tasks.filter(t => {
    const dueDate = new Date(t.taskDueDate); // ❌ New Date created each time
    return dueDate < now;
  });
}
```

### With Caching
```typescript
// Reuses cached Date object
get overdue(): Task[] {
  const now = new Date();
  return this.tasks.filter(t => {
    const dueDate = this.getDueDate(t); // ✅ Cached Date reused
    return dueDate < now;
  });
}
```

### Impact

For a list of 100 tasks/expenses:
- **Without caching**: Creates 100 Date objects per getter access
- **With caching**: Creates 100 Date objects once, reuses on subsequent accesses

When accessing multiple getters (overdue, dueSoon) or sorting repeatedly:
- **Without caching**: 200-300+ Date object creations
- **With caching**: 100 Date object creations (one-time cost)

## Memory Considerations

- Cache size is proportional to number of entities
- Each cached Date object is ~24 bytes
- For 1000 entities: ~24KB memory overhead
- Cache is cleared when items are replaced via `set()`

## Usage Example

```typescript
import { tasksState } from '$lib/stores/tasks.svelte';

// First access - dates are cached
const overdue1 = tasksState.overdue; // Creates and caches Date objects

// Subsequent accesses - uses cached dates
const overdue2 = tasksState.overdue; // Reuses cached Date objects
const dueSoon = tasksState.dueSoon;  // Reuses cached Date objects

// Update task - cache invalidated for that task
tasksState.update('task-1', { taskDueDate: '2025-12-31' });

// Next access - only updated task's date is recalculated
const overdue3 = tasksState.overdue; // Most dates still cached
```

## Testing

To verify caching behavior in production:

1. Open browser DevTools
2. Add breakpoint in `getDueDate()` method
3. Access `overdue` or `dueSoon` getters multiple times
4. Observe cache hits vs misses

## Future Improvements

Potential enhancements:
- Add cache size limits with LRU eviction
- Add cache hit/miss metrics for monitoring
- Implement cache warming on initial load
- Add cache preloading for upcoming date ranges
