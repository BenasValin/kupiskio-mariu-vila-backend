import xss from "xss";
import { isObject, isString, isArray } from "lodash"; // You'll need to install lodash

/**
 * Comprehensive sanitization for MongoDB inputs
 * Applies multiple security measures to prevent:
 * - XSS attacks
 * - NoSQL injection
 * - MongoDB operator injection
 * - Type manipulation
 *
 * @param {any} input - The input to sanitize (string, object, array)
 * @param {Object} options - Configuration options
 * @param {boolean} options.allowDollarPrefixes - Whether to allow $ prefixed keys (default: false)
 * @param {boolean} options.sanitizeStrings - Whether to sanitize strings with xss (default: true)
 * @param {boolean} options.escapeRegex - Whether to escape regex special chars (default: true)
 * @return {any} - Sanitized input safe for MongoDB operations
 */
export function sanitizeForMongo(input, options = {}) {
  const config = {
    allowDollarPrefixes: false,
    sanitizeStrings: true,
    escapeRegex: true,
    ...options,
  };

  // Handle null/undefined
  if (input === null || input === undefined) {
    return input;
  }

  // Handle strings - apply XSS sanitization and regex escaping
  if (isString(input)) {
    let result = input;
    if (config.sanitizeStrings) {
      result = xss(result);
    }
    if (config.escapeRegex) {
      result = escapeRegexChars(result);
    }
    return result;
  }

  // Handle arrays - recursively sanitize each element
  if (isArray(input)) {
    return input.map((item) => sanitizeForMongo(item, config));
  }

  // Handle objects - recursively sanitize keys and values
  if (isObject(input)) {
    const sanitized = {};

    for (const [key, value] of Object.entries(input)) {
      // Handle MongoDB operator injection in keys
      let safeKey = key;

      if (key.startsWith("$") && !config.allowDollarPrefixes) {
        safeKey = `_${key}`; // Prefix $ with underscore to neutralize operators
      }

      // Recursively sanitize nested values
      sanitized[safeKey] = sanitizeForMongo(value, config);
    }

    return sanitized;
  }

  // For other types (numbers, booleans, etc.) - return as is
  return input;
}

/**
 * Escapes special characters used in regular expressions
 * @param {string} str - The string to escape
 * @return {string} - Escaped string safe for regex use
 */
function escapeRegexChars(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Usage examples:
 *
 * // Sanitize a simple string
 * const cleanName = sanitizeForMongo(username);
 *
 * // Sanitize a query object
 * const sanitizedQuery = sanitizeForMongo({
 *   email: userInput,
 *   "$where": "malicious code" // This will be neutralized
 * });
 *
 * // Allow $ operators (when you know the object is safe)
 * const sanitizedAggregation = sanitizeForMongo(aggregationPipeline, {
 *   allowDollarPrefixes: true
 * });
 */
