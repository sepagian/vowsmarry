import type { Kysely } from "kysely";
import type { Database } from "./db/schema/types";

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed within the time window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Key prefix for rate limit tracking */
  keyPrefix: string;
}

/**
 * Standard rate limit configurations
 */
export const RATE_LIMIT_CONFIGS = {
  /**
   * Email invitation sending: 5 requests per 15 minutes per user
   * Prevents email bombing attacks while allowing legitimate use
   */
  INVITE_EMAIL: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyPrefix: "invite_email",
  } as RateLimitConfig,

  /**
   * Invitation resend: 3 requests per 10 minutes per invitation
   * Stricter than initial invite to prevent spam on existing invitations
   */
  RESEND_INVITATION: {
    maxRequests: 3,
    windowMs: 10 * 60 * 1000, // 10 minutes
    keyPrefix: "resend_invitation",
  } as RateLimitConfig,
};

/**
 * Rate limiter result
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfterMs?: number;
}

/**
 * In-memory rate limiter with database persistence for distributed environments
 *
 * This rate limiter tracks requests using an in-memory cache for performance
 * and persists data to the database for server restarts and distributed deployments.
 *
 * Security Features:
 * - Prevents email bombing attacks
 * - Tracks rate limits by user ID and resource key
 * - Automatic cleanup of expired records
 * - Returns remaining requests and retry time
 * - Survives server restarts via database persistence
 */
export class RateLimiter {
  private cache: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(private db: Kysely<Database>) {}

  /**
   * Check if a request is allowed under rate limit
   *
   * @param userId - User ID making the request
   * @param resourceKey - Identifier for the resource (e.g., invitation ID, email address)
   * @param config - Rate limit configuration
   * @returns RateLimitResult with allowed status and remaining requests
   */
  async checkLimit(
    userId: string,
    resourceKey: string,
    config: RateLimitConfig,
  ): Promise<RateLimitResult> {
    const key = `${config.keyPrefix}:${userId}:${resourceKey}`;
    const now = Date.now();

    // Check in-memory cache first
    let entry = this.cache.get(key);

    if (entry && entry.resetTime > now) {
      // Within existing window
      const allowed = entry.count < config.maxRequests;

      if (allowed) {
        entry.count++;
      }

      return {
        allowed,
        remaining: Math.max(0, config.maxRequests - entry.count),
        resetTime: entry.resetTime,
        retryAfterMs: allowed ? undefined : entry.resetTime - now,
      };
    }

    // Window expired or no entry, create new window
    const newEntry = { count: 1, resetTime: now + config.windowMs };
    this.cache.set(key, newEntry);

    // Persist to database asynchronously (don't wait for response)
    this.persistRateLimit(key, 1, newEntry.resetTime).catch((err) => {
      console.error("[RateLimit] Failed to persist rate limit:", err);
    });

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  /**
   * Persist rate limit data to database
   * Used for distributed deployments and server restarts
   */
  private async persistRateLimit(
    key: string,
    count: number,
    resetTime: number,
  ): Promise<void> {
    try {
      // Try to update existing record
      const updated = await this.db
        .updateTable("rate_limit")
        .set({
          count,
          resetTime,
          updatedAt: Date.now(),
        })
        .where("key", "=", key)
        .executeTakeFirst();

      // If no record was updated, insert new one
      if (updated.numUpdatedRows === 0n) {
        await this.db
          .insertInto("rate_limit")
          .values({
            key,
            count,
            resetTime,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
          .execute();
      }
    } catch (err) {
      // Log but don't throw - rate limiting failure shouldn't break the app
      console.error("[RateLimit] Database persistence failed:", err);
    }
  }

  /**
   * Load rate limit from database on startup
   * Helps recover state after server restart
   */
  async loadFromDatabase(key: string): Promise<void> {
    try {
      const record = await this.db
        .selectFrom("rate_limit")
        .selectAll()
        .where("key", "=", key)
        .executeTakeFirst();

      if (record && record.resetTime > Date.now()) {
        this.cache.set(key, {
          count: record.count,
          resetTime: record.resetTime,
        });
      }
    } catch (err) {
      // Log but don't throw - loading failure shouldn't prevent the request
      console.error(
        "[RateLimit] Failed to load rate limit from database:",
        err,
      );
    }
  }

  /**
   * Clean up expired entries from memory
   * Call periodically to prevent unbounded memory growth
   */
  cleanupExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.resetTime <= now) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[RateLimit] Cleaned up ${cleaned} expired entries`);
    }
  }

  /**
   * Reset rate limit for a specific key (admin function)
   * Useful for testing and manual overrides
   */
  async resetLimit(key: string): Promise<void> {
    this.cache.delete(key);

    try {
      await this.db.deleteFrom("rate_limit").where("key", "=", key).execute();
    } catch (err) {
      console.error("[RateLimit] Failed to reset rate limit in database:", err);
    }
  }

  /**
   * Get current rate limit status without incrementing
   */
  getStatus(
    userId: string,
    resourceKey: string,
    config: RateLimitConfig,
  ): RateLimitResult | null {
    const key = `${config.keyPrefix}:${userId}:${resourceKey}`;
    const entry = this.cache.get(key);
    const now = Date.now();

    if (!entry || entry.resetTime <= now) {
      return null;
    }

    return {
      allowed: entry.count < config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: entry.resetTime,
      retryAfterMs:
        entry.count >= config.maxRequests ? entry.resetTime - now : undefined,
    };
  }
}

/**
 * Create a rate limiter instance
 * Typically called once per application startup
 */
export function createRateLimiter(db: Kysely<Database>): RateLimiter {
  return new RateLimiter(db);
}
