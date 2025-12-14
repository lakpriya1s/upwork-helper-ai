/**
 * Options Page Script
 * Handles settings page functionality
 */

// Default template
const DEFAULT_TEMPLATE = `Dear {{clientName}},

I am writing to express my strong interest in the {{jobTitle}} position. With my expertise in {{skills}}, I am confident I can deliver exceptional results for your project.

After reviewing your job description, I understand that you need someone who can handle the requirements effectively. I have extensive experience in this area and have successfully completed similar projects in the past.

I am available to work within your {{budget}} budget and can commit to the {{duration}} timeline. I pride myself on delivering high-quality work, excellent communication, and timely completion of projects.

I would love to discuss how I can help bring your project to success. Please feel free to review my profile and portfolio, and I look forward to hearing from you.

Best regards`;

// Available template variables
const TEMPLATE_VARIABLES = [
  { name: "jobTitle", description: "Job title" },
  { name: "description", description: "Job description" },
  { name: "budget", description: "Budget/rate" },
  { name: "skills", description: "Required skills" },
  { name: "clientName", description: "Client name" },
  { name: "clientLocation", description: "Client location" },
  { name: "clientRating", description: "Client rating" },
  { name: "experienceLevel", description: "Experience level" },
  { name: "duration", description: "Project duration" },
  { name: "jobType", description: "Job type" },
  { name: "proposalsCount", description: "Proposals count" },
  { name: "postingDate", description: "Posting date" },
];

/**
 * Shows a notification
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', or 'info'
 */
