let tabActivity = {};

// 1. Listen for when a user switches tabs
chrome.tabs.onActivated.addListener((activeInfo) => {
    const tabId = activeInfo.tabId;
    tabActivity[tabId] = Date.now();
    chrome.storage.local.set({ tabActivity: tabActivity });
});

// 2. Listen for when a tab completely finishes loading a page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        tabActivity[tabId] = Date.now();
        chrome.storage.local.set({ tabActivity: tabActivity });
    }
});