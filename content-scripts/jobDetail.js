/**
 * Job Detail Content Script
 * Extracts job data and generates cover letter on Upwork job detail pages
 */

(function () {
  "use strict";

  console.log("Upwork Helper: Job detail script loaded");

  // Configuration
  const CONFIG = {
    maxWaitTime: 10000, // Max wait time for elements (10 seconds)
    checkInterval: 500, // Check interval for textarea (500ms)
    retryAttempts: 3,
    notificationDuration: 5000, // 5 seconds
  };

  // State
  let coverLetterGenerated = false;
  let isGenerating = false;

  /**
   * Finds the cover letter textarea on the page
   * @returns {Promise<Element|null>} - Textarea element or null
   */
  async function findCoverLetterTextarea() {
    const selectors = [
      // Actual Upwork selectors (from real proposal page)
      'textarea[aria-labelledby="cover_letter_label"]',
      'textarea.air3-textarea.inner-textarea[aria-labelledby="cover_letter_label"]',
      ".air3-textarea.textarea-wrapper textarea.inner-textarea",

      // Fallback selectors
      'textarea[name="cover_letter"]',
      'textarea[id*="cover"]',
      'textarea[id*="letter"]',
      'textarea[placeholder*="cover letter"]',
      'textarea[aria-label*="cover letter"]',
      'textarea[data-test="cover-letter"]',
      "textarea.cover-letter",

      // Generic fallback - first textarea with 10 rows (common for cover letters)
      'textarea[rows="10"]',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        console.log("Upwork Helper: Found textarea with selector:", selector);
        return element;
      }
    }

    // Additional fallback: Find the first visible textarea that's not in questions section
    const textareas = document.querySelectorAll("textarea");
    for (const textarea of textareas) {
      const hasQuestionParent = textarea.closest(".fe-proposal-job-questions");
      if (!hasQuestionParent && textarea.offsetParent !== null) {
        console.log("Upwork Helper: Using fallback first visible textarea");
        return textarea;
      }
    }

    return null;
  }

  /**
   * Waits for an element to appear on the page
   * @param {Function} findFunction - Function that returns the element
   * @param {number} maxWait - Maximum wait time in ms
   * @returns {Promise<Element|null>}
   */
  async function waitForElement(findFunction, maxWait = CONFIG.maxWaitTime) {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const element = await findFunction();
      if (element) {
        return element;
      }
      await new Promise((resolve) => setTimeout(resolve, CONFIG.checkInterval));
    }

    return null;
  }

  /**
   * Shows a notification to the user
   * @param {string} message - Message to display
   * @param {string} type - 'success', 'error', or 'info'
   */
  function showNotification(message, type = "info") {
    // Remove existing notification if any
    const existing = document.getElementById("upwork-helper-notification");
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement("div");
    notification.id = "upwork-helper-notification";
    notification.className = `upwork-helper-notification upwork-helper-notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, CONFIG.notificationDuration);
  }

  /**
   * Gets job data from storage or extracts from page
   * @returns {Promise<Object>} Job data object
   */
  async function getJobData() {
    // First, try to get job ID from URL
    const urlMatch = window.location.href.match(/~(\d+)/);
    const jobId = urlMatch ? urlMatch[1] : null;

    // Try to get stored job data
    if (jobId) {
      console.log(`Upwork Helper: Looking for stored data for job ${jobId}`);
      const storage = await chrome.storage.local.get([
        `jobData_${jobId}`,
        "lastExtractedJobId",
      ]);

      let jobData = storage[`jobData_${jobId}`];

      // If not found, try the last extracted job
      if (!jobData && storage.lastExtractedJobId) {
        console.log(
          "Upwork Helper: Using data from last extracted job:",
          storage.lastExtractedJobId
        );
        const lastJobData = await chrome.storage.local.get(
          `jobData_${storage.lastExtractedJobId}`
        );
        jobData = lastJobData[`jobData_${storage.lastExtractedJobId}`];
      }

      if (jobData && window.JobExtractorUtils.validateJobData(jobData)) {
        console.log("Upwork Helper: Using stored job data");
        return jobData;
      }
    }

    // If no stored data found, extract from current page
    console.log("Upwork Helper: Extracting job data from current page");
    const jobData = window.JobExtractorUtils.extractJobData();
    return jobData;
  }

  /**
   * Generates cover letter and injects it into textarea
   */
  async function generateAndInjectCoverLetter() {
    if (coverLetterGenerated || isGenerating) {
      console.log(
        "Upwork Helper: Cover letter already generated or generation in progress"
      );
      return;
    }

    isGenerating = true;
    console.log("Upwork Helper: Starting cover letter generation");

    try {
      // Check if utilities are loaded
      if (!window.JobExtractorUtils) {
        throw new Error("Job extractor utilities not loaded");
      }

      // Get job data (from storage or page)
      const jobData = await getJobData();

      // Validate job data
      if (!window.JobExtractorUtils.validateJobData(jobData)) {
        throw new Error(
          "Could not extract essential job data (title and description required)"
        );
      }

      console.log("Upwork Helper: Job data ready for generation");
      window.JobExtractorUtils.debugJobData(jobData);

      // Show loading notification
      showNotification("Generating content...", "info");

      // Send message to background script to generate cover letter
      const response = await chrome.runtime.sendMessage({
        action: "generateCoverLetter",
        jobData: jobData,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to generate cover letter");
      }

      console.log("Upwork Helper: Cover letter generated successfully");

      // Find the cover letter textarea
      const textarea = await findCoverLetterTextarea();

      if (!textarea) {
        // Show success but inform user to paste manually
        showNotification(
          "Cover letter generated! Check console and copy manually.",
          "success"
        );
        console.log("=== GENERATED COVER LETTER ===");
        console.log(response.coverLetter);
        console.log("==============================");
        coverLetterGenerated = true;
        return;
      }

      // Inject the cover letter into the textarea
      textarea.value = response.coverLetter;

      // Trigger events
      triggerTextareaEvents(textarea);

      // Add visual feedback
      textarea.classList.add("upwork-helper-filled");

      console.log("Upwork Helper: Cover letter injected into textarea");

      // Check for additional question fields
      const questionData = extractQuestionData();
      if (questionData.length > 0) {
        console.log(
          `Upwork Helper: Found ${questionData.length} additional question(s)`
        );
        showNotification(
          "Generating answers for additional questions...",
          "info"
        );

        // Generate answers for additional questions
        await generateQuestionAnswers(questionData, jobData);
      }

      // Show final success notification
      showNotification("All content generated successfully!", "success");
      coverLetterGenerated = true;
    } catch (error) {
      console.error("Upwork Helper: Error generating content:", error);
      showNotification(`Error: ${error.message}`, "error");
    } finally {
      isGenerating = false;
    }
  }

  /**
   * Triggers all necessary events for Vue.js textarea
   * @param {Element} textarea - Textarea element
   */
  function triggerTextareaEvents(textarea) {
    // Standard events
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.dispatchEvent(new Event("change", { bubbles: true }));

    // Vue-specific events
    textarea.dispatchEvent(new Event("blur", { bubbles: true }));
    textarea.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
  }

  /**
   * Extracts question data from the page
   * @returns {Array<Object>} - Array of {question, textarea} objects
   */
  function extractQuestionData() {
    const questionData = [];
    const questionSection = document.querySelector(
      ".fe-proposal-job-questions"
    );

    if (!questionSection) {
      return questionData;
    }

    const formGroups = questionSection.querySelectorAll(".form-group");

    formGroups.forEach((group) => {
      const label = group.querySelector("label");
      const textarea = group.querySelector(
        "textarea.air3-textarea.inner-textarea"
      );

      if (label && textarea && !textarea.value) {
        questionData.push({
          question: label.textContent.trim(),
          textarea: textarea,
        });
      }
    });

    return questionData;
  }

  /**
   * Generates answers for additional questions
   * @param {Array<Object>} questionData - Array of question data
   * @param {Object} jobData - Job data
   */
  async function generateQuestionAnswers(questionData, jobData) {
    for (let i = 0; i < questionData.length; i++) {
      const { question, textarea } = questionData[i];

      try {
        console.log(`Upwork Helper: Generating answer for: "${question}"`);

        // Send message to background to generate answer
        const response = await chrome.runtime.sendMessage({
          action: "generateQuestionAnswer",
          question: question,
          jobData: jobData,
        });

        if (response.success && response.answer) {
          textarea.value = response.answer;
          triggerTextareaEvents(textarea);
          textarea.classList.add("upwork-helper-filled");
          console.log(`Upwork Helper: Answer generated for question ${i + 1}`);
        }
      } catch (error) {
        console.error(
          `Upwork Helper: Error generating answer for question ${i + 1}:`,
          error
        );
      }

      // Small delay between questions
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  /**
   * Checks if auto-generation is enabled
   * @returns {Promise<boolean>}
   */
  async function isAutoGenerateEnabled() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["autoGenerate"], (result) => {
        resolve(result.autoGenerate !== false); // Default to true
      });
    });
  }

  /**
   * Checks if we're on a job application/proposal page
   * @returns {boolean}
   */
  function isJobApplicationPage() {
    const url = window.location.href;
    return (
      url.includes("/jobs/") ||
      url.includes("/proposals/job/") ||
      url.includes("/nx/proposals/job/") ||
      url.includes("/apply")
    );
  }

  /**
   * Finds additional question textareas (if any)
   * @returns {Array<Element>} - Array of question textarea elements
   */
  function findQuestionTextareas() {
    const questionTextareas = [];
    const questionSection = document.querySelector(
      ".fe-proposal-job-questions"
    );

    if (questionSection) {
      const textareas = questionSection.querySelectorAll(
        "textarea.air3-textarea.inner-textarea"
      );
      questionTextareas.push(...textareas);
      console.log(
        `Upwork Helper: Found ${textareas.length} additional question textareas`
      );
    }

    return questionTextareas;
  }

  /**
   * Adds a manual trigger button
   */
  function addManualTriggerButton() {
    // Check if button already exists
    if (document.getElementById("upwork-helper-generate-btn")) {
      return;
    }

    const button = document.createElement("button");
    button.id = "upwork-helper-generate-btn";
    button.className = "upwork-helper-generate-button";
    button.textContent = "✨ Generate Cover Letter";
    button.onclick = generateAndInjectCoverLetter;

    // Try to find a good place to insert the button
    // Look for the cover letter section or form
    const possibleContainers = [
      document.querySelector("form"),
      document.querySelector('[data-test="apply-form"]'),
      document.querySelector(".cover-letter-section"),
      document.body,
    ];

    for (const container of possibleContainers) {
      if (container) {
        if (container === document.body) {
          // Add as floating button if no better container found
          button.style.position = "fixed";
          button.style.bottom = "20px";
          button.style.right = "20px";
          button.style.zIndex = "10000";
        }
        container.insertBefore(button, container.firstChild);
        break;
      }
    }

    console.log("Upwork Helper: Manual trigger button added");
  }

  /**
   * Checks for Cloudflare or robot verification
   * @returns {Promise<boolean>} - True if passed/no check, false if still checking
   */
  async function waitForRobotCheckToPass() {
    console.log("Upwork Helper: Checking for robot verification...");

    const robotCheckSelectors = [
      '[class*="captcha"]',
      '[id*="captcha"]',
      'iframe[src*="recaptcha"]',
      'iframe[src*="cloudflare"]',
      '[class*="challenge"]',
      "#challenge-form",
      ".cf-challenge",
    ];

    // Check if robot check is present
    let hasRobotCheck = false;
    for (const selector of robotCheckSelectors) {
      const element = document.querySelector(selector);
      if (element && element.offsetParent !== null) {
        hasRobotCheck = true;
        break;
      }
    }

    // Check for Cloudflare text indicators
    const bodyText = document.body.textContent;
    if (
      bodyText.includes("Checking your browser") ||
      bodyText.includes("Just a moment") ||
      bodyText.includes("Please verify you are human")
    ) {
      hasRobotCheck = true;
    }

    if (hasRobotCheck) {
      console.log(
        "Upwork Helper: Robot check detected - waiting for user to complete"
      );
      showNotification(
        "Please complete the verification check. Extension will auto-generate after you pass.",
        "info"
      );

      // Wait for the check to complete (monitor for page changes)
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          // Check if robot check is still present
          let stillChecking = false;

          for (const selector of robotCheckSelectors) {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null) {
              stillChecking = true;
              break;
            }
          }

          const currentBodyText = document.body.textContent;
          if (
            currentBodyText.includes("Checking your browser") ||
            currentBodyText.includes("Just a moment")
          ) {
            stillChecking = true;
          }

          // If check passed, resolve
          if (!stillChecking) {
            console.log("Upwork Helper: Robot check passed!");
            clearInterval(checkInterval);
            showNotification(
              "Verification passed! Generating content...",
              "success"
            );
            // Wait a bit for page to stabilize after check
            setTimeout(() => resolve(true), 2000);
          }
        }, 1000); // Check every second

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkInterval);
          console.warn("Upwork Helper: Robot check timeout");
          resolve(false);
        }, 300000);
      });
    }

    console.log("Upwork Helper: No robot check detected");
    return true;
  }

  /**
   * Initializes the script
   */
  async function init() {
    console.log("Upwork Helper: Initializing job detail script");

    // Check if we're on the right page
    if (!isJobApplicationPage()) {
      console.log("Upwork Helper: Not on a job application page");
      return;
    }

    // Wait a bit for the page to fully load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check for and wait for robot check to pass
    const checkPassed = await waitForRobotCheckToPass();
    if (!checkPassed) {
      console.warn(
        "Upwork Helper: Robot check not passed, showing manual button"
      );
      addManualTriggerButton();
      return;
    }

    // Check if auto-generate is enabled
    const autoGenerate = await isAutoGenerateEnabled();

    if (autoGenerate) {
      console.log("Upwork Helper: Auto-generate enabled, starting generation");
      await generateAndInjectCoverLetter();
    } else {
      console.log(
        "Upwork Helper: Auto-generate disabled, adding manual trigger button"
      );
      addManualTriggerButton();
    }

    // Also add manual trigger button even if auto-generate is on (for regeneration)
    // addManualTriggerButton();
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Listen for messages from popup (e.g., manual trigger)
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "triggerGeneration") {
      generateAndInjectCoverLetter()
        .then(() => sendResponse({ success: true }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;
    }
  });
})();
