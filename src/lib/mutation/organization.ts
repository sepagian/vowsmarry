export async function updateWorkspaceInfo(data: {
  workspaceName: string;
  slug: string;
  groomName: string;
  brideName: string;
}): Promise<{ success: boolean; message?: string }> {
  const res = await fetch("/api/organization/info", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<{ success: boolean; message?: string }>;
}

export async function updateWeddingDetails(data: {
  weddingDate: string;
  weddingVenue: string;
  weddingBudget: number;
}): Promise<{ success: boolean; message?: string }> {
  const res = await fetch("/api/organization/wedding-details", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<{ success: boolean; message?: string }>;
}

export async function inviteMember(data: {
  partnerEmail: string;
}): Promise<{ success: boolean; message?: string }> {
  const res = await fetch("/api/organization/invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<{ success: boolean; message?: string }>;
}

export async function leaveWorkspace(): Promise<{
  success: boolean;
  redirect?: string;
  message?: string;
}> {
  const res = await fetch("/api/organization/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  return res.json() as Promise<{
    success: boolean;
    redirect?: string;
    message?: string;
  }>;
}

export async function removeMember(
  memberId: string,
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch("/api/organization/remove-member", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId }),
  });

  return res.json() as Promise<{ success: boolean; message?: string }>;
}

export async function cancelInvitation(
  invitationId: string,
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch("/api/organization/cancel-invitation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invitationId }),
  });

  return res.json() as Promise<{ success: boolean; message?: string }>;
}

export async function resendInvitation(
  invitationId: string,
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch("/api/organization/resend-invitation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invitationId }),
  });

  return res.json() as Promise<{ success: boolean; message?: string }>;
}
