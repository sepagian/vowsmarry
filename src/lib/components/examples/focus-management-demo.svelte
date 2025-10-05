<script lang="ts">
	import { onMount } from 'svelte';
	import { focusManagement, announceErrors, findFirstErrorField, getFocusableElements } from '$lib/actions/focus-management.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	let demoForm: HTMLFormElement;
	let currentDemo = $state('basic');
	let demoResults = $state<string[]>([]);
	let isFormValid = $state(true);

	// Demo form data
	let formData = $state({
		name: '',
		email: '',
		phone: '',
		message: ''
	});

	// Validation errors for demo
	let validationErrors = $state<Record<string, string[]>>({});

	// Add demo result
	function addResult(message: string): void {
		demoResults = [...demoResults, `${new Date().toLocaleTimeString()}: ${message}`];
	}

	// Simulate validation errors
	function simulateValidationErrors(): void {
		validationErrors = {
			name: ['Name is required', 'Name must be at least 2 characters'],
			email: ['Please enter a valid email address'],
			phone: ['Phone number format is invalid'],
			message: ['Message must be at least 10 characters long']
		};
		isFormValid = false;
		addResult('Validation errors simulated');
		
		// Apply error attributes to form fields
		setTimeout(() => {
			const fields = demoForm.querySelectorAll('input, textarea');
			fields.forEach((field) => {
				const fieldName = field.getAttribute('name');
				if (fieldName && validationErrors[fieldName]) {
					field.setAttribute('aria-invalid', 'true');
					field.setAttribute('data-fs-error', '');
				}
			});
		}, 100);
	}

	// Clear validation errors
	function clearValidationErrors(): void {
		validationErrors = {};
		isFormValid = true;
		addResult('Validation errors cleared');
		
		// Remove error attributes from form fields
		const fields = demoForm.querySelectorAll('input, textarea');
		fields.forEach((field) => {
			field.removeAttribute('aria-invalid');
			field.removeAttribute('data-fs-error');
		});
	}

	// Test focus management features
	function testFocusFirstError(): void {
		const firstError = findFirstErrorField(demoForm);
		if (firstError) {
			firstError.focus();
			addResult(`Focused first error field: ${firstError.getAttribute('name')}`);
		} else {
			addResult('No error fields found');
		}
	}

	function testGetFocusableElements(): void {
		const focusable = getFocusableElements(demoForm);
		addResult(`Found ${focusable.length} focusable elements: ${focusable.map(el => el.tagName.toLowerCase()).join(', ')}`);
	}

	function testAnnounceErrors(): void {
		const errors = Object.entries(validationErrors).map(([field, messages]) => ({
			fieldName: field,
			message: messages[0]
		}));
		announceErrors(errors);
		addResult(`Announced ${errors.length} errors to screen readers`);
	}

	// Demo scenarios
	const demos = {
		basic: {
			title: 'Basic Focus Management',
			description: 'Test basic focus management utilities',
			actions: [
				{ label: 'Simulate Errors', action: simulateValidationErrors },
				{ label: 'Focus First Error', action: testFocusFirstError },
				{ label: 'Clear Errors', action: clearValidationErrors }
			]
		},
		keyboard: {
			title: 'Keyboard Navigation',
			description: 'Test keyboard shortcuts for error navigation',
			actions: [
				{ label: 'Simulate Errors', action: simulateValidationErrors },
				{ label: 'Test F8 Navigation', action: () => addResult('Press F8 to navigate between errors') },
				{ label: 'Clear Errors', action: clearValidationErrors }
			]
		},
		screenReader: {
			title: 'Screen Reader Support',
			description: 'Test screen reader announcements and ARIA attributes',
			actions: [
				{ label: 'Simulate Errors', action: simulateValidationErrors },
				{ label: 'Announce Errors', action: testAnnounceErrors },
				{ label: 'Test Focusable Elements', action: testGetFocusableElements },
				{ label: 'Clear Errors', action: clearValidationErrors }
			]
		}
	};

	onMount(() => {
		addResult('Focus management demo initialized');
	});
</script>

