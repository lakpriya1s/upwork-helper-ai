/**
 * Background Service Worker
 * Handles OpenAI API calls and message passing
 */

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateCoverLetter") {
    handleGenerateCoverLetter(request.jobData)
      .then((coverLetter) => {
        sendResponse({ success: true, coverLetter });
      })
      .catch((error) => {
        console.error("Error generating cover letter:", error);
        sendResponse({ success: false, error: error.message });
      });

    // Return true to indicate async response
    return true;
  }

  if (request.action === "generateQuestionAnswer") {
    handleGenerateQuestionAnswer(request.question, request.jobData)
      .then((answer) => {
        sendResponse({ success: true, answer });
      })
      .catch((error) => {
        console.error("Error generating question answer:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }

  if (request.action === "testApiKey") {
    testOpenAIApiKey(request.apiKey)
      .then((result) => {
        sendResponse({ success: true, result });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }
});

/**
 * Handles cover letter generation request
 * @param {Object} jobData - Extracted job data
 * @returns {Promise<string>} - Generated cover letter
 */
async function handleGenerateCoverLetter(jobData) {
  // Get settings from storage
  const settings = await getSettings();

  if (!settings.apiKey) {
    throw new Error(
      "OpenAI API key not configured. Please set it in extension settings."
    );
  }

  if (!settings.template) {
    throw new Error(
      "Cover letter template not configured. Please set it in extension settings."
    );
  }

  // Process template with job data
  const processedTemplate = processTemplate(settings.template, jobData);

  // Generate cover letter using OpenAI
  const coverLetter = await generateWithOpenAI(
    settings.apiKey,
    processedTemplate,
    jobData,
    "cover_letter"
  );

  return coverLetter;
}

/**
 * Handles question answer generation
 * @param {string} question - The question to answer
 * @param {Object} jobData - Extracted job data
 * @returns {Promise<string>} - Generated answer
 */
async function handleGenerateQuestionAnswer(question, jobData) {
  // Get settings from storage
  const settings = await getSettings();

  if (!settings.apiKey) {
    throw new Error("OpenAI API key not configured.");
  }

  // Generate answer using OpenAI
  const answer = await generateQuestionAnswerWithOpenAI(
    settings.apiKey,
    question,
    jobData,
    settings.openaiModel
  );

  return answer;
}

/**
 * Gets settings from Chrome storage
 * @returns {Promise<Object>} - Settings object
 */
async function getSettings() {
  return new Promise((resolve) => {
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
      ],
      (result) => {
        resolve({
          apiKey: result.apiKey || "",
          template: result.template || getDefaultTemplate(),
          autoGenerate: result.autoGenerate !== false, // Default to true
          openaiModel: result.openaiModel || "gpt-4o-mini",
          developerProfile: {
            name: result.profileName || "",
            title: result.profileTitle || "",
            years: result.profileYears || "",
            bio: result.profileBio || "",
            workExperience: result.profileWorkExperience || "",
            education: result.profileEducation || "",
            languages: result.profileLanguages || "",
            frameworks: result.profileFrameworks || "",
            skills: result.profileSkills || "",
            portfolio: result.profilePortfolio || "",
            hourlyRate: result.profileHourlyRate || "",
          },
        });
      }
    );
  });
}

/**
 * Processes template with job data
 * @param {string} template - Template string
 * @param {Object} data - Job data
 * @returns {string} - Processed template
 */
function processTemplate(template, data) {
  let processed = template;

  // Replace all {{variable}} patterns
  const variablePattern = /\{\{(\w+)\}\}/g;

  processed = processed.replace(variablePattern, (match, variableName) => {
    if (data.hasOwnProperty(variableName) && data[variableName] != null) {
      return data[variableName];
    }
    return "";
  });

  return processed;
}

/**
 * Generates cover letter using OpenAI API
 * @param {string} apiKey - OpenAI API key
 * @param {string} processedTemplate - Processed template
 * @param {Object} jobData - Job data
 * @param {string} type - Type of generation
 * @returns {Promise<string>} - Generated cover letter
 */
async function generateWithOpenAI(
  apiKey,
  processedTemplate,
  jobData,
  type = "cover_letter"
) {
  const settings = await getSettings();

  const systemPrompt = `You are a professional cover letter writer helping create personalized cover letters for Upwork job applications. 
Generate a compelling, professional cover letter based on the template, job information, and freelancer profile provided. 
Keep it concise, relevant, and tailored to the specific job.
The cover letter should be professional, demonstrate understanding of the job requirements, highlight relevant experience from the freelancer's profile, and show how their skills match the job needs.`;

  // Build freelancer profile section (only include non-empty fields)
  let profileSection = "";
  const profile = settings.developerProfile;
  
  if (profile.name || profile.title || profile.years || profile.bio || profile.workExperience || profile.education || profile.languages || profile.frameworks || profile.skills || profile.portfolio || profile.hourlyRate) {
    profileSection = "\n\nFreelancer Profile:\n";
    if (profile.name) profileSection += `Name: ${profile.name}\n`;
    if (profile.title) profileSection += `Professional Title: ${profile.title}\n`;
    if (profile.years) profileSection += `Years of Experience: ${profile.years}\n`;
    if (profile.bio) profileSection += `Bio: ${profile.bio}\n`;
    if (profile.workExperience) profileSection += `Work Experience & Key Projects:\n${profile.workExperience}\n`;
    if (profile.education) profileSection += `Education & Certifications:\n${profile.education}\n`;
    if (profile.languages) profileSection += `Programming Languages: ${profile.languages}\n`;
    if (profile.frameworks) profileSection += `Frameworks & Technologies: ${profile.frameworks}\n`;
    if (profile.skills) profileSection += `Core Skills: ${profile.skills}\n`;
    if (profile.portfolio) profileSection += `Portfolio: ${profile.portfolio}\n`;
    if (profile.hourlyRate) profileSection += `Hourly Rate: ${profile.hourlyRate}\n`;
  }

  const userPrompt = `${profileSection}
Job Title: ${jobData.jobTitle}

Job Description:
${jobData.description}

${jobData.skills ? `Required Skills: ${jobData.skills}` : ""}
${jobData.budget ? `Budget: ${jobData.budget}` : ""}
${jobData.clientName ? `Client: ${jobData.clientName}` : ""}

Template to follow:
${processedTemplate}

Please generate a professional cover letter for this job application. Fill in the template with appropriate content based on the job details${profileSection ? " and the freelancer's profile" : ""}. Make sure to highlight relevant experience and skills from the profile that match the job requirements.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: settings.openaiModel || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `OpenAI API error: ${response.status}`
    );
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Invalid response from OpenAI API");
  }

  return data.choices[0].message.content.trim();
}

/**
 * Generates answer for additional question using OpenAI
 * @param {string} apiKey - OpenAI API key
 * @param {string} question - The question to answer
 * @param {Object} jobData - Job data
 * @param {string} model - OpenAI model to use
 * @returns {Promise<string>} - Generated answer
 */
async function generateQuestionAnswerWithOpenAI(
  apiKey,
  question,
  jobData,
  model = "gpt-4o-mini"
) {
  const systemPrompt = `You are a professional freelance consultant helping answer Upwork proposal questions. 
Generate clear, relevant, and professional answers based on the job requirements and the question asked.
Keep answers concise (2-4 sentences), specific, and demonstrate expertise without being overly lengthy.`;

  const userPrompt = `Job Title: ${jobData.jobTitle}

Job Description:
${jobData.description}

${jobData.skills ? `Required Skills: ${jobData.skills}` : ""}

Question to answer:
"${question}"

Please provide a professional, relevant answer to this question that demonstrates expertise and understanding of the job requirements. Keep it concise and specific.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `OpenAI API error: ${response.status}`
    );
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Invalid response from OpenAI API");
  }

  return data.choices[0].message.content.trim();
}

