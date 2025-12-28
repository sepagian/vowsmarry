import { dev } from "$app/environment";

/**
 * Sensitive data patterns to mask in logs
 */
export enum SensitivePattern {
  EMAIL = "EMAIL",
  PHONE = "PHONE",
  SSN = "SSN",
  CREDIT_CARD = "CREDIT_CARD",
  API_KEY = "API_KEY",
  PASSWORD = "PASSWORD",
  TOKEN = "TOKEN",
  IP_ADDRESS = "IP_ADDRESS",
}

/**
 * Sanitizer configuration for different types of sensitive data
 */
interface SanitizerConfig {
  pattern: RegExp;
  replacement: string;
  label: string;
}

/**
 * Configuration for sensitive data patterns
 */
const SANITIZER_CONFIGS: Record<SensitivePattern, SanitizerConfig> = {
  [SensitivePattern.EMAIL]: {
    pattern: /[\w.-]+@[\w.-]+\.\w+/g,
    replacement: "[EMAIL]",
    label: "email address",
  },
  [SensitivePattern.PHONE]: {
    pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    replacement: "[PHONE]",
    label: "phone number",
  },
  [SensitivePattern.SSN]: {
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    replacement: "[SSN]",
    label: "social security number",
  },
  [SensitivePattern.CREDIT_CARD]: {
    pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    replacement: "[CREDIT_CARD]",
    label: "credit card number",
  },
  [SensitivePattern.API_KEY]: {
    pattern:
      /(api[_-]?key|apikey|authorization|bearer)\s*[:=]\s*["']?[\w\-.]+["']?/gi,
    replacement: "$1=[API_KEY]",
    label: "API key",
  },
  [SensitivePattern.PASSWORD]: {
    pattern: /(password|passwd|pwd)\s*[:=]\s*["']?[\w\-.!@#$%^&*()]+["']?/gi,
    replacement: "$1=[PASSWORD]",
    label: "password",
  },
  [SensitivePattern.TOKEN]: {
    pattern:
      /(token|jwt|bearer)\s*[:=]\s*["']?(eyJ[A-Za-z0-9_-]{10,}|[A-Za-z0-9_-]{20,})["']?/gi,
    replacement: "$1=[TOKEN]",
    label: "authentication token",
  },
  [SensitivePattern.IP_ADDRESS]: {
    pattern:
      /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    replacement: "[IP_ADDRESS]",
    label: "IP address",
  },
};

/**
 * Fields that should always be redacted from objects
 */
const SENSITIVE_FIELD_NAMES = [
  "password",
  "passwordHash",
  "passwordSalt",
  "apiKey",
  "api_key",
  "secretKey",
  "secret_key",
  "accessToken",
  "access_token",
  "refreshToken",
  "refresh_token",
  "token",
  "jwt",
  "bearer",
  "authorization",
  "ssn",
  "creditCard",
  "credit_card",
  "phoneNumber",
  "phone_number",
  "dob",
  "dateOfBirth",
  "date_of_birth",
  "healthRecord",
  "health_record",
];

/**
 * Secure Logger Service
 *
 * Sanitizes sensitive information from logs to prevent PII/PHI exposure
 * while maintaining useful debugging information.
 *
 * Features:
 * - Pattern-based sanitization of common PII formats
 * - Field-based redaction for known sensitive fields
 * - Context-aware logging levels
 * - Development vs production mode handling
 * - Structured logging support
 *
 * Usage:
 * ```typescript
 * const logger = createSecureLogger('MyComponent');
 * logger.info('User login attempt', { email: 'user@example.com' });
 * // Output: "[MyComponent] User login attempt { email: [EMAIL] }"
 *
 * logger.error('Database error', err);
 * // Automatically sanitizes error messages
 * ```
 */
export class SecureLogger {
  constructor(private context: string = "App") {}

  /**
   * Sanitize a string by removing sensitive patterns
   */
  private sanitizeString(
    value: string,
    patterns: SensitivePattern[] = [],
  ): string {
    let sanitized = value;

    // Apply default patterns if none specified
    const patternsToApply =
      patterns.length > 0
        ? patterns
        : [
            SensitivePattern.EMAIL,
            SensitivePattern.API_KEY,
            SensitivePattern.PASSWORD,
            SensitivePattern.TOKEN,
            SensitivePattern.CREDIT_CARD,
            SensitivePattern.SSN,
            SensitivePattern.PHONE,
          ];

    for (const pattern of patternsToApply) {
      const config = SANITIZER_CONFIGS[pattern];
      sanitized = sanitized.replace(config.pattern, config.replacement);
    }

    return sanitized;
  }

  /**
   * Redact a field value based on field name
   */
  private shouldRedactField(fieldName: string): boolean {
    return SENSITIVE_FIELD_NAMES.some((sensitiveField) =>
      fieldName.toLowerCase().includes(sensitiveField.toLowerCase()),
    );
  }

  /**
   * Create a safe copy of an object with sensitive fields redacted
   */
  private sanitizeObject(obj: unknown, depth: number = 0): unknown {
    // Prevent deep recursion
    if (depth > 5) {
      return "[Object - truncated]";
    }

    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === "string") {
      return this.sanitizeString(obj);
    }

    if (typeof obj === "number" || typeof obj === "boolean") {
      return obj;
    }

    if (obj instanceof Error) {
      return {
        name: obj.name,
        message: this.sanitizeString(obj.message),
        stack: obj.stack ? this.sanitizeString(obj.stack) : undefined,
      };
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item, depth + 1));
    }

    if (typeof obj === "object") {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (this.shouldRedactField(key)) {
          sanitized[key] = "[REDACTED]";
        } else {
          sanitized[key] = this.sanitizeObject(value, depth + 1);
        }
      }
      return sanitized;
    }

    return obj;
  }

  /**
   * Format log message with context
   */
  private formatMessage(message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.context}]`;
    const formattedArgs = args
      .map((arg) => {
        if (typeof arg === "string") {
          return arg;
        }
        return JSON.stringify(this.sanitizeObject(arg));
      })
      .join(" ");

    return `${prefix} ${message} ${formattedArgs}`.trim();
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, ...args: unknown[]): void {
    if (!dev) return;
    const formatted = this.formatMessage(message, ...args);
    console.debug(formatted);
  }

  /**
   * Log info message
   */
  info(message: string, ...args: unknown[]): void {
    const formatted = this.formatMessage(message, ...args);
    console.log(formatted);
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: unknown[]): void {
    const formatted = this.formatMessage(message, ...args);
    console.warn(formatted);
  }

  /**
   * Log error message
   */
  error(message: string, ...args: unknown[]): void {
    const formatted = this.formatMessage(message, ...args);
    console.error(formatted);
  }

  /**
   * Log authentication event (with limited context info)
   */
  logAuthEvent(
    action: string,
    status: "success" | "failure",
    details?: Record<string, unknown>,
  ): void {
    const sanitized = details ? this.sanitizeObject(details) : {};
    const message = `[Auth] ${action}: ${status}`;
    this.info(message, sanitized);
  }

  /**
   * Log security event (with limited PII)
   */
  logSecurityEvent(
    action: string,
    severity: "low" | "medium" | "high" | "critical",
    details?: Record<string, unknown>,
  ): void {
    const sanitized = details ? this.sanitizeObject(details) : {};
    const message = `[Security-${severity.toUpperCase()}] ${action}`;
    if (severity === "critical") {
      this.error(message, sanitized);
    } else {
      this.warn(message, sanitized);
    }
  }

  /**
   * Log database operation with limited field info
   */
  logDatabaseOperation(
    operation: string,
    table: string,
    success: boolean,
    duration?: number,
  ): void {
    const durationStr = duration ? ` (${duration}ms)` : "";
    const status = success ? "success" : "failure";
    const message = `[DB] ${operation} on "${table}": ${status}${durationStr}`;
    this.info(message);
  }

  /**
   * Log API call with sanitized request/response
   */
  logApiCall(
    method: string,
    endpoint: string,
    statusCode: number,
    duration?: number,
  ): void {
    const durationStr = duration ? ` (${duration}ms)` : "";
    const message = `[API] ${method} ${endpoint}: ${statusCode}${durationStr}`;
    this.info(message);
  }

  /**
   * Extract safe workspace info for logging
   * Only logs workspace ID, not sensitive metadata
   */
  extractWorkspaceInfo(workspace: any): Record<string, unknown> {
    if (!workspace) return {};
    return {
      workspaceId: workspace.id,
      slug: workspace.slug,
    };
  }

  /**
   * Extract safe user info for logging
   * Only logs user ID, not sensitive profile data
   */
  extractUserInfo(user: any): Record<string, unknown> {
    if (!user) return {};
    return {
      userId: user.id,
    };
  }
}

/**
 * Create a secure logger instance for a specific context
 *
 * @param context - The context/component name for log prefixes
 * @returns SecureLogger instance
 *
 * @example
 * ```typescript
 * const logger = createSecureLogger('AuthService');
 * logger.info('User authenticated', { userId: 'user123' });
 * ```
 */
export function createSecureLogger(context: string): SecureLogger {
  return new SecureLogger(context);
}

/**
 * Global secure logger instance
 */
export const logger = createSecureLogger("App");
