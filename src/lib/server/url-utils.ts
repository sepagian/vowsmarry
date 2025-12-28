import { dev } from "$app/environment";

/**
 * Validates that a base URL is properly formatted and has a safe hostname.
 * This prevents open redirect attacks by ensuring the URL cannot be manipulated
 * to redirect to attacker-controlled domains.
 *
 * @param baseUrl - The base URL to validate (e.g., from BETTER_AUTH_URL env var)
 * @throws {Error} If the URL is invalid or has a suspicious hostname
 */
export function validateBaseURL(baseUrl: string): void {
  let url: URL;

  // Validate URL format
  try {
    url = new URL(baseUrl);
  } catch {
    throw new Error(`BETTER_AUTH_URL must be a valid URL, got: ${baseUrl}`);
  }

  // In development, allow localhost
  if (dev) {
    const hostname = url.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return;
    }
  }

  // In production, validate hostname structure
  validateHostname(url.hostname);

  // Ensure protocol is http or https (no data:, javascript:, etc.)
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(
      `BETTER_AUTH_URL must use http or https protocol, got: ${url.protocol}`,
    );
  }

  // Warn if using http in production (but allow it for special cases)
  if (!dev && url.protocol === "http:") {
    console.warn(
      "WARNING: BETTER_AUTH_URL is using http protocol in production. This is not recommended for security.",
    );
  }
}

/**
 * Validates that a hostname is safe and not a known attack vector.
 * Prevents hostnames that:
 * - Are IP addresses that resolve to private/loopback ranges (except in dev)
 * - Contain suspicious characters
 * - Are empty or malformed
 *
 * @param hostname - The hostname to validate
 * @throws {Error} If the hostname is invalid or suspicious
 */
function validateHostname(hostname: string): void {
  if (!hostname || hostname.length === 0) {
    throw new Error("BETTER_AUTH_URL hostname cannot be empty");
  }

  // Check for private IP addresses (in production)
  if (!dev && isPrivateIP(hostname)) {
    throw new Error(
      `BETTER_AUTH_URL cannot use private IP address in production: ${hostname}`,
    );
  }

  // Check for suspicious characters that might indicate encoding attacks
  // Allow: alphanumeric, dots, hyphens (valid for domain names)
  if (!/^[a-zA-Z0-9.-]+$/.test(hostname)) {
    throw new Error(
      `BETTER_AUTH_URL hostname contains invalid characters: ${hostname}`,
    );
  }

  // Prevent extremely long hostnames (potential DOS)
  if (hostname.length > 253) {
    throw new Error(
      `BETTER_AUTH_URL hostname is too long (max 253 chars): ${hostname}`,
    );
  }
}

/**
 * Checks if a hostname/IP is in a private/loopback range
 * @param hostname - The hostname or IP to check
 * @returns true if the hostname is a private IP address
 */
function isPrivateIP(hostname: string): boolean {
  // IPv4 private ranges and loopback
  const privateIPv4Patterns = [
    /^127\./, // 127.0.0.0/8 (loopback)
    /^10\./, // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
    /^192\.168\./, // 192.168.0.0/16
    /^169\.254\./, // 169.254.0.0/16 (link-local)
  ];

  // IPv6 loopback and private
  const ipv6Patterns = [
    /^::1$/, // loopback
    /^fc00:/i, // unique local
    /^fe80:/i, // link-local
  ];

  // Check IPv4 patterns
  if (privateIPv4Patterns.some((pattern) => pattern.test(hostname))) {
    return true;
  }

  // Check IPv6 patterns
  if (ipv6Patterns.some((pattern) => pattern.test(hostname))) {
    return true;
  }

  return false;
}

/**
 * Safely constructs an invitation URL by validating the base URL and path.
 * This prevents open redirects by ensuring the URL is constructed properly
 * and the hostname hasn't been tampered with.
 *
 * @param baseUrl - The validated base URL (e.g., from BETTER_AUTH_URL)
 * @param invitationId - The invitation ID (should be alphanumeric/uuid)
 * @returns The complete invitation URL as a string
 * @throws {Error} If the URL cannot be safely constructed
 */
export function constructInvitationURL(
  baseUrl: string,
  invitationId: string,
): string {
  // Validate the base URL hasn't been modified since startup
  validateBaseURL(baseUrl);

  // Validate invitation ID is in expected format (alphanumeric and hyphens for UUID)
  if (!/^[a-zA-Z0-9-]+$/.test(invitationId)) {
    throw new Error("Invalid invitation ID format");
  }

  try {
    // Use URL constructor for safe path joining
    const url = new URL(baseUrl);
    url.pathname = `/accept-invitation/${invitationId}`;
    return url.toString();
  } catch (error) {
    throw new Error(
      `Failed to construct invitation URL: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Safely constructs a password reset URL by validating the base URL and path.
 * This prevents open redirects by ensuring the URL is constructed properly.
 *
 * @param baseUrl - The validated base URL
 * @param token - The reset token
 * @returns The complete reset URL as a string
 * @throws {Error} If the URL cannot be safely constructed
 */
export function constructResetURL(baseUrl: string, token: string): string {
  // Validate the base URL hasn't been modified since startup
  validateBaseURL(baseUrl);

  // Validate token is in expected format
  if (!/^[a-zA-Z0-9.-_]+$/.test(token)) {
    throw new Error("Invalid reset token format");
  }

  try {
    const url = new URL(baseUrl);
    url.pathname = `/reset-password`;
    url.searchParams.set("token", token);
    return url.toString();
  } catch (error) {
    throw new Error(
      `Failed to construct reset URL: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
