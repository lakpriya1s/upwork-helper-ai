/**
 * Job Extractor Utility
 * Extracts job information from Upwork job detail pages
 */

/**
 * Extracts job data from the current Upwork job detail page
 * @returns {Object} - Job data object
 */
function extractJobData() {
  const jobData = {};

  try {
    // Extract job title
    // From sample: <h4 class="d-flex align-items-center mt-0 mb-5"><span class="text-base flex-1">Job Title</span></h4>
    // Or: <h3 class="mb-6x h5">Job Title</h3>
    const titleSelectors = [
      "span.text-base.flex-1", // Job page - most specific
      "h4 .text-base.flex-1", // Job detail card
      ".text-base.flex-1", // Broader match
      "h3.mb-6x.h5", // Apply page
      "h4.text-base",
      "h2.h4",
      '[data-test="job-title"]',
      'h1[class*="job-title"]',
      'h2[class*="job-title"]',
      "h4 span.text-base", // Even broader
    ];

    for (const selector of titleSelectors) {
      const titleElement = document.querySelector(selector);
      if (titleElement && titleElement.textContent.trim()) {
        jobData.jobTitle = titleElement.textContent.trim();
        console.log(
          `Upwork Helper: Found job title using selector: ${selector}`
        );
        break;
      }
    }

    // Extract job description
    // From sample: <div data-test="Description"><strong class="text-base-sm">Summary</strong><p class="text-body-sm multiline-text">...</p></div>
    const descriptionSelectors = [
      '[data-test="Description"] p.text-body-sm.multiline-text', // Job page - most specific
      '[data-test="Description"] p.text-body-sm',
      '[data-test="Description"] p',
      '[data-test="Description"] .text-body-sm',
      '[data-test="Description"]', // Get the whole description section
      ".break p.text-body-sm",
      ".description .text-body-sm",
      '[data-test="job-description"]',
      ".job-description",
      ".description",
    ];

    for (const selector of descriptionSelectors) {
      const descElement = document.querySelector(selector);
      if (descElement && descElement.textContent.trim()) {
        const text = descElement.textContent.trim();
        // Remove "Summary" label if present
        jobData.description = text.replace(/^Summary\s*/i, "").trim();
        console.log(
          `Upwork Helper: Found job description using selector: ${selector}`
        );
        break;
      }
    }

    // Extract budget/rate
    // From sample: <strong>$300.00</strong> (fixed) or <strong>$20.00 - $40.00</strong> (hourly)
    const budgetSelectors = [
      '[data-cy="fixed-price"] strong',
      '[data-cy="clock-timelog"] strong',
      '[data-test="budget"]',
      ".header strong", // In job features section
      '[class*="budget"]',
    ];

    for (const selector of budgetSelectors) {
      const budgetElement = document.querySelector(selector);
      if (
        budgetElement &&
        (budgetElement.textContent.includes("$") ||
          budgetElement.textContent.includes("hr"))
      ) {
        jobData.budget = budgetElement.textContent.trim();
        break;
      }
    }

    // Extract job type (hourly vs fixed)
    // From sample: <strong data-test="job-type">Fixed-price</strong> or "Hourly: $25-$47"
    const jobTypeElement = document.querySelector(
      '[data-test="job-type"], strong[data-test="job-type"]'
    );
    if (jobTypeElement) {
      jobData.jobType = jobTypeElement.textContent.trim();
    } else {
      // Infer from budget format
      if (jobData.budget && jobData.budget.includes("/hr")) {
        jobData.jobType = "Hourly";
      } else if (
        jobData.budget &&
        jobData.budget.includes("$") &&
        !jobData.budget.includes("/")
      ) {
        jobData.jobType = "Fixed-price";
      }
    }

    // Extract experience level
    // From sample: <span data-test="contractor-tier">Intermediate</span> or <strong>Expert</strong>
    const experienceSelectors = [
      '[data-test="contractor-tier"]',
      '[data-cy="expertise"] ~ strong',
      '[class*="experience-level"]',
    ];

    for (const selector of experienceSelectors) {
      const expElement = document.querySelector(selector);
      if (expElement) {
        const text = expElement.textContent.trim();
        if (
          text === "Expert" ||
          text === "Intermediate" ||
          text === "Entry Level"
        ) {
          jobData.experienceLevel = text;
          break;
        }
      }
    }

    // Extract project duration
    // From sample: <span data-test="duration">30+ hrs/week</span> or "1 to 3 months"
    const durationSelectors = [
      '[data-test="duration"]',
      '[data-test="hourly-duration"]',
      '[data-cy="duration2"] ~ strong',
      '[class*="duration"]',
    ];

    for (const selector of durationSelectors) {
      const durationElement = document.querySelector(selector);
      if (
        durationElement &&
        (durationElement.textContent.includes("month") ||
          durationElement.textContent.includes("week") ||
          durationElement.textContent.includes("hr"))
      ) {
        jobData.duration = durationElement.textContent.trim();
        break;
      }
    }

    // Extract skills
    // From sample: <span class="air3-token text-light" data-test="attr-item">React Native</span>
    // Or: <a class="up-n-link air3-badge air3-badge-highlight badge">Android</a>
    const skillSelectors = [
      '[data-test="attr-item"]',
      ".air3-badge-highlight",
      ".air3-token",
      ".skills-list .air3-badge",
      '[data-test="token"]',
      ".up-skill-badge",
    ];

    const skills = new Set();
    skillSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        const skill = el.textContent.trim();
        if (skill && skill.length > 0 && skill.length < 50) {
          skills.add(skill);
        }
      });
    });
    jobData.skills = Array.from(skills).join(", ");

    // Extract posting date
    // From sample: <span data-test="posted-on">5 minutes ago</span> or <div>Posted <span>18 minutes ago</span></div>
    const postingDateSelectors = [
      '[data-test="posted-on"]',
      '[itemprop="datePosted"]',
      ".posted-on-line span", // Job page format
      ".text-light-on-muted.text-body-sm span", // Broader match
      ".posted-on",
    ];

    for (const selector of postingDateSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.includes("ago")) {
        jobData.postingDate = element.textContent.trim();
        console.log(
          `Upwork Helper: Found posting date: ${jobData.postingDate}`
        );
        break;
      }
    }

    // Fallback: search for any element containing "Posted" and time
    if (!jobData.postingDate) {
      const allElements = document.querySelectorAll("div, span, small, p");
      for (const el of allElements) {
        const text = el.textContent.trim();
        if (text.startsWith("Posted") && text.includes("ago")) {
          jobData.postingDate = text.replace("Posted", "").trim();
          console.log(
            `Upwork Helper: Found posting date (fallback): ${jobData.postingDate}`
          );
          break;
        }
      }
    }

    // Extract proposals count
    // From sample: <strong data-test="proposals" class="text-base-sm">Less than 5</strong>
    const proposalsSelectors = [
      '[data-test="proposals"]',
      'strong[data-test="proposals"]',
      ".ca-item .value", // Activity section
      '[class*="proposals"]',
    ];

    for (const selector of proposalsSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.textContent.trim();
        if (
          text.includes("Less than") ||
          text.includes("to") ||
          /\d+/.test(text)
        ) {
          jobData.proposalsCount = text;
          break;
        }
      }
    }

    // Extract client information
    // From sample: About the client section with various data points

    // Client location - From sample: <strong>Italy</strong> or <strong>Ukraine</strong>
    const clientLocationSelectors = [
      '[data-qa="client-location"] strong',
      '[data-test="client-location"]',
      ".features li:first-child strong",
      '[class*="client-location"]',
    ];

    for (const selector of clientLocationSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.textContent.trim();
        if (
          text &&
          !text.includes("$") &&
          !text.includes("jobs") &&
          text.length < 30
        ) {
          jobData.clientLocation = text;
          break;
        }
      }
    }

    // Client rating - From sample: <div class="air3-rating-value-text">4.3</div>
    const ratingElement = document.querySelector(
      '.air3-rating-value-text, [data-test="client-rating"]'
    );
    if (ratingElement) {
      jobData.clientRating = ratingElement.textContent.trim();
    }

    // Client jobs posted - From sample: "28 jobs posted" or "1 job posted"
    const jobsPostedSelectors = [
      '[data-qa="client-job-posting-stats"] strong',
      '[data-test="client-jobs-posted"]',
    ];

    for (const selector of jobsPostedSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.textContent.trim();
        const match = text.match(/(\d+)\s+jobs?/i);
        if (match) {
          jobData.clientJobsPosted = match[1];
          break;
        }
      }
    }

    // Fallback: search for "jobs posted" text in all list items
    if (!jobData.clientJobsPosted) {
      const allListItems = document.querySelectorAll('li');
      for (const li of allListItems) {
        const text = li.textContent.trim();
        if (text.includes('jobs posted') || text.includes('job posted')) {
          const match = text.match(/(\d+)\s+jobs?/i);
          if (match) {
            jobData.clientJobsPosted = match[1];
            break;
          }
        }
      }
    }

    // Client hire rate - From sample: "68% hire rate, 1 open job"
    const hireRateText = document.querySelector(
      '[data-qa="client-job-posting-stats"]'
    );
    if (hireRateText) {
      const match = hireRateText.textContent.match(/(\d+%)\s+hire\s+rate/i);
      if (match) {
        jobData.clientHireRate = match[1];
      }
    }

    // Client total spent - From sample: "$11K total spent" or "$0 spent"
    const spentSelectors = [
      '[data-qa="client-spend"] strong',
      '[data-test="client-spendings"] strong',
      '[class*="total-spent"]',
    ];

    for (const selector of spentSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const text = element.textContent.trim();
        if (text.includes("$")) {
          jobData.clientTotalSpent = text;
          break;
        }
      }
    }

    // Fallback: search for "spent" text in all list items
    if (!jobData.clientTotalSpent) {
      const allListItems = document.querySelectorAll('li');
      for (const li of allListItems) {
        const text = li.textContent.trim();
        if (text.includes('spent') && text.includes('$')) {
          const match = text.match(/\$[0-9KM.]+/);
          if (match) {
            jobData.clientTotalSpent = match[0];
            break;
          }
        }
      }
    }

    // Payment verification status - From sample: "Payment method verified" or "Payment method not verified"
    const paymentStatus = document.querySelector(
      '[data-test="payment-verification-status"], .text-caption'
    );
    if (paymentStatus) {
      const text = paymentStatus.textContent.trim();
      if (text.includes("Payment") || text.includes("verified")) {
        jobData.paymentVerified = text.includes("not") ? "No" : "Yes";
      }
    }

    // Client name (if available)
    const clientNameElement = document.querySelector(
      '[data-test="client-name"], [class*="client-name"], .client h3'
    );
    if (clientNameElement) {
      jobData.clientName = clientNameElement.textContent.trim();
    }

    // Log what we found
    console.log("Upwork Helper: Job data extraction summary:", {
      foundTitle: !!jobData.jobTitle,
      foundDescription: !!jobData.description,
      foundBudget: !!jobData.budget,
      foundSkills: !!jobData.skills,
      foundExperience: !!jobData.experienceLevel,
      foundDuration: !!jobData.duration,
      foundClientLocation: !!jobData.clientLocation,
      fieldCount: Object.keys(jobData).filter((key) => jobData[key]).length,
    });
  } catch (error) {
    console.error("Upwork Helper: Error extracting job data:", error);
    console.error("Error details:", error.stack);
  }

  return jobData;
}

/**
 * Validates that essential job data fields are present
 * @param {Object} jobData - Job data object
 * @returns {boolean} - True if essential fields are present
 */
function validateJobData(jobData) {
  // At minimum, we need job title OR description (preferably both)
  const hasTitle = !!(jobData.jobTitle && jobData.jobTitle.length > 0);
  const hasDescription = !!(
    jobData.description && jobData.description.length > 0
  );

  const isValid = hasTitle || hasDescription;

  if (!isValid) {
    console.warn("Upwork Helper: Job data validation failed", {
      hasTitle,
      hasDescription,
      jobData,
    });
  } else if (!hasTitle || !hasDescription) {
    console.warn(
      `Upwork Helper: Job data incomplete - missing ${
        !hasTitle ? "title" : "description"
      }, but proceeding anyway`
    );
  }

  return isValid;
}

/**
 * Logs the extracted job data for debugging
 * @param {Object} jobData - Job data object
 */
function debugJobData(jobData) {
  console.log("Upwork Helper - Extracted Job Data:", jobData);
  console.log("Valid:", validateJobData(jobData));
}

// Export for use in content scripts
if (typeof window !== "undefined") {
  window.JobExtractorUtils = {
    extractJobData,
    validateJobData,
    debugJobData,
  };
}
