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
    // Create chat interface container
    this.chatContainer = document.createElement('div')
    this.chatContainer.id = 'intentional-linkedin-chat'
    this.chatContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
    `

    // Render React component
    const root = ReactDOM.createRoot(this.chatContainer)
    root.render(<ChatInterface onClose={() => this.toggleChatInterface()} />)

    document.body.appendChild(this.chatContainer)
    this.isActive = true
  }

  private hideLinkedInFeed() {
    // Hide only the main feed container
    const feedContent = document.querySelector('.scaffold-finite-scroll__content[data-finite-scroll-hotkey-context="FEED"]');
    if (feedContent && feedContent instanceof HTMLElement) {
      feedContent.style.display = 'none';
    }
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