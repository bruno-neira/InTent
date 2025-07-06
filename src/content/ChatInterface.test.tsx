import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatInterface from './ChatInterface'

// Mock chrome runtime for this test
const mockSendMessage = vi.fn()
vi.stubGlobal('chrome', {
  runtime: {
    sendMessage: mockSendMessage
  }
})

describe('ChatInterface', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders initial welcome message', () => {
    render(<ChatInterface onClose={mockOnClose} />)
    
    expect(screen.getByText(/Hi! I'm your Intentional LinkedIn assistant/)).toBeInTheDocument()
  })

  it('renders input field and send button', () => {
    render(<ChatInterface onClose={mockOnClose} />)
    
    expect(screen.getByPlaceholderText(/Ask me anything about LinkedIn/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ChatInterface onClose={mockOnClose} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledOnce()
  })

  it('sends message when form is submitted', async () => {
    const user = userEvent.setup()
    mockSendMessage.mockImplementation((message, callback) => {
      callback({ reply: 'Test response from AI' })
    })

    render(<ChatInterface onClose={mockOnClose} />)
    
    const input = screen.getByPlaceholderText(/Ask me anything about LinkedIn/)
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    await user.type(input, 'Test message')
    await user.click(sendButton)
    
    expect(mockSendMessage).toHaveBeenCalledWith(
      { type: 'SEND_MESSAGE', message: 'Test message' },
      expect.any(Function)
    )
  })

  it('displays user message in chat', async () => {
    const user = userEvent.setup()
    render(<ChatInterface onClose={mockOnClose} />)
    
    const input = screen.getByPlaceholderText(/Ask me anything about LinkedIn/)
    
    await user.type(input, 'Hello, AI!')
    await user.keyboard('{Enter}')
    
    expect(screen.getByText('Hello, AI!')).toBeInTheDocument()
  })

  it('clears input after sending message', async () => {
    const user = userEvent.setup()
    mockSendMessage.mockImplementation((message, callback) => {
      callback({ reply: 'Response' })
    })

    render(<ChatInterface onClose={mockOnClose} />)
    
    const input = screen.getByPlaceholderText(/Ask me anything about LinkedIn/)
    
    await user.type(input, 'Test message')
    await user.keyboard('{Enter}')
    
    expect(input).toHaveValue('')
  })

  it('shows loading state while message is being sent', async () => {
    const user = userEvent.setup()
    let resolveCallback: (response: any) => void
    
    mockSendMessage.mockImplementation((message, callback) => {
      resolveCallback = callback
    })

    render(<ChatInterface onClose={mockOnClose} />)
    
    const input = screen.getByPlaceholderText(/Ask me anything about LinkedIn/)
    
    await user.type(input, 'Test message')
    await user.keyboard('{Enter}')
    
    // Should show loading state
    expect(screen.getByText(/thinking/i)).toBeInTheDocument()
    
    // Resolve the message
    resolveCallback!({ reply: 'Test response' })
    
    await waitFor(() => {
      expect(screen.queryByText(/thinking/i)).not.toBeInTheDocument()
    })
  })

  it('handles empty messages gracefully', async () => {
    const user = userEvent.setup()
    render(<ChatInterface onClose={mockOnClose} />)
    
    const sendButton = screen.getByRole('button', { name: /send/i })
    
    await user.click(sendButton)
    
    expect(mockSendMessage).not.toHaveBeenCalled()
  })

  it('displays AI response after sending message', async () => {
    const user = userEvent.setup()
    mockSendMessage.mockImplementation((message, callback) => {
      callback({ reply: 'This is an AI response' })
    })

    render(<ChatInterface onClose={mockOnClose} />)
    
    const input = screen.getByPlaceholderText(/Ask me anything about LinkedIn/)
    
    await user.type(input, 'Test question')
    await user.keyboard('{Enter}')
    
    await waitFor(() => {
      expect(screen.getByText('This is an AI response')).toBeInTheDocument()
    })
  })
})
