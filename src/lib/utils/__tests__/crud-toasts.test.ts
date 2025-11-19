import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { toast } from 'svelte-sonner';
import {
	CrudToasts,
	entityConfigs,
	showCreateSuccess,
	showUpdateSuccess,
	showDeleteSuccess,
	showOperationError,
	executeWithToast,
	executeBatchWithToast,
} from '../crud-toasts.js';

// Mock svelte-sonner
vi.mock('svelte-sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
		promise: vi.fn(),
	},
}));

describe('CrudToasts', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Entity Configurations', () => {
		it('should have configurations for all required entities', () => {
			expect(entityConfigs).toHaveProperty('task');
			expect(entityConfigs).toHaveProperty('vendor');
			expect(entityConfigs).toHaveProperty('document');
			expect(entityConfigs).toHaveProperty('expense');
			expect(entityConfigs).toHaveProperty('rundown');
		});

		it('should have proper structure for each entity config', () => {
			Object.values(entityConfigs).forEach((config) => {
				expect(config).toHaveProperty('name');
				expect(config).toHaveProperty('displayName');
				expect(config).toHaveProperty('operations');
				expect(config.operations).toHaveProperty('create');
				expect(config.operations).toHaveProperty('update');
				expect(config.operations).toHaveProperty('delete');
				expect(config.operations).toHaveProperty('fetch');
			});
		});
	});

	describe('CrudToasts.success', () => {
		it('should show success toast with entity-specific message', () => {
			CrudToasts.success('create', 'task');

			expect(toast.success).toHaveBeenCalledWith(
				'Task created successfully',
				expect.objectContaining({
					duration: 4000,
				}),
			);
		});

		it('should show success toast with item name in description', () => {
			CrudToasts.success('create', 'task', { itemName: 'Wedding Planning' });

			expect(toast.success).toHaveBeenCalledWith(
				'Task created successfully',
				expect.objectContaining({
					duration: 4000,
					description: '"Wedding Planning"',
				}),
			);
		});

		it('should show success toast with undo action for delete operations', () => {
			const undoAction = vi.fn();
			CrudToasts.success('delete', 'task', { undoAction });

			expect(toast.success).toHaveBeenCalledWith(
				'Task deleted successfully',
				expect.objectContaining({
					duration: 4000,
					action: expect.objectContaining({
						label: 'Undo',
					}),
				}),
			);
		});

		it('should use default message when entity is not configured', () => {
			CrudToasts.success('create', 'unknown');

			expect(toast.success).toHaveBeenCalledWith(
				'Item created successfully',
				expect.objectContaining({
					duration: 4000,
				}),
			);
		});
	});

	describe('CrudToasts.error', () => {
		it('should show error toast with entity-specific message', () => {
			CrudToasts.error('create', 'Network error', 'task');

			expect(toast.error).toHaveBeenCalledWith(
				'Failed to create task: Network error',
				expect.objectContaining({
					duration: 6000,
				}),
			);
		});

		it('should show error toast with retry action for network errors', () => {
			const retryAction = vi.fn();
			CrudToasts.error('create', 'Network error', 'task', {
				retryAction,
				isNetworkError: true,
			});

			expect(toast.error).toHaveBeenCalledWith(
				'Failed to create task: Network error',
				expect.objectContaining({
					duration: 6000,
					description: 'Please check your connection and try again',
					action: expect.objectContaining({
						label: 'Retry',
					}),
				}),
			);
		});

		it('should use default message when entity is not configured', () => {
			CrudToasts.error('create', 'Some error', 'unknown');

			expect(toast.error).toHaveBeenCalledWith(
				'Failed to create item: Some error',
				expect.objectContaining({
					duration: 6000,
				}),
			);
		});
	});

	describe('CrudToasts.promise', () => {
		it('should call toast.promise with correct messages', () => {
			const mockPromise = Promise.resolve({ id: 1, name: 'Test Task' });

			CrudToasts.promise(mockPromise, 'create', 'task');

			expect(toast.promise).toHaveBeenCalledWith(
				mockPromise,
				expect.objectContaining({
					loading: 'Creating task...',
					success: expect.any(Function),
					error: 'Failed to create task',
				}),
			);
		});

		it('should use custom messages when provided', () => {
			const mockPromise = Promise.resolve({ id: 1 });
			const customMessages = {
				loading: 'Custom loading...',
				success: 'Custom success!',
				error: 'Custom error!',
			};

			CrudToasts.promise(mockPromise, 'create', 'task', { messages: customMessages });

			expect(toast.promise).toHaveBeenCalledWith(
				mockPromise,
				expect.objectContaining(customMessages),
			);
		});
	});

	describe('CrudToasts.batchPromise', () => {
		it('should handle batch operations with correct messages', () => {
			const promises = [
				Promise.resolve({ id: 1 }),
				Promise.resolve({ id: 2 }),
				Promise.resolve({ id: 3 }),
			];

			CrudToasts.batchPromise(promises, 'create', 'task');

			expect(toast.promise).toHaveBeenCalledWith(
				expect.any(Promise),
				expect.objectContaining({
					loading: 'Creating 3 tasks...',
					success: 'Successfully created 3 tasks',
					error: 'Failed to create some tasks. Please try again.',
				}),
			);
		});
	});

	describe('Convenience Functions', () => {
		it('showCreateSuccess should call CrudToasts.success with create operation', () => {
			const spy = vi.spyOn(CrudToasts, 'success');
			showCreateSuccess('task', 'Test Task');

			expect(spy).toHaveBeenCalledWith('create', 'task', { itemName: 'Test Task' });
		});

		it('showUpdateSuccess should call CrudToasts.success with update operation', () => {
			const spy = vi.spyOn(CrudToasts, 'success');
			showUpdateSuccess('task', 'Test Task');

			expect(spy).toHaveBeenCalledWith('update', 'task', { itemName: 'Test Task' });
		});

		it('showDeleteSuccess should call CrudToasts.success with delete operation and undo', () => {
			const spy = vi.spyOn(CrudToasts, 'success');
			const undoAction = vi.fn();
			showDeleteSuccess('task', 'Test Task', undoAction);

			expect(spy).toHaveBeenCalledWith('delete', 'task', {
				itemName: 'Test Task',
				undoAction,
			});
		});

		it('showOperationError should call CrudToasts.error with correct parameters', () => {
			const spy = vi.spyOn(CrudToasts, 'error');
			const retryAction = vi.fn();
			showOperationError('create', 'task', 'Network error', retryAction, true);

			expect(spy).toHaveBeenCalledWith('create', 'Network error', 'task', {
				retryAction,
				isNetworkError: true,
			});
		});

		it('executeWithToast should call CrudToasts.promise with correct parameters', () => {
			const spy = vi.spyOn(CrudToasts, 'promise');
			const mockPromise = Promise.resolve({ id: 1 });
			const undoAction = vi.fn();

			executeWithToast(mockPromise, 'create', 'task', {
				itemName: 'Test Task',
				undoAction,
			});

			expect(spy).toHaveBeenCalledWith(mockPromise, 'create', 'task', {
				messages: undefined,
				itemName: 'Test Task',
				undoAction,
				retryAction: undefined,
			});
		});

		it('executeBatchWithToast should call CrudToasts.batchPromise with correct parameters', () => {
			const spy = vi.spyOn(CrudToasts, 'batchPromise');
			const promises = [Promise.resolve({ id: 1 }), Promise.resolve({ id: 2 })];

			executeBatchWithToast(promises, 'create', 'task', {
				successMessage: 'All tasks created!',
				errorMessage: 'Some tasks failed!',
			});

			expect(spy).toHaveBeenCalledWith(promises, 'create', 'task', {
				itemCount: 2,
				successMessage: 'All tasks created!',
				errorMessage: 'Some tasks failed!',
			});
		});
	});
});
