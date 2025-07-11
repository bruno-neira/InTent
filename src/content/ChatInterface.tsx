import React, { useState, useEffect } from 'react'

const CHAT_INPUT_ID = 'intentional-linkedin-chat-input'

const injectChatInputStyle = () => {
  if (document.getElementById('intentional-linkedin-chat-style')) return;
  const style = document.createElement('style');
  style.id = 'intentional-linkedin-chat-style';
  style.innerHTML = `
    #${CHAT_INPUT_ID} {
      width: 100% !important;
      padding-left: 2rem !important;
      padding-right: 2rem !important;
      padding-top: 2rem !important;
      padding-bottom: 2rem !important;
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
      <input
        id={CHAT_INPUT_ID}
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="What are you looking to do?"
      />
    </form>
  )
}

export default ChatInterface 