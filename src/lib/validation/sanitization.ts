export const sanitizeHtml = (input: string): string => {
  if (!input || typeof input !== "string") return "";

  // Remove script tags and their content
  let sanitized = input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove potentially dangerous HTML tags
  const dangerousTags = [
    "script",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
    "button",
    "textarea",
    "select",
    "option",
    "link",
    "meta",
    "style",
  ];

  dangerousTags.forEach((tag) => {
    const regex = new RegExp(
      `<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`,
      "gi",
    );
    sanitized = sanitized.replace(regex, "");
    const selfClosingRegex = new RegExp(`<${tag}\\b[^>]*\\/>`, "gi");
    sanitized = sanitized.replace(selfClosingRegex, "");
  });

  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/data:/gi, "");

  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^>\s]+/gi, "");

  return sanitized.trim();
};

export const sanitizeText = (input: string): string => {
  if (!input || typeof input !== "string") return "";

  let sanitized = input.replace(/<[^>]*>/g, "");

  sanitized = sanitized
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");

  sanitized = sanitized.replace(/\s+/g, " ").trim();

  return sanitized;
};

export const sanitizeEmail = (input: string): string => {
  if (!input || typeof input !== "string") return "";

  let sanitized = input.toLowerCase().trim();

  sanitized = sanitized.replace(/<[^>]*>/g, "");

  sanitized = sanitized.replace(/[^a-z0-9@._+-]/g, "");

  return sanitized;
};

export const sanitizePhone = (input: string): string => {
  if (!input || typeof input !== "string") return "";

  let sanitized = input.replace(/[^\d\+\-\(\)\s]/g, "");

  sanitized = sanitized.replace(/\s+/g, " ").trim();

  return sanitized;
};

export const sanitizeUrl = (input: string, trustedOrigin?: string): string => {
  if (!input || typeof input !== "string") return "";

  let sanitized = input.trim();

  sanitized = sanitized.replace(/<[^>]*>/g, "");

  const dangerousProtocols = ["javascript:", "data:", "vbscript:", "file:"];
  dangerousProtocols.forEach((protocol) => {
    if (sanitized.toLowerCase().startsWith(protocol)) {
      sanitized = sanitized.substring(protocol.length);
    }
  });

  if (
    sanitized &&
    !sanitized.match(/^https?:\/\//i) &&
    sanitized.includes(".")
  ) {
    sanitized = `https://${sanitized}`;
  }

  // Validate against open redirects by checking against trusted origin
  if (sanitized && sanitized.match(/^https?:\/\//i) && trustedOrigin) {
    try {
      const parsedUrl = new URL(sanitized);
      const trustedUrl = new URL(trustedOrigin);
      if (parsedUrl.origin !== trustedUrl.origin) {
        return "";
      }
    } catch {
      // If URL parsing fails, return empty string
      return "";
    }
  }

  return sanitized;
};

export const sanitizeInstagram = (input: string): string => {
  if (!input || typeof input !== "string") return "";

  let sanitized = input.trim().toLowerCase();

  sanitized = sanitized.replace(/<[^>]*>/g, "");

  sanitized = sanitized.replace(/[^a-z0-9._@]/g, "");

  const atIndex = sanitized.indexOf("@");
  if (atIndex !== -1) {
    sanitized = "@" + sanitized.substring(atIndex + 1).replace(/@/g, "");
  }

  if (sanitized && !sanitized.startsWith("@")) {
    sanitized = "@" + sanitized;
  }

  return sanitized;
};

export const sanitizeNumber = (input: string | number): string => {
  if (typeof input === "number") return input.toString();
  if (!input || typeof input !== "string") return "";

  let sanitized = input.replace(/[^\d.-]/g, "");

  const parts = sanitized.split(".");
  if (parts.length > 2) {
    sanitized = parts[0] + "." + parts.slice(1).join("");
  }

  if (sanitized.includes("-")) {
    const isNegative = sanitized.startsWith("-");
    sanitized = sanitized.replace(/-/g, "");
    if (isNegative) {
      sanitized = "-" + sanitized;
    }
  }

  return sanitized;
};

export const sanitizeFileName = (input: string): string => {
  if (!input || typeof input !== "string") return "";

  // Remove path traversal attempts
  let sanitized = input.replace(/\.\./g, "");

  // Remove dangerous characters for file names
  sanitized = sanitized.replace(/[<>:"/\\|?*\x00-\x1f]/g, "");

  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.substring(sanitized.lastIndexOf("."));
    const name = sanitized.substring(0, sanitized.lastIndexOf("."));
    sanitized = name.substring(0, 255 - ext.length) + ext;
  }

  return sanitized.trim();
};

export const sanitizeSearchQuery = (input: string): string => {
  if (!input || typeof input !== "string") return "";

  let sanitized = input.replace(/<[^>]*>/g, "");

  sanitized = sanitized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  sanitized = sanitized.replace(/\s+/g, " ").trim();

  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }

  return sanitized;
};

export const sanitizeGeneral = (input: string): string => {
  if (!input || typeof input !== "string") return "";

  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  sanitized = sanitized.normalize("NFC");

  sanitized = sanitized.trim();

  return sanitized;
};

export const sanitizationConfig = {
  text: sanitizeText,
  html: sanitizeHtml,
  email: sanitizeEmail,
  phone: sanitizePhone,
  url: sanitizeUrl,
  instagram: sanitizeInstagram,
  number: sanitizeNumber,
  fileName: sanitizeFileName,
  search: sanitizeSearchQuery,
  general: sanitizeGeneral,
} as const;

export const sanitizeByType = (
  input: string,
  type: keyof typeof sanitizationConfig,
): string => {
  const sanitizer = sanitizationConfig[type];
  return sanitizer ? sanitizer(input) : sanitizeGeneral(input);
};

// Valibot-integrated sanitization validators
import * as v from "valibot";

export const sanitizedString = (type: keyof typeof sanitizationConfig) =>
  v.pipe(
    v.string(),
    v.transform((input) => sanitizeByType(input, type)),
  );

export const sanitizedEmail = () =>
  v.pipe(
    v.string(),
    v.transform(sanitizeEmail),
    v.email("Please enter a valid email address"),
  );

export const sanitizedUrl = () =>
  v.pipe(
    v.string(),
    v.transform(sanitizeUrl),
    v.url("Please enter a valid URL"),
  );

export const sanitizedPhone = () =>
  v.pipe(v.string(), v.transform(sanitizePhone));

export const sanitizedInstagram = () =>
  v.pipe(v.string(), v.transform(sanitizeInstagram));

// Safe defaults for common use cases
export const safeString = () => sanitizedString("text");
export const safeHtmlString = () => sanitizedString("html");
export const safeEmail = () => sanitizedEmail();
export const safeUrl = () => sanitizedUrl();
export const safePhone = () => sanitizedPhone();
export const safeInstagram = () => sanitizedInstagram();
