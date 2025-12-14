/**
 * Template Engine Utility
 * Processes templates with variable replacement
 */

/**
 * Replaces template variables with actual values
 * @param {string} template - Template string with {{variable}} syntax
 * @param {Object} data - Data object with values to replace
 * @returns {string} - Processed template
 */
function processTemplate(template, data) {
  if (!template || typeof template !== 'string') {
    return '';
  }

  let processed = template;

  // Replace all {{variable}} patterns
  const variablePattern = /\{\{(\w+)\}\}/g;
  
  processed = processed.replace(variablePattern, (match, variableName) => {
    // Check if the variable exists in data
    if (data.hasOwnProperty(variableName) && data[variableName] != null) {
      return data[variableName];
    }
    
    // Return empty string if variable not found (graceful handling)
    return '';
  });

  return processed;
}

/**
 * Extracts all variable names from a template
 * @param {string} template - Template string
 * @returns {Array<string>} - Array of variable names
 */
function extractVariables(template) {
  if (!template || typeof template !== 'string') {
    return [];
  }

  const variablePattern = /\{\{(\w+)\}\}/g;
  const variables = [];
  let match;

  while ((match = variablePattern.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }

  return variables;
}

/**
 * Validates that all required variables are present in the data
 * @param {string} template - Template string
 * @param {Object} data - Data object
 * @returns {Object} - {valid: boolean, missing: Array<string>}
 */
function validateTemplate(template, data) {
  const variables = extractVariables(template);
  const missing = variables.filter(v => !data.hasOwnProperty(v) || data[v] == null);

  return {
    valid: missing.length === 0,
    missing: missing
  };
}

/**
 * Gets a list of available template variables with descriptions
 * @returns {Array<Object>} - Array of {name, description} objects
 */
function getAvailableVariables() {
  return [
    { name: 'jobTitle', description: 'Job title' },
    { name: 'description', description: 'Full job description' },
    { name: 'budget', description: 'Budget or hourly rate' },
    { name: 'skills', description: 'Required skills (comma-separated)' },
    { name: 'clientName', description: 'Client name' },
    { name: 'clientLocation', description: 'Client location' },
    { name: 'clientRating', description: 'Client rating' },
    { name: 'experienceLevel', description: 'Required experience level' },
    { name: 'duration', description: 'Project duration' },
    { name: 'jobType', description: 'Job type (fixed-price or hourly)' },
    { name: 'proposalsCount', description: 'Number of proposals submitted' },
    { name: 'postingDate', description: 'When the job was posted' },
    { name: 'clientHireRate', description: 'Client hire rate percentage' },
    { name: 'clientJobsPosted', description: 'Number of jobs posted by client' },
    { name: 'clientTotalSpent', description: 'Total amount spent by client' }
  ];
}

// Export for use in content scripts
if (typeof window !== 'undefined') {
  window.TemplateEngineUtils = {
    processTemplate,
    extractVariables,
    validateTemplate,
    getAvailableVariables
  };
}

