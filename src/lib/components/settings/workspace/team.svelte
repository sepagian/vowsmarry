<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogTrigger,
	} from '$lib/components/ui/alert-dialog';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { inviteSchema } from '$lib/validation/workspace';

	const { organization, invitations, inviteForm } = $page.data;

	const form = superForm(inviteForm, {
		validators: valibot(inviteSchema),
		onResult: ({ result }) => {
			if (result.type === 'success' && result.data?.success) {
				toast.success(result.data.message || 'Invitation sent successfully');
				$formData.partnerEmail = '';
			} else if (result.type === 'failure') {
				toast.error(result.data?.message || 'Failed to send invitation');
			}
		},
	});

	const { form: formData, errors, enhance: formEnhance } = form;

	// Get current user from page data
	const currentUser = $page.data.user;

	// Find current user's role in the organization
	const currentUserMember = organization?.members?.find(
		(m: any) => m.userId === currentUser?.id
	);
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
</script>

<div class="flex flex-col gap-6">
	<!-- Members List -->
	<Card>
		<CardHeader>
			<CardTitle class="flex items-center gap-2">
				<div class="i-lucide:users h-5 w-5"></div>
				Team Members
			</CardTitle>
			<CardDescription>
				People who have access to this wedding workspace
			</CardDescription>
		</CardHeader>
		<CardContent>
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
								<AlertDialog>
									<AlertDialogTrigger>
										<Button variant="ghost" size="icon">
											<div class="i-lucide:user-minus h-5 w-5"></div>
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Remove Member</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to remove {member.user?.name} from this workspace?
												They will lose access to all wedding planning data.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<form method="POST" action="?/removeMember" use:enhance>
												<input type="hidden" name="memberIdOrEmail" value={member.user?.email} />
												<AlertDialogAction type="submit">Remove</AlertDialogAction>
											</form>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">No members found</p>
			{/if}
		</CardContent>
	</Card>

	<!-- Pending Invitations -->
	{#if invitations && invitations.length > 0}
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<div class="i-lucide:mail h-5 w-5"></div>
					Pending Invitations
				</CardTitle>
				<CardDescription>
					Invitations that haven't been accepted yet
				</CardDescription>
			</CardHeader>
			<CardContent>
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
									<form method="POST" action="?/cancelInvitation" use:enhance>
										<input type="hidden" name="invitationId" value={invitation.id} />
										<Button type="submit" variant="ghost" size="icon">
											<div class="i-lucide:x h-5 w-5"></div>
										</Button>
									</form>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</CardContent>
		</Card>
	{/if}

	<!-- Invite Partner Form -->
	<Card>
		<CardHeader>
			<CardTitle>Invite Partner</CardTitle>
			<CardDescription>
				Send an invitation to your partner to collaborate on wedding planning
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="POST" action="?/inviteMember" use:formEnhance class="space-y-4">
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
		</CardContent>
	</Card>

	<Separator />

	<!-- Leave Workspace -->
	<Card class="border-destructive">
		<CardHeader>
			<CardTitle class="text-destructive">Leave Workspace</CardTitle>
			<CardDescription>
				Remove yourself from this wedding workspace
			</CardDescription>
		</CardHeader>
		<CardContent>
			<AlertDialog>
				<AlertDialogTrigger>
					<Button variant="destructive">
						Leave Workspace
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							You will lose access to all wedding planning data in this workspace.
							{#if isOwner}
								As the owner, you must transfer ownership to another admin before leaving.
							{/if}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<form method="POST" action="?/leaveWorkspace" use:enhance>
							<AlertDialogAction type="submit">Leave Workspace</AlertDialogAction>
						</form>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</CardContent>
	</Card>
</div>
