import type { User } from "$lib/query/user";

export async function updateProfile(data: {
  userName: string;
  userEmail: string;
  userAvatarUrl?: string;
}): Promise<{ success: boolean; user?: User; message?: string }> {
  const res = await fetch("/api/user/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<{
    success: boolean;
    user?: User;
    message?: string;
  }>;
}

export async function changePassword(data: {
  oldPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message?: string }> {
  const res = await fetch("/api/user/password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json() as Promise<{ success: boolean; message?: string }>;
}

export async function deleteSession(
  sessionId: string
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch("/api/sessions", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });

  return res.json() as Promise<{ success: boolean; message?: string }>;
}

export async function deleteAllSessions(
  currentSessionId: string
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch("/api/sessions/all", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentSessionId }),
  });

  return res.json() as Promise<{ success: boolean; message?: string }>;
}
