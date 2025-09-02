import { writable } from 'svelte/store';

export interface Notification {
	id: string;
	type: 'deadline_alert' | 'progress_update' | 'budget_warning' | 'system_notification';
	title: string;
	message: string;
	priority: 'low' | 'medium' | 'high';
	isRead: boolean;
	actionUrl?: string;
	createdAt: Date;
	metadata?: Record<string, any>;
}

export const notifications = writable<Notification[]>([]);
export const unreadCount = writable<number>(0);

export const notificationStore = {
	// Add a new notification
	add: (notification: Omit<Notification, 'id' | 'createdAt'>) => {
		const newNotification: Notification = {
			...notification,
			id: crypto.randomUUID(),
			createdAt: new Date()
		};
		
		notifications.update(items => [newNotification, ...items]);
		
		if (!newNotification.isRead) {
			unreadCount.update(count => count + 1);
		}
	},

	// Mark notification as read
	markAsRead: (id: string) => {
		notifications.update(items => 
			items.map(item => 
				item.id === id ? { ...item, isRead: true } : item
			)
		);
		unreadCount.update(count => Math.max(0, count - 1));
	},

	// Mark all notifications as read
	markAllAsRead: () => {
		notifications.update(items => 
			items.map(item => ({ ...item, isRead: true }))
		);
		unreadCount.set(0);
	},

	// Remove notification
	remove: (id: string) => {
		notifications.update(items => {
			const notification = items.find(item => item.id === id);
			if (notification && !notification.isRead) {
				unreadCount.update(count => Math.max(0, count - 1));
			}
			return items.filter(item => item.id !== id);
		});
	},

	// Clear all notifications
	clear: () => {
		notifications.set([]);
		unreadCount.set(0);
	},

	// Load notifications from server
	load: (serverNotifications: Notification[]) => {
		notifications.set(serverNotifications);
		const unread = serverNotifications.filter(n => !n.isRead).length;
		unreadCount.set(unread);
	}
};