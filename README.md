# Intentional LinkedIn

A browser extension that helps you stay focused on LinkedIn by replacing the distracting feed with an AI-powered chat interface. Be more intentional about your LinkedIn usage and accomplish your specific goals.

## Features

- **Distraction-Free Experience**: Automatically hides the LinkedIn feed to eliminate distractions
- **AI-Powered Assistant**: Chat with an AI assistant that helps you accomplish specific LinkedIn goals
- **Smart Recommendations**: Get personalized suggestions for jobs, connections, and content
- **Keyboard Shortcuts**: Quick toggle with `Ctrl/Cmd + Shift + L`
- **Customizable Settings**: Control feed hiding and extension behavior



## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key
- Chrome browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd intentional-linkedin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder from the build

5. **Configure your OpenAI API key**
   - Click the extension icon in your browser
   - Enter your OpenAI API key in the settings
   - Click "Save"

### Development

For development with hot reloading:

```bash
npm run dev
```

For watching changes and rebuilding:

```bash
npm run watch
```

## Usage

1. **Navigate to LinkedIn**: Go to any LinkedIn page
2. **Chat Interface**: The AI chat interface will automatically appear, overlaying the distracting feed
3. **Ask Questions**: Tell the AI what you want to accomplish on LinkedIn:
   - "Find me software engineering jobs in San Francisco"
   - "Help me connect with product managers in my industry"
   - "Show me content about AI and machine learning"
   - "What networking events should I attend?"
4. **Toggle Interface**: Use `Ctrl/Cmd + Shift + L` to show/hide the chat interface
5. **Settings**: Click the extension icon to access settings and configure your preferences

## How It Works

### Content Script
- Injects into LinkedIn pages
- Hides distracting feed elements
- Renders the chat interface overlay
- Handles keyboard shortcuts

### Background Service Worker
- Manages OpenAI API calls
- Handles message routing between content script and popup
- Stores and retrieves user settings

### Popup Interface
- Provides settings management
- API key configuration
- Extension controls

## Project Structure

```
intentional-linkedin/
├── src/
│   ├── content/
│   │   ├── content.tsx          # Main content script
│   │   ├── ChatInterface.tsx    # React chat component
│   │   └── content.css          # Content styles
│   ├── background/
│   │   └── background.ts        # Service worker
│   └── popup/
│       ├── popup.html           # Popup interface
│       ├── popup.css            # Popup styles
│       └── popup.js             # Popup logic
├── manifest.json                # Extension manifest
├── vite.config.ts              # Build configuration
├── tailwind.config.js          # Tailwind CSS config
└── package.json                # Dependencies
```

## Configuration

### OpenAI API Setup

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add the key in the extension popup settings
3. The extension will use GPT-3.5-turbo for responses

### Settings

- **Auto-hide feed**: Automatically hide LinkedIn feed elements
- **Enable extension**: Toggle the extension on/off
- **API Key**: Your OpenAI API key for AI responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Privacy

- Your OpenAI API key is stored locally in Chrome storage
- No data is sent to external servers except OpenAI API calls
- LinkedIn page content is not collected or stored

## Support

For issues and feature requests, please create an issue in the repository. 