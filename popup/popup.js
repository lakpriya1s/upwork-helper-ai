/**
 * Popup Script
 * Handles popup UI functionality
 */

let currentSettings = {};

/**
 * Shows a notification in the popup
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showNotification(message, type = "info") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification show ${type}`;

  setTimeout(() => {
    notification.className = "notification";
  }, 3000);
}

/**
 * Updates the API key status display
 * @param {boolean} configured - Whether API key is configured
 */
function updateApiKeyStatus(configured) {
  const statusElement = document.getElementById("apiKeyStatus");

  if (configured) {
    statusElement.innerHTML = '<span class="status-icon">✓</span> Configured';
  } else {
    statusElement.innerHTML = '<span class="status-icon">✗</span> Not Set';
  }
}

/**
 * Updates the auto-generate toggle
 * @param {boolean} enabled - Whether auto-generate is enabled
 */
function updateAutoGenerateToggle(enabled) {
  const toggle = document.getElementById("autoGenerateToggle");
  if (enabled) {
    toggle.classList.add("active");
  } else {
    toggle.classList.remove("active");
  }
}

/**
 * Loads current settings
 */
async function loadSettings() {
  chrome.storage.sync.get(["apiKey", "autoGenerate"], (result) => {
    currentSettings = result;

    // Update UI
    updateApiKeyStatus(!!result.apiKey);
    updateAutoGenerateToggle(result.autoGenerate !== false);

    // Enable/disable generate button based on API key and current tab
    checkCurrentTab();
  });
}

/**
 * Checks if current tab is an Upwork job page
 */
async function checkCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const generateButton = document.getElementById("generateNow");

    if (
      tab &&
      tab.url &&
      (tab.url.includes("upwork.com/jobs/") ||
        tab.url.includes("upwork.com/ab/proposals/job/"))
    ) {
      generateButton.disabled = !currentSettings.apiKey;
      if (!currentSettings.apiKey) {
        generateButton.title = "Please configure API key first";
      }
    } else {
      generateButton.disabled = true;
      generateButton.title = "Navigate to an Upwork job page first";
    }
  } catch (error) {
    console.error("Error checking current tab:", error);
  }
}

/**
 * Opens the settings page
 */
function openSettings() {
  chrome.runtime.openOptionsPage();
}

/**
 * Triggers cover letter generation on current tab
 */
async function generateCoverLetter() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) {
      showNotification("No active tab found", "error");
      return;
    }

    showNotification("Generating cover letter...", "info");

    // Send message to content script
    chrome.tabs.sendMessage(
      tab.id,
      { action: "triggerGeneration" },
      (response) => {
        if (chrome.runtime.lastError) {
          showNotification("Please refresh the page first", "error");
          return;
        }

        if (response && response.success) {
          showNotification("Cover letter generated!", "success");
        } else {
          showNotification(response?.error || "Generation failed", "error");
        }
      }
    );
  } catch (error) {
    showNotification(`Error: ${error.message}`, "error");
  }
}

/**
 * Toggles auto-generate setting
 */
function toggleAutoGenerate() {
  const newValue = !currentSettings.autoGenerate;

  chrome.storage.sync.set({ autoGenerate: newValue }, () => {
    currentSettings.autoGenerate = newValue;
    updateAutoGenerateToggle(newValue);
    showNotification(
      newValue ? "Auto-generate enabled" : "Auto-generate disabled",
      "success"
    );
  });
}

/**
 * Initializes the popup
 */
function init() {
  // Load settings
  loadSettings();

  // Event listeners
  document
    .getElementById("openSettings")
    .addEventListener("click", openSettings);

  document
    .getElementById("generateNow")
    .addEventListener("click", generateCoverLetter);
  document
    .getElementById("autoGenerateToggle")
    .addEventListener("click", toggleAutoGenerate);

  console.log("Popup initialized");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