function showNotification(message, type = "info") {
  // Remove existing notification
  const existing = document.querySelector(".notification");
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

/**
 * Updates API key status indicator
 * @param {boolean} configured - Whether API key is configured
 */
function updateApiKeyStatus(configured) {
  const statusContainer = document.getElementById("apiKeyStatus");

  if (configured) {
    statusContainer.innerHTML =
      '<div class="status-indicator configured">✓ API Key Configured</div>';
  } else {
    statusContainer.innerHTML =
      '<div class="status-indicator not-configured">✗ API Key Not Configured</div>';
  }
}

/**
 * Loads settings from storage
 */
async function loadSettings() {
  chrome.storage.sync.get(
    [
      "apiKey",
      "template",
      "autoGenerate",
      "openaiModel",
      "profileName",
      "profileTitle",
      "profileYears",
      "profileBio",
      "profileWorkExperience",
      "profileEducation",
      "profileLanguages",
      "profileFrameworks",
      "profileSkills",
      "profilePortfolio",
      "profileHourlyRate",
      "highlight1h",
      "highlight2h",
      "highlight4h",
    ],
    (result) => {
      // Load API key
      if (result.apiKey) {
        document.getElementById("apiKey").value = result.apiKey;
        updateApiKeyStatus(true);
      } else {
        updateApiKeyStatus(false);
      }

      // Load template
      document.getElementById("template").value =
        result.template || DEFAULT_TEMPLATE;

      // Load auto-generate setting
      document.getElementById("autoGenerate").checked =
        result.autoGenerate !== false;

      // Load model selection
      document.getElementById("openaiModel").value =
        result.openaiModel || "gpt-4o-mini";

      // Load developer profile
      document.getElementById("profileName").value = result.profileName || "";
      document.getElementById("profileTitle").value = result.profileTitle || "";
      document.getElementById("profileYears").value = result.profileYears || "";
      document.getElementById("profileBio").value = result.profileBio || "";
      document.getElementById("profileWorkExperience").value = result.profileWorkExperience || "";
      document.getElementById("profileEducation").value = result.profileEducation || "";
      document.getElementById("profileLanguages").value = result.profileLanguages || "";
      document.getElementById("profileFrameworks").value = result.profileFrameworks || "";
      document.getElementById("profileSkills").value = result.profileSkills || "";
      document.getElementById("profilePortfolio").value = result.profilePortfolio || "";
      document.getElementById("profileHourlyRate").value = result.profileHourlyRate || "";

      // Load highlighting settings (default all to true)
      document.getElementById("highlight1h").checked =
        result.highlight1h !== false;
      document.getElementById("highlight2h").checked =
        result.highlight2h !== false;
      document.getElementById("highlight4h").checked =
        result.highlight4h !== false;

      console.log("Settings loaded");
    }
  );
}

/**
 * Saves settings to storage
 */
function saveSettings() {
  const apiKey = document.getElementById("apiKey").value.trim();
  const template = document.getElementById("template").value;
  const autoGenerate = document.getElementById("autoGenerate").checked;
  const openaiModel = document.getElementById("openaiModel").value;

  // Get developer profile
  const profileName = document.getElementById("profileName").value.trim();
  const profileTitle = document.getElementById("profileTitle").value.trim();
  const profileYears = document.getElementById("profileYears").value.trim();
  const profileBio = document.getElementById("profileBio").value.trim();
  const profileWorkExperience = document.getElementById("profileWorkExperience").value.trim();
  const profileEducation = document.getElementById("profileEducation").value.trim();
  const profileLanguages = document.getElementById("profileLanguages").value.trim();
  const profileFrameworks = document.getElementById("profileFrameworks").value.trim();
  const profileSkills = document.getElementById("profileSkills").value.trim();
  const profilePortfolio = document.getElementById("profilePortfolio").value.trim();
  const profileHourlyRate = document.getElementById("profileHourlyRate").value.trim();

  const highlight1h = document.getElementById("highlight1h").checked;
  const highlight2h = document.getElementById("highlight2h").checked;
  const highlight4h = document.getElementById("highlight4h").checked;

  // Validate
  if (!apiKey) {
    showNotification("Please enter an OpenAI API key", "error");
    return;
  }

  if (!template) {
    showNotification("Please enter a cover letter template", "error");
    return;
  }

  // Save to storage
  chrome.storage.sync.set(
    {
      apiKey,
      template,
      autoGenerate,
      openaiModel,
      profileName,
      profileTitle,
      profileYears,
      profileBio,
      profileWorkExperience,
      profileEducation,
      profileLanguages,
      profileFrameworks,
      profileSkills,
      profilePortfolio,
      profileHourlyRate,
      highlight1h,
      highlight2h,
      highlight4h,
    },
    () => {
      showNotification("Settings saved successfully!", "success");
      updateApiKeyStatus(true);
      console.log("Settings saved");
    }
  );
}

/**
 * Resets settings to default
 */
function resetToDefault() {
  if (
    confirm(
      "Are you sure you want to reset all settings to default? Your API key will not be deleted."
    )
  ) {
    document.getElementById("template").value = DEFAULT_TEMPLATE;
    document.getElementById("autoGenerate").checked = true;
    document.getElementById("openaiModel").value = "gpt-4o-mini";
    
    // Clear developer profile
    document.getElementById("profileName").value = "";
    document.getElementById("profileTitle").value = "";
    document.getElementById("profileYears").value = "";
    document.getElementById("profileBio").value = "";
    document.getElementById("profileWorkExperience").value = "";
    document.getElementById("profileEducation").value = "";
    document.getElementById("profileLanguages").value = "";
    document.getElementById("profileFrameworks").value = "";
    document.getElementById("profileSkills").value = "";
    document.getElementById("profilePortfolio").value = "";
    document.getElementById("profileHourlyRate").value = "";

    document.getElementById("highlight1h").checked = true;
    document.getElementById("highlight2h").checked = true;
    document.getElementById("highlight4h").checked = true;
    showNotification("Settings reset to default", "info");
  }
}

/**
 * Tests the API key
 */
async function testApiKey() {
  const apiKey = document.getElementById("apiKey").value.trim();

  if (!apiKey) {
    showNotification("Please enter an API key first", "error");
    return;
  }

  showNotification("Testing API key...", "info");

  try {
    const response = await chrome.runtime.sendMessage({
      action: "testApiKey",
      apiKey: apiKey,
    });

    if (response.success && response.result.valid) {
      showNotification("API key is valid! ✓", "success");
    } else {
      showNotification(
        `API key is invalid: ${response.result.message}`,
        "error"
      );
    }
  } catch (error) {
    showNotification(`Error testing API key: ${error.message}`, "error");
  }
}

/**
 * Populates the variables grid
 */
function populateVariablesGrid() {
  const grid = document.getElementById("variablesGrid");
  grid.innerHTML = "";

  TEMPLATE_VARIABLES.forEach((variable) => {
    const item = document.createElement("div");
    item.className = "variable-item";
    item.innerHTML = `
      <div class="variable-name">{{${variable.name}}}</div>
      <div class="variable-desc">${variable.description}</div>
    `;

    // Click to copy
    item.addEventListener("click", () => {
      const text = `{{${variable.name}}}`;
      navigator.clipboard.writeText(text).then(() => {
        showNotification(`Copied: ${text}`, "success");
      });
    });

    grid.appendChild(item);
  });
}

/**
 * Initializes the options page
 */
function init() {
  // Populate variables grid
  populateVariablesGrid();

  // Load settings
  loadSettings();

  // Event listeners
  document
    .getElementById("saveSettings")
    .addEventListener("click", saveSettings);
  document
    .getElementById("resetToDefault")
    .addEventListener("click", resetToDefault);
  document.getElementById("testApiKey").addEventListener("click", testApiKey);

  // Save on Ctrl+S / Cmd+S
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveSettings();
    }
  });

  console.log("Options page initialized");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
