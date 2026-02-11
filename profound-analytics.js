/**
 * Profound Analytics Integration
 * 
 * This module provides functionality to send application logs to Profound's
 * analytics platform for the Tiger Data documentation website.
 * 
 * @see https://docs.tryprofound.com/agent-analytics/custom
 */

const PROFOUND_API_ENDPOINT = 'https://artemis.api.tryprofound.com/v1/logs/custom';
const PROFOUND_API_KEY = process.env.PROFOUND_API_KEY || 'bot_xxxx';
const MAX_BATCH_SIZE = 1000;
const FLUSH_INTERVAL_MS = 5000; // Flush logs every 5 seconds

class ProfoundAnalytics {
  constructor(apiKey = PROFOUND_API_KEY) {
    this.apiKey = apiKey;
    this.logQueue = [];
    this.flushTimer = null;
    this.isProcessing = false;
  }

  /**
   * Format a log entry for Profound
   * @param {Object} logData - The log data to format
   * @returns {Object} Formatted log entry
   */
  formatLogEntry(logData) {
    const entry = {
      // Required fields
      timestamp: logData.timestamp || new Date().toISOString(),
      method: (logData.method || 'GET').substring(0, 10),
      host: (logData.host || '').substring(0, 255),
      path: (logData.path || '/').substring(0, 2048),
      status_code: logData.status_code || 200,
      ip: (logData.ip || '0.0.0.0').substring(0, 45),
      user_agent: (logData.user_agent || 'Unknown').substring(0, 1024),
    };

    // Optional fields
    if (logData.query_params) {
      entry.query_params = this.formatQueryParams(logData.query_params);
    }
    
    if (logData.referer) {
      entry.referer = logData.referer.substring(0, 2048);
    }
    
    if (typeof logData.bytes_sent === 'number' && logData.bytes_sent >= 0) {
      entry.bytes_sent = logData.bytes_sent;
    }
    
    if (typeof logData.duration_ms === 'number' && logData.duration_ms >= 0) {
      entry.duration_ms = logData.duration_ms;
    }

    return entry;
  }

  /**
   * Format query parameters according to Profound's requirements
   * @param {Object} params - Query parameters object
   * @returns {Object} Formatted query parameters
   */
  formatQueryParams(params) {
    const formatted = {};
    for (const [key, value] of Object.entries(params)) {
      const truncatedKey = key.substring(0, 100);
      const truncatedValue = String(value).substring(0, 1000);
      formatted[truncatedKey] = truncatedValue;
    }
    return formatted;
  }

  /**
   * Add a log entry to the queue
   * @param {Object} logData - The log data to queue
   */
  log(logData) {
    const formattedEntry = this.formatLogEntry(logData);
    this.logQueue.push(formattedEntry);

    // Auto-flush if we reach the batch size limit
    if (this.logQueue.length >= MAX_BATCH_SIZE) {
      this.flush();
    } else {
      // Schedule a flush if not already scheduled
      this.scheduleFlush();
    }
  }

  /**
   * Schedule a flush of the log queue
   */
  scheduleFlush() {
    if (this.flushTimer) {
      return;
    }

    this.flushTimer = setTimeout(() => {
      this.flush();
    }, FLUSH_INTERVAL_MS);
  }

  /**
   * Send queued logs to Profound
   * @returns {Promise<void>}
   */
  async flush() {
    // Clear the flush timer
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    // Avoid concurrent flushes
    if (this.isProcessing || this.logQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    
    try {
      // Process logs in batches of MAX_BATCH_SIZE
      while (this.logQueue.length > 0) {
        const batch = this.logQueue.splice(0, MAX_BATCH_SIZE);
        await this.sendBatch(batch);
      }
    } catch (error) {
      console.error('Error flushing logs to Profound:', error);
      // Re-queue failed logs
      this.logQueue.unshift(...this.logQueue);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Send a batch of logs to Profound
   * @param {Array} batch - Array of log entries
   * @returns {Promise<Object>}
   */
  async sendBatch(batch) {
    const response = await fetch(PROFOUND_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
      body: JSON.stringify(batch),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Profound API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  /**
   * Gracefully shutdown and flush remaining logs
   * @returns {Promise<void>}
   */
  async shutdown() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    await this.flush();
  }
}

/**
 * Express/Connect middleware for logging requests to Profound
 * @param {ProfoundAnalytics} analytics - ProfoundAnalytics instance
 * @returns {Function} Express middleware function
 */
function profoundMiddleware(analytics) {
  return (req, res, next) => {
    const startTime = Date.now();
    
    // Capture the original end function
    const originalEnd = res.end;
    
    // Override the end function to log after response
    res.end = function(...args) {
      // Restore original end function
      res.end = originalEnd;
      
      // Call original end
      res.end.apply(this, args);
      
      // Log the request
      const duration = Date.now() - startTime;
      
      analytics.log({
        timestamp: new Date().toISOString(),
        method: req.method,
        host: req.hostname || req.headers.host,
        path: req.path || req.url,
        status_code: res.statusCode,
        ip: req.ip || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'] || 'Unknown',
        query_params: req.query,
        referer: req.headers['referer'] || req.headers['referrer'],
        bytes_sent: res.get('content-length') ? parseInt(res.get('content-length'), 10) : undefined,
        duration_ms: duration,
      });
    };
    
    next();
  };
}

/**
 * Gatsby onRouteUpdate API hook for client-side tracking
 * @param {Object} context - Gatsby route update context
 * @param {ProfoundAnalytics} analytics - ProfoundAnalytics instance
 */
function onRouteUpdate({ location }, analytics) {
  if (typeof window === 'undefined') {
    return;
  }

  analytics.log({
    timestamp: new Date().toISOString(),
    method: 'GET',
    host: window.location.hostname,
    path: location.pathname,
    status_code: 200,
    ip: '0.0.0.0', // Client-side can't determine real IP
    user_agent: navigator.userAgent,
    query_params: Object.fromEntries(new URLSearchParams(location.search)),
    referer: document.referrer,
  });
}

// Create singleton instance
const analytics = new ProfoundAnalytics();

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    await analytics.shutdown();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await analytics.shutdown();
    process.exit(0);
  });
}

module.exports = {
  ProfoundAnalytics,
  profoundMiddleware,
  onRouteUpdate,
  analytics,
};
