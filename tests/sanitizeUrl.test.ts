import { describe, it, expect } from "vitest";
import { sanitizeUrl } from "../src/lib/validation/sanitization";

describe("sanitizeUrl - Open Redirect Security Tests", () => {
  const trustedOrigin = "https://vowsmarry.com";

  describe("Protocol Validation", () => {
    it("should reject javascript: protocol", () => {
      const result = sanitizeUrl("javascript:alert('xss')", trustedOrigin);
      expect(result).toBe("");
    });

    it("should reject data: protocol", () => {
      const result = sanitizeUrl("data:text/html,<script>alert('xss')</script>", trustedOrigin);
      expect(result).toBe("");
    });

    it("should reject vbscript: protocol", () => {
      const result = sanitizeUrl("vbscript:msgbox('xss')", trustedOrigin);
      expect(result).toBe("");
    });

    it("should reject file: protocol", () => {
      const result = sanitizeUrl("file:///etc/passwd", trustedOrigin);
      expect(result).toBe("");
    });
  });

  describe("Open Redirect Prevention (NEW)", () => {
    it("should reject external domains with valid https protocol", () => {
      const result = sanitizeUrl("https://evil.com", trustedOrigin);
      expect(result).toBe("");
    });

    it("should reject phishing URLs with valid https protocol", () => {
      const result = sanitizeUrl("https://evil.com/phishing", trustedOrigin);
      expect(result).toBe("");
    });

    it("should reject external domains with valid http protocol", () => {
      const result = sanitizeUrl("http://attacker.com/redirect", trustedOrigin);
      expect(result).toBe("");
    });

    it("should allow same-origin URLs", () => {
      const url = "https://vowsmarry.com/verify?token=abc123";
      const result = sanitizeUrl(url, trustedOrigin);
      expect(result).toBe(url);
    });

    it("should allow same-origin with different paths", () => {
      const url = "https://vowsmarry.com/accept-invitation/inv_123";
      const result = sanitizeUrl(url, trustedOrigin);
      expect(result).toBe(url);
    });

    it("should allow same-origin with query parameters", () => {
      const url = "https://vowsmarry.com/reset-password?token=xyz789";
      const result = sanitizeUrl(url, trustedOrigin);
      expect(result).toBe(url);
    });

    it("should reject subdomain as external domain", () => {
      const result = sanitizeUrl("https://evil.vowsmarry.com", trustedOrigin);
      expect(result).toBe("");
    });

    it("should reject different port as external domain", () => {
      const result = sanitizeUrl("https://vowsmarry.com:8080/verify", trustedOrigin);
      expect(result).toBe("");
    });

    it("should return empty string if trustedOrigin is invalid", () => {
      const result = sanitizeUrl("https://vowsmarry.com/verify", "not-a-valid-url");
      expect(result).toBe("");
    });
  });

  describe("Without trustedOrigin (Backward Compatibility)", () => {
    it("should allow https URLs without trustedOrigin validation", () => {
      const url = "https://example.com/page";
      const result = sanitizeUrl(url);
      expect(result).toBe(url);
    });

    it("should allow http URLs without trustedOrigin validation", () => {
      const url = "http://example.com/page";
      const result = sanitizeUrl(url);
      expect(result).toBe(url);
    });

    it("should still block javascript: protocol without trustedOrigin", () => {
      const result = sanitizeUrl("javascript:alert('xss')");
      expect(result).toBe("");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string", () => {
      const result = sanitizeUrl("", trustedOrigin);
      expect(result).toBe("");
    });

    it("should handle null-like input", () => {
      const result = sanitizeUrl("", trustedOrigin);
      expect(result).toBe("");
    });

    it("should handle HTML tags in URL", () => {
      const result = sanitizeUrl("<script>alert('xss')</script>", trustedOrigin);
      expect(result).toBe("");
    });

    it("should trim whitespace from URLs", () => {
      const url = "  https://vowsmarry.com/verify  ";
      const result = sanitizeUrl(url, trustedOrigin);
      expect(result).toBe("https://vowsmarry.com/verify");
    });
  });

  describe("Common Attack Vectors", () => {
    it("should reject URL that looks like trusted domain but isn't", () => {
      const result = sanitizeUrl("https://vowsmarry-fake.com/verify", trustedOrigin);
      expect(result).toBe("");
    });

    it("should reject URL that starts with trusted domain as subdomain", () => {
      const result = sanitizeUrl("https://vowsmarry.com.evil.com/verify", trustedOrigin);
      expect(result).toBe("");
    });

    it("should reject URL with userinfo attempting injection", () => {
      const result = sanitizeUrl("https://evil.com@vowsmarry.com/verify", trustedOrigin);
      expect(result).toBe("");
    });

    it("should reject unicode/punycode domain attacks", () => {
      const result = sanitizeUrl("https://xn--vowsmarry-fake.com/verify", trustedOrigin);
      expect(result).toBe("");
    });
  });
});
