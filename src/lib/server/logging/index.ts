/**
 * Secure Logging Module
 *
 * This module provides secure logging utilities that sanitize sensitive
 * information before output to prevent exposure of:
 * - Personal Identifiable Information (PII)
 * - Protected Health Information (PHI)
 * - Cardholder Data (payment information)
 * - Organizational secrets and credentials
 */

export {
  SecureLogger,
  createSecureLogger,
  logger,
  SensitivePattern,
} from "./secure-logger";
