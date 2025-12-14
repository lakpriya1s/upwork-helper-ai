# Upwork Cover Letter AI - Chrome Extension

An AI-powered Chrome extension that helps Upwork freelancers by:
- 🔥 Multi-tiered job highlighting (1h, 2h, 4h time windows with different colors)
- ✨ Automatically generating personalized cover letters using OpenAI with your developer profile
- 🤖 Auto-answering additional job application questions
- 🛡️ Smart Cloudflare/CAPTCHA detection and handling
- ⚙️ Comprehensive settings with profile management and template customization

## Features

### 1. Multi-Tiered Job Highlighting
- **🔥 Super New (within 1 hour)**: Highlighted with red border for ultra-fresh opportunities
- **✨ New (within 2 hours)**: Highlighted with green border for recent jobs
- **⏰ Recent (within 4 hours)**: Highlighted with blue border for fresh postings
- Works on Upwork job search and find work pages (`/nx/search/jobs`, `/nx/find-work`, `/ab/find-work`)
- Real-time detection with MutationObserver for dynamically loaded content
- Customizable highlighting time windows in settings
- Each job gets a visual badge indicating how fresh it is

### 2. AI-Powered Cover Letter Generation
- **Intelligent Content Generation**: Auto-generates personalized cover letters based on job details
- **Comprehensive Job Data Extraction**: Extracts title, description, skills, client info, budget, experience level, duration, and more
- **Developer Profile Integration**: Generates highly personalized cover letters using your:
  - Professional name, title, and years of experience
  - Bio and summary
  - Work experience and key projects
  - Education and certifications
  - Programming languages, frameworks, and technologies
  - Portfolio/GitHub URL
  - Hourly rate
- **Customizable Templates**: Use templates with variable substitution ({{jobTitle}}, {{clientName}}, etc.)
- **Multiple AI Models**: Support for GPT-5.2 Pro, GPT-5, GPT-4.1, GPT-4o, GPT-4o Mini, GPT-4 Turbo, and GPT-3.5 Turbo
- **Smart Textarea Detection**: Automatically finds and fills the cover letter field with multiple fallback selectors
- **Vue.js Compatible**: Triggers proper events for Upwork's Vue.js interface

### 3. Automatic Additional Question Answering
- **Intelligent Question Detection**: Automatically detects additional questions in job applications
- **Context-Aware Answers**: Generates relevant answers using both job data and your developer profile
- **Multi-Question Support**: Handles multiple additional questions in a single job application
- **Automatic Injection**: Fills in all question textareas automatically
- **Seamless Integration**: Works alongside cover letter generation

### 4. Cloudflare & Robot Check Handling
- **Automatic Detection**: Detects Cloudflare verification and CAPTCHA challenges
- **User-Friendly Workflow**: Waits for user to complete verification before generating content
- **Smart Monitoring**: Monitors page state and automatically resumes after verification passes
- **Timeout Protection**: 5-minute timeout with fallback to manual trigger button
- **Visual Feedback**: Notifies users when verification is detected and when it passes

### 5. Comprehensive Settings & Configuration
- **OpenAI API Configuration**: 
  - Secure local storage of API key (ChromeSync)
  - API key testing functionality
  - Support for latest GPT models (GPT-5.2 Pro, GPT-5, GPT-4.1, GPT-4o, GPT-3.5)
- **Developer Profile Management**:
  - Full professional profile with bio, experience, skills, education
  - Programming languages and frameworks catalog
  - Work history and key projects
  - Portfolio and hourly rate
- **Template Customization**:
  - Visual template editor with variable guide
  - Click-to-copy variable insertion
  - Template variable reference guide
  - Reset to default option
- **Job Highlighting Customization**:
  - Toggle each time window independently (1h, 2h, 4h)
  - Configure different colors for different time periods
- **Auto-Generate Toggle**: Enable/disable automatic cover letter generation
- **Keyboard Shortcuts**: Ctrl/Cmd + S to save settings
- **Beautiful Modern UI**: Gradient purple theme with smooth animations and dark mode support

## Installation

### 1. Prerequisites
- Google Chrome browser (or Chromium-based browser like Edge, Brave, etc.)
- An OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com/api-keys))

### 2. Install the Extension

#### Option A: Load as Unpacked Extension (Development)
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `upwork-helper-ai` folder
6. The extension should now appear as "Upwork Cover Letter AI" in your extensions list

