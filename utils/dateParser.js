/**
 * Date Parser Utility
 * Parses Upwork's date formats and determines if a job was posted within 1 hour
 */

/**
 * Parses relative time strings from Upwork (e.g., "Posted 30 minutes ago", "Posted 2 hours ago")
 * @param {string} timeString - The time string to parse
 * @returns {number|null} - Minutes ago or null if unable to parse
 */
function parseRelativeTime(timeString) {
  if (!timeString) return null;

  const lowerText = timeString.toLowerCase().trim();

  // Match patterns like "30 minutes ago", "2 hours ago", "1 hour ago"
  const minutesMatch = lowerText.match(/(\d+)\s*(?:minute|min)s?\s*ago/);
  if (minutesMatch) {
    return parseInt(minutesMatch[1], 10);
  }

  const hoursMatch = lowerText.match(/(\d+)\s*(?:hour|hr)s?\s*ago/);
  if (hoursMatch) {
    return parseInt(hoursMatch[1], 10) * 60;
  }

  // Match "just now" or "moments ago"
  if (lowerText.includes('just now') || lowerText.includes('moment')) {
    return 0;
  }

  // Match "less than X minutes ago"
  const lessThanMatch = lowerText.match(/less than (\d+)\s*(?:minute|min)s?\s*ago/);
  if (lessThanMatch) {
    return parseInt(lessThanMatch[1], 10) - 1;
  }

  // Match "about X minutes/hours ago"
  const aboutMinutesMatch = lowerText.match(/about (\d+)\s*(?:minute|min)s?\s*ago/);
  if (aboutMinutesMatch) {
    return parseInt(aboutMinutesMatch[1], 10);
  }

  const aboutHoursMatch = lowerText.match(/about (\d+)\s*(?:hour|hr)s?\s*ago/);
  if (aboutHoursMatch) {
    return parseInt(aboutHoursMatch[1], 10) * 60;
  }

  return null;
}

/**
 * Checks if a job was posted within the specified time window
 * @param {string} timeString - The time string from the job posting
 * @param {number} maxMinutes - Maximum minutes (default: 60 for 1 hour)
 * @returns {boolean} - True if posted within the time window
 */
function isPostedWithinTime(timeString, maxMinutes = 60) {
  const minutesAgo = parseRelativeTime(timeString);
  
  if (minutesAgo === null) {
    return false;
  }

  return minutesAgo <= maxMinutes;
}

/**
 * Checks if a job was posted within 1 hour
 * @param {string} timeString - The time string from the job posting
 * @returns {boolean} - True if posted within 1 hour
 */
function isPostedWithinOneHour(timeString) {
  return isPostedWithinTime(timeString, 60);
}

// Export for use in content scripts
if (typeof window !== 'undefined') {
  window.DateParserUtils = {
    parseRelativeTime,
    isPostedWithinTime,
    isPostedWithinOneHour
  };
}

