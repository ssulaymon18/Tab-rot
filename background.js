const fresh = 1000;
const oneDay = 24 * 60 * 60 * 1000;
const threeDays = 3 * oneDay;
const oneWeek = 7 * oneDay;
const twoWeeks = 14 * oneDay;
const oneMonth = 30 * oneDay;

function updateTabTimestamp(tabId) {
  chrome.storage.local.get(['tabData'], (res) => {
    let data = res.tabData || {};
    data[tabId] = { lastUsed: Date.now(), state: 'Fresh' };
    chrome.storage.local.set({ tabData: data });
  });
}

function getTimeState(elapsedTime) {
  switch (true) {
    case elapsedTime >= oneMonth:  return 'oneMonth';
    case elapsedTime >= twoWeeks:   return 'twoWeeks';
    case elapsedTime >= oneWeek:    return 'oneWeek';
    case elapsedTime >= threeDays:  return 'threeDays';
    case elapsedTime >= oneDay:     return 'oneDay';
    default:                        return 'fresh';
  }
}


function checkTabAges() {
  chrome.tabs.query({}, (tabs) => {
    chrome.storage.local.get(['tabData'], (res) => {
      let data = res.tabData || {};
      const now = Date.now();

      for (let tab of tabs) {
        if (!tab.id || !tab.url || tab.url.startsWith('chrome')) {
          continue;
        }

        if (tab.active) {
          updateTabTimestamp(tab.id);
          continue;
        }

        let info = data[tab.id] || { lastUsed: now, state: 'fresh' };
        let elapsed = now - info.lastUsed;
        let newState = getTimeState(elapsed);

        if (info.state !== newState) {
          info.state = newState;
          data[tab.id] = info;
          chrome.tabs.sendMessage(tab.id, { action: 'updateState', state: newState });
        }
      }

      chrome.storage.local.set({ tabData: data });
    });
  });
}

chrome.tabs.onActivated.addListener((info) => {
  updateTabTimestamp(info.tabId);
});

setInterval(checkTabAges, 15 * 60 * 1000);