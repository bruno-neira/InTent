import React from 'react'
import ReactDOM from 'react-dom/client'
import ChatInterface from './ChatInterface'
import './content.css'

// Main content script for LinkedIn
class IntentionalLinkedIn {
  private chatContainer: HTMLDivElement | null = null
  private isActive: boolean = false

  constructor() {
    this.init()
  }

  private init() {
    // Check if we're on LinkedIn
    if (!window.location.hostname.includes('linkedin.com')) {
      return
    }

    // Initialize the extension
    this.setupChatInterface()
    this.hideLinkedInFeed()
    this.setupKeyboardShortcuts()
  }

  private setupChatInterface() {
    // Find the feed container
    const feedContent = document.querySelector('.scaffold-finite-scroll__content[data-finite-scroll-hotkey-context="FEED"]');
    if (!feedContent) return;

    // Remove all children (feed posts)
    while (feedContent.firstChild) {
      feedContent.removeChild(feedContent.firstChild);
    }

    // Create chat interface container
    this.chatContainer = document.createElement('div');
    this.chatContainer.id = 'intentional-linkedin-chat';
    this.chatContainer.style.cssText = `
      width: 100%;
      min-height: 400px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      background: transparent;
    `;

    // Render React component
    const root = ReactDOM.createRoot(this.chatContainer);
    root.render(<ChatInterface />);

    feedContent.appendChild(this.chatContainer);
    this.isActive = true;

    // MutationObserver to keep only the chat interface
    const observer = new MutationObserver(() => {
      Array.from(feedContent.children).forEach(child => {
        if (child !== this.chatContainer) {
          feedContent.removeChild(child);
        }
      });
    });
    observer.observe(feedContent, { childList: true });
  }

  private hideLinkedInFeed() {
    // No longer needed, handled in setupChatInterface
  }

  private toggleChatInterface() {
    if (this.chatContainer) {
      if (this.isActive) {
        this.chatContainer.style.display = 'none'
        this.isActive = false
      } else {
        this.chatContainer.style.display = 'flex'
        this.isActive = true
      }
    }
  }

  private setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + Shift + L to toggle chat interface
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
        event.preventDefault()
        this.toggleChatInterface()
      }
    })
  }
}

// Initialize the extension
new IntentionalLinkedIn() 