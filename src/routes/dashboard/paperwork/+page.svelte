<script lang="ts">
	// Dummy paperwork data
	const documents = [
		{
			id: 1,
			title: 'Marriage License Application',
			type: 'License',
			status: 'approved',
			dueDate: '2024-09-01',
			submittedDate: '2024-08-15',
			fileUrl: '/documents/marriage-license.pdf',
			notes: 'Approved by civil registry office. Original document received.'
		},
		{
			id: 2,
			title: 'Venue Contract',
			type: 'Contract',
			status: 'signed',
			dueDate: '2024-08-30',
			submittedDate: '2024-08-20',
			fileUrl: '/documents/venue-contract.pdf',
			notes: 'Signed contract with Grand Ballroom Jakarta. Deposit paid.'
		},
		{
			id: 3,
			title: 'Catering Agreement',
			type: 'Contract',
			status: 'pending',
			dueDate: '2024-09-05',
			submittedDate: null,
			fileUrl: null,
			notes: 'Waiting for final menu confirmation before signing.'
		},
		{
			id: 4,
			title: 'Photography Release Forms',
			type: 'Release',
			status: 'signed',
			dueDate: '2024-09-10',
			submittedDate: '2024-08-22',
			fileUrl: '/documents/photo-release.pdf',
			notes: 'Model release forms signed by both parties.'
		},
		{
			id: 5,
			title: 'Insurance Certificate',
			type: 'Insurance',
			status: 'pending',
			dueDate: '2024-09-15',
			submittedDate: null,
			fileUrl: null,
			notes: 'Event insurance application in progress.'
		},
		{
			id: 6,
			title: 'Music License',
			type: 'License',
			status: 'rejected',
			dueDate: '2024-08-25',
			submittedDate: '2024-08-18',
			fileUrl: '/documents/music-license-rejected.pdf',
			notes: 'Application rejected. Need to resubmit with correct playlist.'
		}
	];

	const documentStats = {
		total: documents.length,
		approved: documents.filter(d => d.status === 'approved').length,
		signed: documents.filter(d => d.status === 'signed').length,
		pending: documents.filter(d => d.status === 'pending').length,
		rejected: documents.filter(d => d.status === 'rejected').length
	};

	function getStatusIcon(status: string) {
		switch (status) {
			case 'approved':
				return '✅';
			case 'signed':
				return '✍️';
			case 'rejected':
				return '❌';
			default:
				return '⏳';
		}
	}

	function getTypeIcon(type: string) {
		switch (type) {
			case 'License':
				return '📄';
			case 'Contract':
				return '📋';
			case 'Release':
				return '📝';
			case 'Insurance':
				return '🛡️';
			default:
				return '📄';
		}
	}
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<!-- Header -->
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Paperwork & Documents</h1>
		<p class="text-muted-foreground">Track permits, licenses, contracts and important wedding documents.</p>
	</div>

	<!-- Document Statistics -->
	<div class="grid gap-4 md:grid-cols-4">
		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Total Documents</p>
				<svg class="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
				</svg>
			</div>
			<p class="text-2xl font-bold">{documentStats.total}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Approved</p>
				<span class="text-lg">✅</span>
			</div>
			<p class="text-2xl font-bold">{documentStats.approved}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Signed</p>
				<span class="text-lg">✍️</span>
			</div>
			<p class="text-2xl font-bold">{documentStats.signed}</p>
		</div>

		<div class="rounded-lg border bg-card p-4">
			<div class="flex items-center justify-between mb-2">
				<p class="text-sm font-medium text-muted-foreground">Pending</p>
				<span class="text-lg">⏳</span>
			</div>
			<p class="text-2xl font-bold">{documentStats.pending}</p>
		</div>
	</div>

	<!-- Document List -->
	<div class="rounded-lg border bg-card p-4">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold">All Documents</h2>
			<div class="flex gap-2">
				<button class="text-sm font-medium hover:underline">Filter</button>
				<button class="text-sm font-medium hover:underline">Upload Document</button>
			</div>
		</div>

		<div class="space-y-4">
			{#each documents as doc}
				<div class="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
					<div class="flex items-start justify-between mb-3">
						<div class="flex items-start gap-3">
							<div class="flex items-center justify-center w-8 h-8 rounded border">
								<span class="text-sm">{getTypeIcon(doc.type)}</span>
							</div>
							<div>
								<h3 class="font-semibold">{doc.title}</h3>
								<p class="text-sm text-muted-foreground">{doc.type}</p>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="px-2 py-1 text-xs font-medium rounded bg-muted text-muted-foreground">
								{doc.status}
							</span>
							<span class="text-lg">{getStatusIcon(doc.status)}</span>
						</div>
					</div>

					<div class="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground mb-3">
						<div class="flex items-center gap-2">
							<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
							</svg>
							<span>Due: {doc.dueDate}</span>
						</div>
						{#if doc.submittedDate}
							<div class="flex items-center gap-2">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
								</svg>
								<span>Submitted: {doc.submittedDate}</span>
							</div>
						{/if}
						{#if doc.fileUrl}
							<div class="flex items-center gap-2">
								<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
								</svg>
								<a href={doc.fileUrl} class="hover:underline">Download File</a>
							</div>
						{/if}
					</div>

					<div class="p-3 bg-muted rounded-lg">
						<p class="text-sm"><strong>Notes:</strong> {doc.notes}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Upload New Document -->
	<div class="rounded-lg border bg-card p-4">
		<h3 class="text-lg font-semibold mb-3">Upload New Document</h3>
		<div class="grid gap-3 md:grid-cols-2">
			<div>
				<label for="document-title" class="text-sm font-medium text-muted-foreground">Document Title</label>
				<input id="document-title" type="text" placeholder="Enter document title..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="document-type" class="text-sm font-medium text-muted-foreground">Document Type</label>
				<select id="document-type" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>License</option>
					<option>Contract</option>
					<option>Release</option>
					<option>Insurance</option>
					<option>Permit</option>
					<option>Other</option>
				</select>
			</div>
			<div>
				<label for="document-due-date" class="text-sm font-medium text-muted-foreground">Due Date</label>
				<input id="document-due-date" type="date" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
			</div>
			<div>
				<label for="document-status" class="text-sm font-medium text-muted-foreground">Status</label>
				<select id="document-status" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background">
					<option>pending</option>
					<option>submitted</option>
					<option>approved</option>
					<option>signed</option>
					<option>rejected</option>
				</select>
			</div>
		</div>
		<div class="mt-3">
			<label for="document-file" class="text-sm font-medium text-muted-foreground">Upload File</label>
			<input id="document-file" type="file" accept=".pdf,.doc,.docx,.jpg,.png" class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" />
		</div>
		<div class="mt-3">
			<label for="document-notes" class="text-sm font-medium text-muted-foreground">Notes</label>
			<textarea id="document-notes" placeholder="Add any notes about this document..." class="w-full mt-1 px-3 py-2 border rounded-lg bg-background" rows="3"></textarea>
		</div>
		<button class="mt-3 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors">
			Upload Document
		</button>
	</div>
</div>