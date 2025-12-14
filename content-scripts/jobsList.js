/**
 * Jobs List Content Script
 * Highlights jobs based on posting time and handles auto-apply workflow
 */

(function () {
  "use strict";

  console.log("Upwork Helper: Jobs list script loaded");

  // Configuration
  const CONFIG = {
    // Time windows for highlighting (in minutes)
    timeWindows: [
      { minutes: 60, class: "upwork-helper-1h", label: "1 hour" },
      { minutes: 120, class: "upwork-helper-2h", label: "2 hours" },
      { minutes: 240, class: "upwork-helper-4h", label: "4 hours" },
    ],
    checkInterval: 2000, // Check for new jobs every 2 seconds
    autoApplyEnabled: false, // Set to true to enable auto-apply workflow
  };

  // Track processed jobs to avoid re-processing
  const processedJobs = new Set();

  /**
   * Finds all job cards on the page
   * @returns {Array<Element>} - Array of job card elements
   */
  function findJobCards() {
    // Selectors based on sample HTML structure
    const selectors = [
      // Most specific selector from sample HTML
      "section[data-ev-opening_uid]",
      '[data-test="job-tile-list"] > section',
      '[data-test="job-tile-list"] > .air3-card-section',

      // Fallback selectors
      '[data-test="job-tile"]',
      "section.air3-card-section.air3-card-hover",
      'article[class*="job"]',
      'section[class*="job-tile"]',
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        console.log(
          `Upwork Helper: Found ${elements.length} jobs using selector: ${selector}`
        );
        return Array.from(elements);
      }
    }

    return [];
  }

  /**
   * Extracts posting time from a job card
   * @param {Element} jobCard - Job card element
   * @returns {string|null} - Time string or null
   */
  function extractPostingTime(jobCard) {
    // Based on sample HTML: <span data-test="posted-on">5 minutes ago</span>
    const selectors = [
      '[data-test="posted-on"]',
      'span[data-test="posted-on"]',
      ".text-caption span", // Fallback from sample structure
    ];

    for (const selector of selectors) {
      const element = jobCard.querySelector(selector);
      if (element) {
        const text = element.textContent.trim();
        console.log(`Upwork Helper: Found posting time: "${text}"`);
        return text;
      }
    }

    // Fallback: search for any text containing time indicators
    const allText = jobCard.querySelectorAll("span, small");
    for (const el of allText) {
      const text = el.textContent.trim();
      if (
        (text.includes("minute") || text.includes("hour")) &&
        text.includes("ago")
      ) {
        console.log(`Upwork Helper: Found posting time (fallback): "${text}"`);
        return text;
      }
    }

    return null;
  }

  /**
   * Extracts job ID from a job card
   * @param {Element} jobCard - Job card element
   * @returns {string|null} - Job ID or null
   */
  function extractJobId(jobCard) {
    // From sample HTML: data-ev-opening_uid="1999055296412911573"
    const jobId = jobCard.getAttribute("data-ev-opening_uid");
    if (jobId) {
      return jobId;
    }

    // Fallback: try to extract from href
    const link = jobCard.querySelector('a[href*="/jobs/"]');
    if (link) {
      const match = link.href.match(/~(\d+)/);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Extracts job title link from a job card
   * @param {Element} jobCard - Job card element
   * @returns {Element|null} - Link element or null
   */
  function extractJobTitleLink(jobCard) {
    // From sample HTML: <a href="/jobs/..." class="air3-link">Job Title</a>
    const selectors = [
      "h3.job-tile-title a",
      'a.air3-link[data-ev-label="link"]',
      "h3 a.air3-link",
      'a[href*="/jobs/"]',
    ];

    for (const selector of selectors) {
      const link = jobCard.querySelector(selector);
      if (link) {
        return link;
      }
    }

    return null;
  }

  /**
   * Determines highlight class based on posting time
   * @param {string} timeString - Time string (e.g., "5 minutes ago")
   * @returns {string|null} - CSS class name or null
   */
  function getHighlightClass(timeString) {
    if (!window.DateParserUtils || !window.DateParserUtils.isPostedWithinTime) {
      return null;
    }

    // Check each time window from shortest to longest
    for (const timeWindow of CONFIG.timeWindows) {
      if (
        window.DateParserUtils.isPostedWithinTime(
          timeString,
          timeWindow.minutes
        )
      ) {
        return timeWindow.class;
      }
    }

    return null;
  }

  /**
   * Highlights a job card with appropriate color
   * @param {Element} jobCard - Job card element
   * @param {string} className - CSS class to add
   */
  function highlightJobCard(jobCard, className) {
    if (!jobCard.classList.contains(className)) {
      // Remove any existing highlight classes
      CONFIG.timeWindows.forEach((timeWindow) => {
        jobCard.classList.remove(timeWindow.class);
      });

      // Add new highlight class
      jobCard.classList.add(className);

      const timeText = extractPostingTime(jobCard);
      console.log(
        `Upwork Helper: Highlighted job posted ${timeText} with class ${className}`
      );
    }
  }

  /**
   * Sets up auto-apply click handler for a job card
   * @param {Element} jobCard - Job card element
   * @param {string} jobId - Job ID
   */
  function setupAutoApplyHandler(jobCard, jobId) {
    if (!CONFIG.autoApplyEnabled) {
      return;
    }

    const titleLink = extractJobTitleLink(jobCard);
    if (!titleLink) {
      return;
    }

    // Add click handler
    titleLink.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log(`Upwork Helper: Auto-apply initiated for job ${jobId}`);

      try {
        // Store job ID for later use
        await chrome.storage.local.set({ currentJobId: jobId });

        // Navigate to the job detail page
        window.location.href = titleLink.href;
      } catch (error) {
        console.error("Upwork Helper: Error in auto-apply handler:", error);
      }
    });

    // Visual indicator that auto-apply is enabled
    titleLink.style.position = "relative";
    titleLink.setAttribute("data-auto-apply", "true");
  }

  /**
   * Processes a single job card
   * @param {Element} jobCard - Job card element
   */
  function processJobCard(jobCard) {
    // Get job ID
    const jobId = extractJobId(jobCard);
    if (!jobId) {
      return;
    }

    // Skip if already processed
    if (processedJobs.has(jobId)) {
      return;
    }

    processedJobs.add(jobId);

    // Extract posting time
    const timeString = extractPostingTime(jobCard);
    if (!timeString) {
      return; // No time found, skip highlighting
    }

    // Determine highlight class
    const highlightClass = getHighlightClass(timeString);
    if (highlightClass) {
      highlightJobCard(jobCard, highlightClass);
    }

    // Setup auto-apply if enabled
    setupAutoApplyHandler(jobCard, jobId);
  }

  /**
   * Processes all job cards on the page
   */
  function processAllJobCards() {
    const jobCards = findJobCards();

    if (jobCards.length === 0) {
      console.log("Upwork Helper: No job cards found on page");
      return;
    }

    console.log(`Upwork Helper: Found ${jobCards.length} job cards`);
    jobCards.forEach(processJobCard);
  }

  /**
   * Sets up MutationObserver to watch for new jobs
   */
  function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;

      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldProcess = true;
          break;
        }
      }

      if (shouldProcess) {
        processAllJobCards();
      }
    });

    // Observe the main content area for changes
    const targetNode = document.body;

    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });

    console.log("Upwork Helper: MutationObserver initialized");
  }

  /**
   * Checks if auto-apply is enabled in settings
   * @returns {Promise<boolean>}
   */
  async function checkAutoApplyEnabled() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["autoApply"], (result) => {
        CONFIG.autoApplyEnabled = result.autoApply === true;
        resolve(CONFIG.autoApplyEnabled);
      });
    });
  }

  /**
   * Initializes the script
   */
  async function init() {
    // Wait for DateParserUtils to be available
    if (!window.DateParserUtils) {
      console.error("Upwork Helper: DateParserUtils not loaded");
      return;
    }

    // Check auto-apply setting
    await checkAutoApplyEnabled();
    console.log(
      `Upwork Helper: Auto-apply ${
        CONFIG.autoApplyEnabled ? "enabled" : "disabled"
      }`
    );

    // Initial processing
    processAllJobCards();

    // Set up mutation observer for dynamic content
    setupMutationObserver();

    // Periodic check (backup for cases where MutationObserver might miss)
    setInterval(processAllJobCards, CONFIG.checkInterval);

    console.log("Upwork Helper: Initialization complete");
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
