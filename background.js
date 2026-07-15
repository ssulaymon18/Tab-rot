const fresh = 1000; //  1 seconf
const day = 24 * 60 * 60 *1000;
const threedays = 3 * day; 
const oneweek = 7 * day;
const twoweeks = 14 * day;
const onemonthplus = 30 * day;

function updateTabTimestamp(tabId) {
  chrome.storage.local.get(['tabData'], (res) => {
    let data = res.tabData || {};
    data[tabId] = { lastUsed: Date.now(), state: 'Fresh' };
    chrome.storage.local.set({ tabData: data });
  });
}

function getState(elapsed) {
  if (elapsed >= onemonthplus) return 'MONTH_PLUS';
  if (elapsed >= twoweeks) return 'TWO_WEEKS';
  if (elapsed >= oneweek) return 'ONE_WEEK';
  if (elapsed >= threedays) return 'THREE_DAYS';
  if (elapsed >= day) return 'ONE_DAY';
  return 'Fresh';
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

        let info = data[tab.id] || { lastUsed: now, state: 'Fresh' };
        let elapsed = now - info.lastUsed;
        let newState = getState(elapsed);

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