#### Option B: Create Icons First
Before loading the extension, you need to create icon files:
1. Create three PNG images: 16x16, 48x48, and 128x128 pixels
2. Name them `icon16.png`, `icon48.png`, and `icon128.png`
3. Place them in the `icons/` folder
4. You can use simple colored squares with "UH" text or create custom icons

### 3. Configure the Extension
1. Click the extension icon in Chrome toolbar
2. Click "⚙️ Open Settings"
3. Enter your OpenAI API key
4. (Optional) Customize the cover letter template
5. Click "💾 Save Settings"
6. Test your API key using the "Test API Key" button

### 4. Set Up Your Developer Profile (Highly Recommended)
For the best results with AI-generated cover letters, configure your developer profile in the settings:

1. Open the extension settings (click extension icon → "⚙️ Open Settings")
2. Scroll to the **👤 Developer Profile** section
3. Fill in your professional information:
   - **Full Name**: Your professional name
   - **Professional Title**: e.g., "Full-Stack Developer", "React Native Specialist"
   - **Years of Experience**: Total years of professional experience
   - **Professional Bio**: 2-3 sentences about your expertise
   - **Work Experience & Key Projects**: List your achievements and relevant projects
   - **Education & Certifications**: Degrees and certifications
   - **Programming Languages**: Languages you're proficient in
   - **Frameworks & Technologies**: Frameworks, libraries, and tools you use
   - **Core Skills**: Technical skills and specializations
   - **Portfolio/GitHub URL**: Link to your work
   - **Hourly Rate**: Your typical rate (optional)
4. Click "💾 Save Settings"

**Why this matters**: The AI uses your profile information to generate highly personalized, context-aware cover letters that highlight your relevant experience and skills for each specific job. The more detailed your profile, the better the generated proposals!

## Usage

### Highlighting Recent Jobs
1. Navigate to Upwork job search: `https://www.upwork.com/nx/search/jobs` or `https://www.upwork.com/nx/find-work`
2. Jobs will be automatically highlighted based on posting time:
   - **🔥 Red border**: Posted within 1 hour (super fresh!)
   - **✨ Green border**: Posted within 2 hours (very recent)
   - **⏰ Blue border**: Posted within 4 hours (still fresh)
3. Scroll through the page - the extension monitors for dynamically loaded jobs
4. Customize which time windows are highlighted in the settings page

### Generating Cover Letters & Answers

#### Auto-Generate (Default)
1. Navigate to any Upwork job detail page and click "Apply Now"
2. **Cloudflare/CAPTCHA handling**: 
   - If Upwork shows a verification check, complete it manually
   - The extension detects the check and waits for you to finish
   - Once verification passes, content generation starts automatically
3. The extension will automatically:
   - Extract comprehensive job data
   - Generate a personalized cover letter using your developer profile
   - Inject the cover letter into the textarea
   - Detect any additional questions
   - Generate and fill answers for all additional questions
4. Review, edit if needed, and submit

#### Manual Trigger
1. If auto-generate is disabled, click the extension icon
2. Click "✨ Generate Cover Letter" button
3. Or use the floating "✨ Generate Cover Letter" button on the application page
4. The cover letter and question answers will be generated for the current job page

## Template Variables

Use these variables in your cover letter template:

| Variable | Description |
|----------|-------------|
| `{{jobTitle}}` | Job title |
| `{{description}}` | Full job description |
| `{{budget}}` | Budget or hourly rate |
| `{{skills}}` | Required skills (comma-separated) |
| `{{clientName}}` | Client name |
| `{{clientLocation}}` | Client location |
| `{{clientRating}}` | Client rating |
| `{{experienceLevel}}` | Required experience level |
| `{{duration}}` | Project duration |
| `{{jobType}}` | Job type (fixed-price or hourly) |
| `{{proposalsCount}}` | Number of proposals submitted |
| `{{postingDate}}` | When the job was posted |

### Example Template

```
Dear {{clientName}},

I am excited to apply for your {{jobTitle}} position. With my expertise in {{skills}}, I am confident I can deliver exceptional results for your project.

After reviewing your job description, I understand you need [specific requirements]. I have [X years] of experience in this area and have successfully completed similar projects.

I am available to work within your {{budget}} budget and can commit to the {{duration}} timeline. I pride myself on delivering high-quality work, excellent communication, and timely project completion.

I would love to discuss how I can help bring your project to success. Please feel free to review my profile and portfolio.

Best regards
```

