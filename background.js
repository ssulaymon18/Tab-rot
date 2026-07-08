// Default Thresholds (in milliseconds)
const THRESHOLDS = {
  FRESH: 0,
  INFECTION: 2 * 60 * 1000,       // 2 minutes
  DECAY: 30 * 60 * 1000,          // 30 minutes
  ROTTEN: 3 * 60 * 60 * 1000,     // 3 hours
  DEAD: 24 * 60 * 60 * 1000       // 1 day
};

// Initialize or update tab timestamp
function updateTabTimestamp(tabId) {
  const now = Date.now();
  chrome.storage.local.get(['tabData'], (result) => {
    let tabData = result.tabData || {};
    tabData[tabId] = { lastUsed: now, state: 'FRESH' };
    chrome.storage.local.set({ tabData });
  });
}

// Calculate state based on elapsed time
function getState(elapsed) {
  if (elapsed >= THRESHOLDS.DEAD) return 'ROTTEN';
  if (elapsed >= THRESHOLDS.ROTTEN) return 'DECAY';
  if (elapsed >= THRESHOLDS.DECAY) return 'INFECTION';
  return 'FRESH';
}

// Periodically check tabs and update their states
/*
  Note: In a real production environment, you would use canvas-generated data URLs 
  or path strings to actual icons (e.g., '🟢', '🟡', '🟠', '🟤', '🤢') instead of text emojis.
*/
function checkTabAges() {
  chrome.tabs.query({}, (tabs) => {
    chrome.storage.local.get(['tabData'], (result) => {
      let tabData = result.tabData || {};
      const now = Date.now();

      tabs.forEach((tab) => {
        if (!tab.id || !tab.url || tab.url.startsWith('chrome://')) return;

        // If it's the currently active tab, it stays fresh
        if (tab.active) {
          if (!tabData[tab.id]) updateTabTimestamp(tab.id);
          return;
        }

        let data = tabData[tab.id] || { lastUsed: now, state: 'FRESH' };
        let elapsed = now - data.lastUsed;
        let newState = getState(elapsed);

        if (data.state !== newState && data.state !== 'RECOVER') {
          data.state = newState;
          tabData[tab.id] = data;
          
          // Send message to content script to change favicon
          chrome.tabs.sendMessage(tab.id, { action: "updateState", state: newState }).catch(() => {});
        }
      });
      chrome.storage.local.set({ tabData });
    });
  });
}

// Listen for tab updates, creation, or activation
chrome.tabs.onCreated.addListener((tab) => updateTabTimestamp(tab.id));
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') updateTabTimestamp(tabId);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  chrome.storage.local.get(['tabData'], (result) => {
    let tabData = result.tabData || {};
    if (tabData[tabId] && tabData[tabId].state !== 'FRESH') {
      // Trigger recovery animation
      tabData[tabId].state = 'RECOVER';
      chrome.storage.local.set({ tabData });

      chrome.tabs.sendMessage(tabId, { action: "updateState", state: "RECOVER" }).catch(() => {});

      // After 5 seconds, reset back to fresh
      setTimeout(() => {
        updateTabTimestamp(tabId);
        chrome.tabs.sendMessage(tabId, { action: "updateState", state: "FRESH" }).catch(() => {});
      }, 5000);
    } else {
      updateTabTimestamp(tabId);
    }
  });
});

// Run check every 30 seconds
setInterval(checkTabAges, 30000);