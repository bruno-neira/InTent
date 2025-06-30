// Background service worker for Intentional LinkedIn extension

interface MessageRequest {
  type: string
  message?: string
}

interface OpenAIResponse {
  reply: string
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request: MessageRequest, sender, sendResponse) => {
  if (request.type === 'SEND_MESSAGE' && request.message) {
    handleOpenAIMessage(request.message)
      .then(response => sendResponse(response))
      .catch(error => {
        console.error('Error handling message:', error)
        sendResponse({ reply: 'Sorry, I encountered an error. Please try again.' })
      })
    return true // Keep the message channel open for async response
  }
})

async function handleOpenAIMessage(message: string): Promise<OpenAIResponse> {
  try {
    // Get API key from storage
    const result = await chrome.storage.sync.get(['openai_api_key'])
    const apiKey = result.openai_api_key

    if (!apiKey) {
      return {
        reply: 'Please set your OpenAI API key in the extension settings.'
      }
    }

    // Create LinkedIn-specific prompt
    const systemPrompt = `You are an AI assistant that helps users be more intentional on LinkedIn. 
    Your goal is to help users accomplish specific tasks on LinkedIn rather than getting distracted by the feed.
    
    You can help with:
    - Finding relevant job postings
    - Suggesting people to connect with
    - Recommending content to read or learn from
    - Providing LinkedIn search strategies
    - Suggesting networking approaches
    
    Keep responses concise, actionable, and focused on LinkedIn-specific actions.
    Always provide specific, actionable next steps.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return { reply }
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    throw error
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Intentional LinkedIn extension installed')
  
  // Set default settings
  chrome.storage.sync.set({
    enabled: true,
    auto_hide_feed: true
  })
}) 