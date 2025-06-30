// Popup script for Intentional LinkedIn extension

document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  loadSettings();
  
  // Add event listeners
  document.getElementById('save-api-key').addEventListener('click', saveApiKey);
  document.getElementById('auto-hide-feed').addEventListener('change', saveSettings);
  document.getElementById('enabled').addEventListener('change', saveSettings);
});

async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get([
      'openai_api_key',
      'auto_hide_feed',
      'enabled'
    ]);
    
    // Set form values
    document.getElementById('api-key').value = result.openai_api_key || '';
    document.getElementById('auto-hide-feed').checked = result.auto_hide_feed !== false;
    document.getElementById('enabled').checked = result.enabled !== false;
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

async function saveApiKey() {
  const apiKey = document.getElementById('api-key').value.trim();
  
  if (!apiKey) {
    alert('Please enter your OpenAI API key');
    return;
  }
  
  try {
    await chrome.storage.sync.set({ openai_api_key: apiKey });
    
    // Show success message
    const button = document.getElementById('save-api-key');
    const originalText = button.textContent;
    button.textContent = 'Saved!';
    button.style.background = '#28a745';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  } catch (error) {
    console.error('Error saving API key:', error);
    alert('Error saving API key. Please try again.');
  }
}

async function saveSettings() {
  try {
    const autoHideFeed = document.getElementById('auto-hide-feed').checked;
    const enabled = document.getElementById('enabled').checked;
    
    await chrome.storage.sync.set({
      auto_hide_feed: autoHideFeed,
      enabled: enabled
    });
    
    // Notify content script of settings change
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url && tab.url.includes('linkedin.com')) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'SETTINGS_UPDATED',
        settings: { auto_hide_feed: autoHideFeed, enabled }
      });
    }
  } catch (error) {
    console.error('Error saving settings:', error);
  }
} 