/**
 * Tests OpenAI API key validity
 * @param {string} apiKey - API key to test
 * @returns {Promise<Object>} - Test result
 */
async function testOpenAIApiKey(apiKey) {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      return { valid: true, message: "API key is valid" };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        valid: false,
        message: errorData.error?.message || "Invalid API key",
      };
    }
  } catch (error) {
    return { valid: false, message: error.message };
  }
}

/**
 * Returns default cover letter template
 * @returns {string} - Default template
 */
function getDefaultTemplate() {
  return `Dear {{clientName}},

I am writing to express my strong interest in the {{jobTitle}} position. With my expertise in {{skills}}, I am confident I can deliver exceptional results for your project.

After reviewing your job description, I understand that you need someone who can handle {{description}}. I have extensive experience in this area and have successfully completed similar projects in the past.

I am available to work within your {{budget}} budget and can commit to the {{duration}} timeline. I pride myself on delivering high-quality work, excellent communication, and timely completion of projects.

I would love to discuss how I can help bring your project to success. Please feel free to review my profile and portfolio, and I look forward to hearing from you.

Best regards`;
}

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("Upwork Helper extension installed");

    // Set default settings
    chrome.storage.sync.set({
      template: getDefaultTemplate(),
      autoGenerate: true,
      openaiModel: "gpt-4o-mini",
    });
  }
});
