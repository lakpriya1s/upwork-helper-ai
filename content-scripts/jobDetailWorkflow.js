/**
 * Job Detail Workflow Content Script
 * Handles auto-apply workflow from job detail card to application submission
 */

(function () {
  "use strict";

  console.log("Upwork Helper: Job detail workflow script loaded");

  // Configuration
  const CONFIG = {
    maxWaitTime: 10000, // Max wait time for elements (10 seconds)
    checkInterval: 500, // Check interval (500ms)
    autoClickDelay: 1000, // Delay before auto-clicking (1 second)
  };

  /**
   * Checks if we're on a job detail card page
   * @returns {boolean}
   */
  function isJobDetailCardPage() {
    const url = window.location.href;
    // From sample HTML URL: https://www.upwork.com/nx/find-work/most-recent/details/~021999055296412911573
    return (
      url.includes("/find-work/") &&
      url.includes("/details/") &&
      url.includes("~0")
    );
  }



  /**
   * Checks if we're on the apply page
   * @returns {boolean}
   */
  function isApplyPage() {
    const url = window.location.href;
    // From sample HTML URL: https://www.upwork.com/nx/proposals/job/~021998744339961847531/apply/
    return url.includes("/proposals/job/") && url.includes("/apply");
  }

  /**
   * Extracts job ID from current URL
   * @returns {string|null}
   */
  function extractJobIdFromUrl() {
    const match = window.location.href.match(/~(\d+)/);
    return match ? match[1] : null;
  }

  /**
   * Finds the Apply Now button on the detail card or job page
   * @returns {Element|null}
   */
  function findApplyButton() {
    // From sample HTML: <button id="submit-proposal-button" ...>Apply now</button>
    const selectors = [
      "button#submit-proposal-button",
      'button[data-cy="submit-proposal-button"]',
      'button[aria-label="Apply now"]',
      'button.air3-btn-primary:contains("Apply now")',
    ];

    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (button && button.textContent.includes("Apply")) {
        return button;
      }
    }

    // Fallback: find any button with "Apply" text
    const buttons = document.querySelectorAll("button");
    for (const button of buttons) {
      if (
        button.textContent.includes("Apply now") ||
        button.textContent.includes("Apply")
      ) {
        return button;
      }
    }

    return null;
  }

  /**
   * Waits for an element to appear
   * @param {Function} findFunction - Function to find element
   * @param {number} maxWait - Max wait time
   * @returns {Promise<Element|null>}
   */
  async function waitForElement(findFunction, maxWait = CONFIG.maxWaitTime) {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const element = findFunction();
      if (element) {
        return element;
      }
      await new Promise((resolve) => setTimeout(resolve, CONFIG.checkInterval));
    }

    return null;
  }

  /**
   * Handles the job detail card workflow
   * Note: User will manually click Apply button, no automation needed
   */
  async function handleJobDetailCard() {
    console.log("Upwork Helper: Job detail card detected (manual mode)");
    // User will manually click the Apply button
    // Upwork will open the apply page in a new tab
    // No automation needed here
  }

  /**
   * Handles the apply page workflow
   * Simply logs that we're on the apply page
   * The actual content generation is handled by jobDetail.js which will:
   * - Wait for Cloudflare/robot checks to be completed by the user
   * - Then extract job data and generate content
   */
  async function handleApplyPage() {
    console.log("Upwork Helper: Apply page detected");

    // Get job ID from URL
    const jobId = extractJobIdFromUrl();
    if (jobId) {
      console.log(`Upwork Helper: Apply page for job ID: ${jobId}`);
    }

    // Clear auto-apply flag if it was set
    const storage = await chrome.storage.local.get(["autoApplyInProgress"]);
    if (storage.autoApplyInProgress) {
      await chrome.storage.local.set({ autoApplyInProgress: false });
      console.log(
        "Upwork Helper: Auto-apply workflow completed, clearing flag"
      );
    }

    // The jobDetail.js script will handle:
    // 1. Waiting for Cloudflare robot check to pass (user completes it)
    // 2. Extracting job data from the page
    // 3. Generating and filling content
    console.log("Upwork Helper: jobDetail.js will handle content generation");
  }

  /**
   * Shows a visual indicator that auto-apply is active
   */
  function showAutoApplyIndicator() {
    // Remove existing indicator if any
    const existing = document.getElementById(
      "upwork-helper-auto-apply-indicator"
    );
    if (existing) {
      existing.remove();
    }

    const indicator = document.createElement("div");
    indicator.id = "upwork-helper-auto-apply-indicator";
    indicator.className = "upwork-helper-indicator";
    indicator.innerHTML = `
      <div class="upwork-helper-indicator-content">
        <span class="upwork-helper-indicator-icon">🤖</span>
        <span class="upwork-helper-indicator-text">Auto-Apply Active</span>
      </div>
    `;

    document.body.appendChild(indicator);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (indicator.parentElement) {
        indicator.remove();
      }
    }, 5000);
  }

  /**
   * Checks for Cloudflare or other robot checks
   */
  async function checkForRobotCheck() {
    // Common selectors for CAPTCHA/robot check
    const robotCheckSelectors = [
      '[class*="captcha"]',
      '[id*="captcha"]',
      'iframe[src*="recaptcha"]',
      'iframe[src*="cloudflare"]',
      '[class*="challenge"]',
      "#challenge-form", // Cloudflare
      ".cf-challenge", // Cloudflare
      "body.no-js", // Cloudflare challenge page
    ];

    for (const selector of robotCheckSelectors) {
      const element = document.querySelector(selector);
      if (element && element.offsetParent !== null) {
        console.log(
          `Upwork Helper: Robot check detected using selector: ${selector}`
        );
        return true;
      }
    }

    // Check for Cloudflare text indicators
    const bodyText = document.body.textContent;
    if (
      bodyText.includes("Checking your browser") ||
      bodyText.includes("Just a moment") ||
      bodyText.includes("Cloudflare")
    ) {
      console.log(
        "Upwork Helper: Cloudflare challenge detected by text content"
      );
      return true;
    }

    return false;
  }

  /**
   * Initializes the workflow handler
   */
  async function init() {
    const currentUrl = window.location.href;
    console.log("Upwork Helper: Initializing workflow handler");
    console.log(`Upwork Helper: Current URL: ${currentUrl}`);
    console.log(
      `Upwork Helper: isJobDetailCardPage() = ${isJobDetailCardPage()}`
    );
    console.log(`Upwork Helper: isApplyPage() = ${isApplyPage()}`);

    // Determine which page we're on and handle accordingly
    if (isJobDetailCardPage()) {
      console.log("Upwork Helper: ✅ Matched: Job Detail Card Page");
      await handleJobDetailCard();
    } else if (isApplyPage()) {
      console.log("Upwork Helper: ✅ Matched: Apply Page");
      // The jobDetail.js script will handle content generation
      await handleApplyPage();
    } else {
      console.log("Upwork Helper: ❌ Not on a recognized job page");
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // Add small delay to ensure page is fully loaded
    setTimeout(init, 1000);
  }

  // Listen for storage changes (e.g., when settings are updated)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && (changes.autoApply || changes.openInNewTab)) {
      console.log("Upwork Helper: Settings changed, reinitializing");
      init();
    }
  });
})();
