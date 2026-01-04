export type EventFilters = {
  showSchedules: boolean;
  showTasks: boolean;
  showExpenses: boolean;
  showOverdueOnly: boolean;
};

class CalendarFiltersState {
  filters = $state<EventFilters>({
    showSchedules: true,
    showTasks: true,
    showExpenses: true,
    showOverdueOnly: false,
  });

  updateFilters(updates: Partial<EventFilters>): void {
    this.filters = { ...this.filters, ...updates };
  }

  toggleFilter(key: keyof EventFilters): void {
    this.filters[key] = !this.filters[key];
  }

  resetFilters(): void {
    this.filters = {
      showSchedules: true,
      showTasks: true,
      showExpenses: true,
      showOverdueOnly: false,
    };
  }
}

export const calendarFiltersState = new CalendarFiltersState();
