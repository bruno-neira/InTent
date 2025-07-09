import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Background Script', () => {
  const mockChrome = {
    runtime: {
      onMessage: {
        addListener: vi.fn(),
      },
    },
    storage: {
      sync: {
        get: vi.fn(),
      },
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('chrome', mockChrome)
    vi.stubGlobal('fetch', vi.fn())
  })

  it('should register message listener on load', async () => {
    await import('./background')
    
    expect(mockChrome.runtime.onMessage.addListener).toHaveBeenCalled()
  })

  it('should handle SEND_MESSAGE requests', async () => {
    let messageHandler: any
    mockChrome.runtime.onMessage.addListener.mockImplementation((handler) => {
      messageHandler = handler
    })

    mockChrome.storage.sync.get.mockResolvedValue({
      openai_api_key: 'test-api-key'
    })

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: 'Test response' } }]
      })
    })
    vi.stubGlobal('fetch', mockFetch)

    await import('./background')

    const mockSendResponse = vi.fn()
    const result = messageHandler(
      { type: 'SEND_MESSAGE', message: 'Hello' },
      {},
      mockSendResponse
    )

    expect(result).toBe(true) // Should return true to keep channel open
  })

  it('should handle OpenAI API calls correctly', async () => {
    let messageHandler: any
    mockChrome.runtime.onMessage.addListener.mockImplementation((handler) => {
      messageHandler = handler
    })

    mockChrome.storage.sync.get.mockResolvedValue({
      openai_api_key: 'test-api-key'
    })

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: 'AI response' } }]
      })
    })
    vi.stubGlobal('fetch', mockFetch)

    await import('./background')

    const mockSendResponse = vi.fn()
    await messageHandler(
      { type: 'SEND_MESSAGE', message: 'Test message' },
      {},
      mockSendResponse
    )

    // Give time for async operations
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        }),
        body: expect.stringContaining('Test message'),
      })
    )
  })

  it('should handle missing API key gracefully', async () => {
    let messageHandler: any
    mockChrome.runtime.onMessage.addListener.mockImplementation((handler) => {
      messageHandler = handler
    })

    mockChrome.storage.sync.get.mockResolvedValue({})

    await import('./background')

    const mockSendResponse = vi.fn()
    await messageHandler(
      { type: 'SEND_MESSAGE', message: 'Test message' },
      {},
      mockSendResponse
    )

    // Give time for async operations
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockSendResponse).toHaveBeenCalledWith({
      reply: expect.stringContaining('API key')
    })
  })

  it('should handle API errors gracefully', async () => {
    let messageHandler: any
    mockChrome.runtime.onMessage.addListener.mockImplementation((handler) => {
      messageHandler = handler
    })

    mockChrome.storage.sync.get.mockResolvedValue({
      openai_api_key: 'test-api-key'
    })

    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    vi.stubGlobal('fetch', mockFetch)

    await import('./background')

    const mockSendResponse = vi.fn()
    await messageHandler(
      { type: 'SEND_MESSAGE', message: 'Test message' },
      {},
      mockSendResponse
    )

    // Give time for async operations
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockSendResponse).toHaveBeenCalledWith({
      reply: expect.stringContaining('error')
    })
  })
})
