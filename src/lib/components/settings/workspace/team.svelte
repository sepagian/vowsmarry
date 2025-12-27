<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { confirmDelete } from '$lib/components/ui/confirm-delete-dialog';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { inviteSchema } from '$lib/validation/workspace';
	import { auth } from '$lib/utils/toasts';

	const { organization, invitations, inviteForm } = $page.data;

	const form = superForm(inviteForm, {
		validators: valibot(inviteSchema),
		onResult: ({ result }) => {
			if (result.type === 'success' && result.data?.success) {
				auth.success.invitationSent();
				$formData.partnerEmail = '';
			} else if (result.type === 'failure') {
				const errorType = result.data?.errorType;
				if (errorType === 'already_member') {
					auth.error.alreadyMember();
				} else if (errorType === 'invitation_failed') {
					auth.error.invitationFailed();
				} else {
					auth.error.invitationFailed();
				}
			}
		},
	});

	const { form: formData, errors, enhance: formEnhance } = form;

	// Get current user from page data
	const currentUser = $page.data.user;

	// Find current user's role in the organization
	const currentUserMember = organization?.members?.find((m: any) => m.userId === currentUser?.id);
	const isOwner = currentUserMember?.role === 'owner';

	function formatDate(date: string | Date) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	}

	function getRoleBadgeVariant(role: string) {
		switch (role) {
			case 'owner':
				return 'default';
			case 'admin':
				return 'secondary';
			default:
				return 'outline';
		}
	}

	async function handleRemoveMember(memberId: string, memberName: string) {
		const formData = new FormData();
		formData.append('memberId', memberId);

		const response = await fetch('?/removeMember', {
			method: 'POST',
			body: formData,
		});

		const result = (await response.json()) as {
			type: string;
			data?: {
				success?: boolean;
				message?: string;
				redirect?: string;
				errorType?: string;
			};
		};

		if (result.type === 'success' && result.data?.success) {
			auth.success.memberRemoved();
			if (result.data.redirect) {
				await goto(result.data.redirect);
			}
		} else {
			const errorType = result.data?.errorType;
			if (errorType === 'cannot_remove_last_owner') {
				auth.error.cannotRemoveLastOwner();
			} else if (errorType === 'cannot_remove_self') {
				auth.error.cannotRemoveSelf();
			} else {
				auth.error.unexpectedError();
			}
			throw new Error(result.data?.message || 'Failed to remove member');
		}
	}

	async function handleLeaveWorkspace() {
		const formData = new FormData();

		const response = await fetch('?/leaveWorkspace', {
			method: 'POST',
			body: formData,
		});

		const result = (await response.json()) as {
			type: string;
			data?: {
				success?: boolean;
				message?: string;
				redirect?: string;
				errorType?: string;
			};
		};

		if (result.type === 'success' && result.data?.success) {
			auth.success.workspaceLeft();
			if (result.data.redirect) {
				await goto(result.data.redirect);
			}
		} else {
			const errorType = result.data?.errorType;
			if (errorType === 'cannot_remove_last_owner') {
				auth.error.cannotRemoveLastOwner();
			} else {
				auth.error.unexpectedError();
			}
			throw new Error(result.data?.message || 'Failed to leave workspace');
		}
	}
</script>

<div class="flex flex-col gap-6">
	<!-- Members List -->
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2">
				<div class="i-lucide:users h-5 w-5"></div>
				Team Members
			</Card.Title>
			<Card.Description>People who have access to this wedding workspace</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if organization?.members && organization.members.length > 0}
				<div class="space-y-4">
					{#each organization.members as member}
						<div class="flex items-center justify-between p-4 border rounded-lg">
							<div class="flex-1">
								<div class="flex items-center gap-3">
									<div>
										<div class="font-medium">{member.user?.name || 'Unknown'}</div>
										<div class="text-sm text-muted-foreground">{member.user?.email}</div>
									</div>
									<Badge variant={getRoleBadgeVariant(member.role)}>
										{member.role}
									</Badge>
								</div>
								<div class="text-xs text-muted-foreground mt-2 flex items-center gap-1">
									<div class="i-lucide:clock h-5 w-5"></div>
									Joined {formatDate(member.createdAt)}
								</div>
							</div>
							{#if isOwner && member.userId !== currentUser?.id}
								<Button
									variant="ghost"
									size="icon"
									onclick={() => {
										confirmDelete({
											title: 'Remove Member',
											description: `Are you sure you want to remove ${member.user?.name} from this workspace? They will lose access to all wedding planning data.`,
											confirm: {
												text: 'Remove Member',
											},
											onConfirm: async () => {
												await handleRemoveMember(member.userId, member.user?.name || 'member');
											},
										});
									}}
								>
									<div class="i-lucide:user-minus h-5 w-5"></div>
								</Button>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">No members found</p>
			{/if}
		</Card.Content>
	</Card.Root>

	<!-- Pending Invitations -->
	{#if invitations && invitations.length > 0}
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<div class="i-lucide:mail h-5 w-5"></div>
					Pending Invitations
				</Card.Title>
				<Card.Description>Invitations that haven't been accepted yet</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					{#each invitations as invitation}
						{#if invitation.status === 'pending'}
							<div class="flex items-center justify-between p-4 border rounded-lg">
								<div class="flex-1">
									<div class="font-medium">{invitation.email}</div>
									<div class="text-sm text-muted-foreground">
										Invited {formatDate(invitation.createdAt)}
									</div>
								</div>
								<div class="flex items-center gap-2">
									<Badge variant="outline">Pending</Badge>
									<form
										method="POST"
										action="?/cancelInvitation"
										use:enhance
									>
										<input
											type="hidden"
											name="invitationId"
											value={invitation.id}
										/>
										<Button
											type="submit"
											variant="ghost"
											size="icon"
										>
											<div class="i-lucide:x h-5 w-5"></div>
										</Button>
									</form>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- Invite Partner Form -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Invite Partner</Card.Title>
			<Card.Description>
				Send an invitation to your partner to collaborate on wedding planning
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				method="POST"
				action="?/inviteMember"
				use:formEnhance
				class="space-y-4"
			>
				<div class="space-y-2">
					<Label for="partnerEmail">Partner's Email</Label>
					<Input
						id="partnerEmail"
						name="partnerEmail"
						type="email"
						placeholder="partner@example.com"
						bind:value={$formData.partnerEmail}
						aria-invalid={$errors.partnerEmail ? 'true' : undefined}
					/>
					{#if $errors.partnerEmail}
						<p class="text-sm text-destructive">{$errors.partnerEmail}</p>
					{/if}
				</div>
				<Button type="submit">Send Invitation</Button>
			</form>
		</Card.Content>
	</Card.Root>

	<Separator />

	<!-- Leave Workspace -->
	<Card.Root class="border-destructive">
		<Card.Header>
			<Card.Title class="text-destructive">Leave Workspace</Card.Title>
			<Card.Description>Remove yourself from this wedding workspace</Card.Description>
		</Card.Header>
		<Card.Content>
			<Button
				variant="destructive"
				onclick={() => {
					confirmDelete({
						title: 'Are you sure?',
						description: `You will lose access to all wedding planning data in this workspace.${isOwner ? ' As the owner, you must transfer ownership to another admin before leaving.' : ''}`,
						confirm: {
							text: 'Leave Workspace',
						},
						onConfirm: handleLeaveWorkspace,
					});
				}}
			>
				Leave Workspace
			</Button>
		</Card.Content>
	</Card.Root>
</div>
