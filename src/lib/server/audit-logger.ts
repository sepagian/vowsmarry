import type { Kysely } from "kysely";
import type { Database } from "./db/schema/types";
import { createSecureLogger } from "./logging";

const logger = createSecureLogger("AuditLogger");

/**
 * Audit log action types for critical system operations
 */
export enum AuditAction {
  // Member management
  MEMBER_INVITED = "MEMBER_INVITED",
  MEMBER_REMOVED = "MEMBER_REMOVED",
  MEMBER_ROLE_CHANGED = "MEMBER_ROLE_CHANGED",

  // Invitation management
  INVITATION_CREATED = "INVITATION_CREATED",
  INVITATION_RESENT = "INVITATION_RESENT",
  INVITATION_CANCELLED = "INVITATION_CANCELLED",
  INVITATION_ACCEPTED = "INVITATION_ACCEPTED",

  // Workspace management
  WORKSPACE_CREATED = "WORKSPACE_CREATED",
  WORKSPACE_UPDATED = "WORKSPACE_UPDATED",
  WORKSPACE_DELETED = "WORKSPACE_DELETED",

  // Authentication
  USER_LOGIN = "USER_LOGIN",
  USER_LOGOUT = "USER_LOGOUT",
  USER_REGISTRATION = "USER_REGISTRATION",
  USER_PASSWORD_CHANGED = "USER_PASSWORD_CHANGED",
  USER_EMAIL_CHANGED = "USER_EMAIL_CHANGED",
}

/**
 * Resource types that can be audited
 */
export enum AuditResourceType {
  MEMBER = "MEMBER",
  INVITATION = "INVITATION",
  WORKSPACE = "WORKSPACE",
  USER = "USER",
}

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  organizationId: string;
  userId: string;
  actionType: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string;
  description: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  status: "success" | "failure";
  errorMessage?: string;
}

/**
 * Filter options for querying audit logs
 */
export interface AuditLogFilter {
  organizationId?: string;
  userId?: string;
  actionType?: AuditAction;
  resourceType?: AuditResourceType;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Audit Logger Service
 *
 * Responsible for recording critical system actions to the database
 * for security analysis, compliance, and forensic investigation.
 *
 * Features:
 * - Tracks who performed what action, when, and on what resource
 * - Records IP address and user agent for forensic analysis
 * - Captures changes in JSON format for detailed audit trails
 * - Handles success and failure scenarios
 * - Non-blocking writes to prevent performance impact
 */
export class AuditLogger {
  constructor(private db: Kysely<Database>) {}

  /**
   * Log a critical system action
   *
   * @param entry - Audit log entry details
   * @returns Promise that resolves when log is recorded
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await this.db
        .insertInto("audit_log")
        .values({
          id: this.generateId(),
          organizationId: entry.organizationId,
          userId: entry.userId,
          actionType: entry.actionType,
          resourceType: entry.resourceType,
          resourceId: entry.resourceId || null,
          description: entry.description,
          changes: entry.changes ? JSON.stringify(entry.changes) : null,
          ipAddress: entry.ipAddress || null,
          userAgent: entry.userAgent || null,
          status: entry.status,
          errorMessage: entry.errorMessage || null,
          createdAt: Date.now(),
        })
        .execute();
    } catch (err) {
      // Log but don't throw - audit logging failure shouldn't break the app
      logger.error("Failed to record audit log", err);
    }
  }

  /**
   * Log action asynchronously without waiting for completion
   * Useful for non-critical logging in hot paths
   *
   * @param entry - Audit log entry details
   */
  logAsync(entry: AuditLogEntry): void {
    this.log(entry).catch((err) => {
      logger.error("Async logging failed", err);
    });
  }

  /**
   * Query audit logs with filtering
   *
   * @param filter - Filter options
   * @returns Array of audit log entries
   */
  async query(filter: AuditLogFilter): Promise<any[]> {
    try {
      let query = this.db.selectFrom("audit_log").selectAll();

      if (filter.organizationId) {
        query = query.where(
          "organizationId",
          "=",
          filter.organizationId,
        ) as any;
      }

      if (filter.userId) {
        query = query.where("userId", "=", filter.userId) as any;
      }

      if (filter.actionType) {
        query = query.where("actionType", "=", filter.actionType) as any;
      }

      if (filter.resourceType) {
        query = query.where("resourceType", "=", filter.resourceType) as any;
      }

      if (filter.resourceId) {
        query = query.where("resourceId", "=", filter.resourceId) as any;
      }

      if (filter.startDate) {
        query = query.where(
          "createdAt",
          ">=",
          new Date(filter.startDate),
        ) as any;
      }

      if (filter.endDate) {
        query = query.where("createdAt", "<=", new Date(filter.endDate)) as any;
      }

      query = query.orderBy("createdAt", "desc") as any;

      if (filter.limit) {
        query = query.limit(filter.limit) as any;
      }

      if (filter.offset) {
        query = query.offset(filter.offset) as any;
      }

      return await query.execute();
    } catch (err) {
      logger.error("Failed to query audit logs", err);
      return [];
    }
  }

  /**
   * Get audit logs for a specific resource
   *
   * @param organizationId - Organization ID
   * @param resourceType - Type of resource
   * @param resourceId - ID of resource
   * @param limit - Max number of logs to return
   * @returns Array of audit log entries
   */
  async getResourceHistory(
    organizationId: string,
    resourceType: AuditResourceType,
    resourceId: string,
    limit: number = 50,
  ): Promise<any[]> {
    return this.query({
      organizationId,
      resourceType,
      resourceId,
      limit,
    });
  }

  /**
   * Get user activity logs
   *
   * @param organizationId - Organization ID
   * @param userId - User ID
   * @param limit - Max number of logs to return
   * @returns Array of audit log entries
   */
  async getUserActivity(
    organizationId: string,
    userId: string,
    limit: number = 100,
  ): Promise<any[]> {
    return this.query({
      organizationId,
      userId,
      limit,
    });
  }

  /**
   * Get organization activity logs
   *
   * @param organizationId - Organization ID
   * @param limit - Max number of logs to return
   * @returns Array of audit log entries
   */
  async getOrganizationActivity(
    organizationId: string,
    limit: number = 100,
  ): Promise<any[]> {
    return this.query({
      organizationId,
      limit,
    });
  }

  /**
   * Export audit logs for compliance reporting
   *
   * @param organizationId - Organization ID
   * @param startDate - Start date for export
   * @param endDate - End date for export
   * @returns Array of audit log entries
   */
  async exportLogs(
    organizationId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    return this.query({
      organizationId,
      startDate,
      endDate,
      limit: 10000, // Reasonable export limit
    });
  }

  /**
   * Extract IP address from request headers
   *
   * @param headers - Request headers
   * @returns IP address or null
   */
  static extractIpAddress(headers: Headers): string | null {
    // Check common proxy headers first
    const forwardedFor = headers.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }

    const realIp = headers.get("x-real-ip");
    if (realIp) {
      return realIp;
    }

    // Fallback to direct connection
    return null;
  }

  /**
   * Extract user agent from request headers
   *
   * @param headers - Request headers
   * @returns User agent string or null
   */
  static extractUserAgent(headers: Headers): string | null {
    return headers.get("user-agent");
  }

  /**
   * Generate a unique ID for audit log entry
   *
   * @returns Unique ID
   */
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Create an audit logger instance
 *
 * @param db - Database instance
 * @returns AuditLogger instance
 */
export function createAuditLogger(db: Kysely<Database>): AuditLogger {
  return new AuditLogger(db);
}
