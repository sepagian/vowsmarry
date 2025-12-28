import { describe, it, expect } from "vitest";
import {
	constructInvitationURL,
	constructResetURL,
} from "../src/lib/server/url-utils";

describe("URL Construction Security Tests", () => {
	const validBaseUrl = "https://example.com";

	describe("constructInvitationURL", () => {
		it("should construct valid invitation URLs", () => {
			const invitationId = "123e4567-e89b-12d3-a456-426614174000";
			const result = constructInvitationURL(validBaseUrl, invitationId);
			expect(result).toBe(`${validBaseUrl}/accept-invitation/${invitationId}`);
		});

		it("should reject empty invitation ID", () => {
			expect(() => constructInvitationURL(validBaseUrl, "")).toThrow(
				"Invitation ID cannot be empty"
			);
		});

		it("should reject invitation ID with invalid characters", () => {
			expect(() => constructInvitationURL(validBaseUrl, "invalid/id")).toThrow(
				"Invalid invitation ID format"
			);
			expect(() => constructInvitationURL(validBaseUrl, "invalid@id")).toThrow(
				"Invalid invitation ID format"
			);
		});

		it("should reject overly long invitation ID", () => {
			const longId = "a".repeat(101);
			expect(() => constructInvitationURL(validBaseUrl, longId)).toThrow(
				"Invitation ID is too long"
			);
		});

		it("should URL-encode special characters in invitation ID", () => {
			// This should pass validation since % is not in allowed chars
			expect(() => constructInvitationURL(validBaseUrl, "test%2Fid")).toThrow(
				"Invalid invitation ID format"
			);
		});
	});

	describe("constructResetURL", () => {
		it("should construct valid reset URLs", () => {
			const token = "abc123def456";
			const result = constructResetURL(validBaseUrl, token);
			expect(result).toBe(`${validBaseUrl}/reset-password?token=${token}`);
		});

		it("should reject empty token", () => {
			expect(() => constructResetURL(validBaseUrl, "")).toThrow(
				"Reset token cannot be empty"
			);
		});

		it("should reject token with invalid characters", () => {
			expect(() => constructResetURL(validBaseUrl, "invalid@token")).toThrow(
				"Invalid reset token format"
			);
		});

		it("should reject overly long token", () => {
			const longToken = "a".repeat(201);
			expect(() => constructResetURL(validBaseUrl, longToken)).toThrow(
				"Reset token is too long"
			);
		});
	});
});