<div class="max-w-4xl mx-auto p-6 space-y-8">
	<div class="text-center">
		<h1 class="text-3xl font-bold mb-2">Focus Management Demo</h1>
		<p class="text-muted-foreground">
			Interactive demonstration of focus management and keyboard navigation features
		</p>
	</div>

	<!-- Demo Navigation -->
	<div class="flex justify-center gap-2">
		{#each Object.entries(demos) as [key, demo]}
			<Button
				variant={currentDemo === key ? 'default' : 'outline'}
				size="sm"
				onclick={() => {
					currentDemo = key;
					addResult(`Switched to ${demo.title} demo`);
				}}
			>
				{demo.title}
			</Button>
		{/each}
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Demo Form -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					Demo Form
					<Badge variant={isFormValid ? 'default' : 'destructive'}>
						{isFormValid ? 'Valid' : 'Has Errors'}
					</Badge>
				</CardTitle>
				<CardDescription>
					{demos[currentDemo].description}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					bind:this={demoForm}
					use:focusManagement={{
						announceErrors: true,
						focusDelay: 150,
						scrollIntoView: true,
						scrollBehavior: 'smooth'
					}}
					class="space-y-4"
				>
					<!-- Name Field -->
					<div class="space-y-2">
						<Label for="name">Name *</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="Enter your name"
							bind:value={formData.name}
							aria-describedby={validationErrors.name ? 'name-error' : undefined}
						/>
						{#if validationErrors.name}
							<div id="name-error" role="alert" class="text-destructive text-sm space-y-1">
								{#each validationErrors.name as error}
									<div>• {error}</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Email Field -->
					<div class="space-y-2">
						<Label for="email">Email *</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="Enter your email"
							bind:value={formData.email}
							aria-describedby={validationErrors.email ? 'email-error' : undefined}
						/>
						{#if validationErrors.email}
							<div id="email-error" role="alert" class="text-destructive text-sm space-y-1">
								{#each validationErrors.email as error}
									<div>• {error}</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Phone Field -->
					<div class="space-y-2">
						<Label for="phone">Phone</Label>
						<Input
							id="phone"
							name="phone"
							type="tel"
							placeholder="Enter your phone number"
							bind:value={formData.phone}
							aria-describedby={validationErrors.phone ? 'phone-error' : undefined}
						/>
						{#if validationErrors.phone}
							<div id="phone-error" role="alert" class="text-destructive text-sm space-y-1">
								{#each validationErrors.phone as error}
									<div>• {error}</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Message Field -->
					<div class="space-y-2">
						<Label for="message">Message *</Label>
						<Textarea
							id="message"
							name="message"
							placeholder="Enter your message"
							rows={3}
							bind:value={formData.message}
							aria-describedby={validationErrors.message ? 'message-error' : undefined}
						/>
						{#if validationErrors.message}
							<div id="message-error" role="alert" class="text-destructive text-sm space-y-1">
								{#each validationErrors.message as error}
									<div>• {error}</div>
								{/each}
							</div>
						{/if}
					</div>

					<Button type="submit" class="w-full">
						Submit Form
					</Button>
				</form>
			</CardContent>
		</Card>

		<!-- Demo Controls and Results -->
		<div class="space-y-6">
			<!-- Demo Controls -->
			<Card>
				<CardHeader>
					<CardTitle>{demos[currentDemo].title}</CardTitle>
					<CardDescription>
						{demos[currentDemo].description}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid grid-cols-1 gap-2">
						{#each demos[currentDemo].actions as action}
							<Button
								variant="outline"
								size="sm"
								onclick={action.action}
								class="justify-start"
							>
								{action.label}
							</Button>
						{/each}
					</div>
				</CardContent>
			</Card>

			<!-- Keyboard Shortcuts -->
			<Card>
				<CardHeader>
					<CardTitle>Keyboard Shortcuts</CardTitle>
					<CardDescription>
						Available keyboard shortcuts for error navigation
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-3 text-sm">
						<div class="flex items-center justify-between">
							<span>Navigate to next error</span>
							<kbd class="px-2 py-1 bg-muted rounded text-xs">F8</kbd>
						</div>
						<div class="flex items-center justify-between">
							<span>Navigate to previous error</span>
							<kbd class="px-2 py-1 bg-muted rounded text-xs">Shift+F8</kbd>
						</div>
						<div class="flex items-center justify-between">
							<span>Focus error summary</span>
							<kbd class="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+E</kbd>
						</div>
						<div class="flex items-center justify-between">
							<span>Clear error focus</span>
							<kbd class="px-2 py-1 bg-muted rounded text-xs">Escape</kbd>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Demo Results -->
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center justify-between">
						Demo Results
						<Button
							variant="ghost"
							size="sm"
							onclick={() => {
								demoResults = [];
								addResult('Results cleared');
							}}
						>
							Clear
						</Button>
					</CardTitle>
					<CardDescription>
						Real-time feedback from focus management actions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-1 max-h-64 overflow-y-auto">
						{#if demoResults.length === 0}
							<p class="text-muted-foreground text-sm italic">
								No results yet. Try the demo actions above.
							</p>
						{:else}
							{#each demoResults as result}
								<div class="text-sm font-mono bg-muted/50 p-2 rounded text-xs">
									{result}
								</div>
							{/each}
						{/if}
					</div>
				</CardContent>
			</Card>
		</div>
	</div>

	<!-- Accessibility Information -->
	<Card>
		<CardHeader>
			<CardTitle>Accessibility Features Implemented</CardTitle>
			<CardDescription>
				Comprehensive list of accessibility features in this focus management system
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<h4 class="font-semibold mb-3">Focus Management</h4>
					<ul class="space-y-2 text-sm">
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Automatic focus on first validation error</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Keyboard navigation between errors (F8/Shift+F8)</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Smooth scrolling to error fields</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Focus trapping when enabled</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Escape key to clear error focus</span>
						</li>
					</ul>
				</div>

				<div>
					<h4 class="font-semibold mb-3">Screen Reader Support</h4>
					<ul class="space-y-2 text-sm">
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>ARIA live regions for error announcements</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Proper aria-invalid and aria-describedby attributes</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Role="alert" for immediate error announcements</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Error count announcements</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Contextual error messages</span>
						</li>
					</ul>
				</div>

				<div>
					<h4 class="font-semibold mb-3">Visual Indicators</h4>
					<ul class="space-y-2 text-sm">
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Error state styling with color and borders</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Focus indicators with enhanced visibility</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>High contrast mode support</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Error highlighting and animations</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Reduced motion preferences respected</span>
						</li>
					</ul>
				</div>

				<div>
					<h4 class="font-semibold mb-3">Form Enhancements</h4>
					<ul class="space-y-2 text-sm">
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Error summary with navigation links</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Keyboard shortcut hints</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Multiple error handling per field</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Configurable focus management options</span>
						</li>
						<li class="flex items-start gap-2">
							<span class="text-green-500 mt-0.5">✓</span>
							<span>Real-time validation state updates</span>
						</li>
					</ul>
				</div>
			</div>
		</CardContent>
	</Card>
</div>

<style>
	kbd {
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
		font-size: 0.75rem;
		font-weight: 500;
	}
</style>