## Project Structure

```
upwork-helper/
├── manifest.json              # Extension manifest (Manifest V3)
├── background.js              # Service worker for OpenAI API calls
├── content-scripts/
│   ├── jobsList.js           # Highlights recent jobs on search pages
│   ├── jobDetail.js          # Extracts data, generates cover letters and answers questions
│   └── jobDetailWorkflow.js  # Handles apply workflow and Cloudflare detection
├── utils/
│   ├── dateParser.js         # Parses Upwork date formats
│   ├── jobExtractor.js       # Extracts job data from pages
│   └── templateEngine.js     # Processes templates with variables
├── options/
│   ├── options.html          # Settings page with developer profile
│   └── options.js            # Settings page logic
├── popup/
│   ├── popup.html            # Extension popup UI
│   └── popup.js              # Popup logic
├── styles/
│   └── inject.css            # Styles for highlighted jobs and notifications
└── icons/
    ├── icon16.png            # 16x16 icon
    ├── icon48.png            # 48x48 icon
    └── icon128.png           # 128x128 icon
```

## Compliance & Terms

This extension is designed to **assist** freelancers, not automate job applications:

- ✅ Only reads publicly visible job data
- ✅ User must manually review and submit cover letters
- ✅ Acts as an assistive writing tool (like Grammarly or spell-check)
- ✅ No automated proposal submissions
- ✅ No scraping of private/hidden data
- ✅ Respects Upwork's Terms of Service

**Important:** Always review and personalize generated cover letters before submitting. The AI is a tool to help you write faster, not replace your personal touch.

📋 **For detailed compliance information, see [COMPLIANCE.md](COMPLIANCE.md)**

## Troubleshooting

### Cover Letter Not Generated
1. Check that your API key is configured correctly
2. Test the API key in settings
3. Ensure you have sufficient OpenAI API credits
4. Check the browser console for error messages (F12)
5. Try refreshing the job page

### Jobs Not Highlighted
1. Ensure you're on an Upwork job search page
2. Check that jobs were actually posted within 1 hour
3. Refresh the page
4. Check browser console for errors

### Textarea Not Found
- The extension looks for the cover letter textarea
- On some Upwork pages, you may need to navigate to the proposal section first
- If auto-inject fails, the cover letter will be logged to the console (F12)

## Development

### Making Changes
1. Edit the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Upwork Cover Letter AI extension card
4. Test your changes on Upwork

### Debugging
- Use Chrome DevTools (F12) to view console logs
- Check the "Errors" section in `chrome://extensions/`
- Content script logs appear in the page console
- Background script logs appear in the service worker console

## API Costs

The extension uses OpenAI's API, which has associated costs:

- **GPT-4o Mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens (Recommended)
- **GPT-3.5 Turbo**: ~$0.50 per 1M input tokens, ~$1.50 per 1M output tokens

Estimated cost per cover letter: **$0.001 - $0.01** (depending on model and length)

## Privacy

- Your API key is stored locally in Chrome's sync storage
- No data is sent to any server except OpenAI
- The extension does not collect or transmit any personal data
- All processing happens locally in your browser

## License

MIT License - Copyright (c) 2024 Lakpriya Senevirathna ([@lakpriya1s](https://github.com/lakpriya1s))

See [LICENSE](LICENSE) file for full details.

**Important Compliance Notes:**
- This extension is provided as-is for personal and professional use
- Users must comply with:
  - Upwork's Terms of Service
  - OpenAI's Usage Policies
  - Chrome Web Store policies (if publishing)

## Support

For issues or questions:
1. Check the console for error messages
2. Verify your OpenAI API key is valid and has credits
3. Ensure you're using the latest version of Chrome
4. Review this README for troubleshooting tips

## Future Enhancements

Potential features for future versions:
- Support for multiple cover letter templates with template switching/favorites
- Cover letter history and save/reuse functionality
- Statistics tracking dashboard (jobs applied, success rate, response rates)
- Export cover letters to clipboard or PDF
- Support for other freelance platforms (Fiverr, Freelancer.com, etc.)
- AI-powered job matching and recommendations based on your profile
- Proposal tracking and follow-up reminders
- Browser extension for Firefox and Safari

---

**Made with ❤️ for Upwork Freelancers**

*Happy freelancing! 🚀*

---

© 2025 Lakpriya Senevirathna ([@lakpriya1s](https://github.com/lakpriya1s)) - MIT License

