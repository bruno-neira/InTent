import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock DOM for testing
const mockDOM = () => {
  const createElement = vi.fn((tagName: string) => {
    const element = {
      id: '',
      className: '',
      style: {},
      appendChild: vi.fn(),
      remove: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      querySelector: vi.fn(),
      querySelectorAll: vi.fn(() => []),
      setAttribute: vi.fn(),
      getAttribute: vi.fn(),
      tagName: tagName.toUpperCase(),
    }
    return element
  })

  const mockDocument = {
    createElement,
    body: {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    },
    querySelector: vi.fn(),
    querySelectorAll: vi.fn(() => []),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }

  const mockWindow = {
    location: {
      hostname: 'www.linkedin.com',
      href: 'https://www.linkedin.com/feed/',
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }

  return { mockDocument, mockWindow, createElement }
}

describe('Content Script - IntentionalLinkedIn', () => {
  let { mockDocument, mockWindow, createElement } = mockDOM()

  beforeEach(() => {
    vi.clearAllMocks()
    const fresh = mockDOM()
    mockDocument = fresh.mockDocument
    mockWindow = fresh.mockWindow
    createElement = fresh.createElement

    // Mock global objects
    vi.stubGlobal('document', mockDocument)
    vi.stubGlobal('window', mockWindow)
    vi.stubGlobal('chrome', {
      runtime: {
        onMessage: {
          addListener: vi.fn(),
        },
      },
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize only on LinkedIn pages', async () => {
    // Test non-LinkedIn page
    mockWindow.location.hostname = 'example.com'
    
    // Import the content script (this would normally auto-execute)
    await import('./content')
    
    expect(createElement).not.toHaveBeenCalled()
  })

  it('should create chat interface container on LinkedIn', async () => {
    mockWindow.location.hostname = 'www.linkedin.com'
    const mockContainer = { id: '', appendChild: vi.fn() }
    createElement.mockReturnValue(mockContainer)
    
    await import('./content')
    
    expect(createElement).toHaveBeenCalledWith('div')
    expect(mockContainer.id).toBe('intentional-linkedin-chat')
  })

  it('should hide LinkedIn feed elements', async () => {
    mockWindow.location.hostname = 'www.linkedin.com'
    const mockFeedElements = [
      { style: {} },
      { style: {} },
    ]
    mockDocument.querySelectorAll.mockReturnValue(mockFeedElements)
    
    await import('./content')
    
    // Verify feed hiding selectors are queried
    expect(mockDocument.querySelectorAll).toHaveBeenCalledWith(
      expect.stringContaining('feed')
    )
  })

  it('should setup keyboard shortcuts', async () => {
    mockWindow.location.hostname = 'www.linkedin.com'
    
    await import('./content')
    
    expect(mockDocument.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    )
  })

  it('should toggle chat interface with keyboard shortcut', async () => {
    mockWindow.location.hostname = 'www.linkedin.com'
    let keydownHandler: (event: KeyboardEvent) => void
    
    mockDocument.addEventListener.mockImplementation((event, handler) => {
      if (event === 'keydown') {
        keydownHandler = handler
      }
    })
    
    const mockContainer = {
      style: { display: 'block' },
      remove: vi.fn(),
      appendChild: vi.fn(),
    }
    createElement.mockReturnValue(mockContainer)
    
    await import('./content')
    
    // Simulate Ctrl+Shift+L
    const mockEvent = {
      ctrlKey: true,
      shiftKey: true,
      key: 'L',
      preventDefault: vi.fn(),
    } as any
    
    keydownHandler!(mockEvent)
    
    expect(mockEvent.preventDefault).toHaveBeenCalled()
  })
})
