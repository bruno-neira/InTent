import React, { useState, useEffect } from 'react'

const CHAT_INPUT_ID = 'intentional-linkedin-chat-input'

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const injectChatInputStyle = () => {
  if (document.getElementById('intentional-linkedin-chat-style')) return;
  const style = document.createElement('style');
  style.id = 'intentional-linkedin-chat-style';
  style.innerHTML = `
    .intentional-linkedin-input-container {
      position: relative !important;
      width: 100% !important;
    }
    #${CHAT_INPUT_ID} {
      width: 100% !important;
      padding-left: 2rem !important;
      padding-right: 5rem !important;
      padding-top: 2.5rem !important;
      padding-bottom: 2.5rem !important;
      border-radius: 9999px !important;
      background: #fff !important;
      border: none !important;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06) !important;
      font-size: 1.5rem !important;
      font-weight: 500 !important;
      color: #222 !important;
      outline: none !important;
    }
    #${CHAT_INPUT_ID}::placeholder {
      color: #555 !important;
      opacity: 1 !important;
      font-weight: 400 !important;
    }
    .intentional-linkedin-submit-btn {
      position: absolute !important;
      right: 0.5rem !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      transition: background 0.2s;
    }
    .intentional-linkedin-submit-btn[disabled] {
      background: #b3d3ea !important;
      cursor: not-allowed !important;
      opacity: 0.6 !important;
      pointer-events: none !important;
      box-shadow: none !important;
    }
    .intentional-linkedin-submit-btn[disabled] span {
      background: #f3f6f8 !important;
    }
    .chat-messages {
      max-height: 60vh !important;
      overflow-y: auto !important;
      padding: 1rem 0 !important;
    }
    .message {
      margin-bottom: 1rem !important;
      display: flex !important;
    }
    .message.user {
      justify-content: flex-end !important;
    }
    .message.assistant {
      justify-content: flex-start !important;
    }
    .message-bubble {
      max-width: 70% !important;
      padding: 1rem 1.5rem !important;
      border-radius: 1.5rem !important;
      font-size: 1.5rem !important;
      line-height: 1.5 !important;
      border: none !important;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06) !important;
    }
    .message-bubble.user {
      background: #fff !important;
      color: #222 !important;
      border-bottom-right-radius: 0.5rem !important;
    }
    .message-bubble.assistant {
      max-width: 100% !important;
      background: transparent !important;
      color: #222 !important;
      padding: 0.5rem 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }
  `;
  document.head.appendChild(style);
}

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    injectChatInputStyle();
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate LLM response (placeholder for now)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I received your message: "${userMessage.text}". This is a placeholder response.`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="w-full flex flex-col justify-center items-center py-8">
      <div className="w-full max-w-4xl">
        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.isUser ? 'user' : 'assistant'}`}>
              <div className={`message-bubble ${message.isUser ? 'user' : 'assistant'}`}>
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-bubble assistant">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage}>
          <div className="intentional-linkedin-input-container">
            <input
              id={CHAT_INPUT_ID}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="What are you looking to do?"
            />
            <button
              type="submit"
              className="intentional-linkedin-submit-btn flex items-center justify-center w-14 h-14 rounded-full bg-linkedin-blue hover:bg-linkedin-dark focus:outline-none border-none p-0"
              style={{ border: 'none' }}
              disabled={!inputValue.trim() || isLoading}
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="#0077B5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface 