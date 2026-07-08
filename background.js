// Carnival Time Thresholds (in milliseconds)
const THRESHOLDS = {
  FRESH: 0,
  ONE_DAY: 1 * 24 * 60 * 60 * 1000,     // 1 day
  THREE_DAYS: 3 * 24 * 60 * 60 * 1000,   // 3 days
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,    // 1 week
  TWO_WEEKS: 14 * 24 * 60 * 60 * 1000,  // 2 weeks
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000   // 1 month+
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

// Calculate precise decay state based on Carnival graphic
function getState(elapsed) {
  if (elapsed >= THRESHOLDS.ONE_MONTH) return 'MONTH_PLUS';
  if (elapsed >= THRESHOLDS.TWO_WEEKS) return 'TWO_WEEKS';
  if (elapsed >= THRESHOLDS.ONE_WEEK) return 'ONE_WEEK';
  if (elapsed >= THRESHOLDS.THREE_DAYS) return 'THREE_DAYS';
  if (elapsed >= THRESHOLDS.ONE_DAY) return 'ONE_DAY';
  return 'FRESH';
}

// Periodically check tabs and update their states
function checkTabAges() {
  chrome.tabs.query({}, (tabs) => {
    chrome.storage.local.get(['tabData'], (result) => {
      let tabData = result.tabData || {};
      const now = Date.now();

      tabs.forEach((tab) => {
        if (!tab.id || !tab.url || tab.url.startsWith('chrome://')) return;

        // Active tab stays fresh
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
          
          chrome.tabs.sendMessage(tab.id, { action: "updateState", state: newState }).catch(() => {});
        }
      });
      chrome.storage.local.set({ tabData });
    });
  });
}

// Listeners
chrome.tabs.onCreated.addListener((tab) => updateTabTimestamp(tab.id));
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') updateTabTimestamp(tabId);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  chrome.storage.local.get(['tabData'], (result) => {
    let tabData = result.tabData || {};
    if (tabData[tabId] && tabData[tabId].state !== 'FRESH') {
      tabData[tabId].state = 'RECOVER';
      chrome.storage.local.set({ tabData });

      chrome.tabs.sendMessage(tabId, { action: "updateState", state: "RECOVER" }).catch(() => {});

      // 5-second glowing restoration sequence
      setTimeout(() => {
        updateTabTimestamp(tabId);
        chrome.tabs.sendMessage(tabId, { action: "updateState", state: "FRESH" }).catch(() => {});
      }, 5000);
    } else {
      updateTabTimestamp(tabId);
    }
  });
});

// Checks every 5 minutes to keep browser lightweight
setInterval(checkTabAges, 5 * 60 * 1000);
