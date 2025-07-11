import React, { useState, useEffect } from 'react'

const CHAT_INPUT_ID = 'intentional-linkedin-chat-input'

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
  `;
  document.head.appendChild(style);
}

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    injectChatInputStyle();
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    setInputValue('')
  }

  return (
    <form
      onSubmit={handleSendMessage}
      className="w-full flex justify-center items-center py-8"
    >
      <div className="w-full max-w-4xl">
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
            disabled={!inputValue.trim()}
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="#0077B5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </form>
  )
}

export default ChatInterface 