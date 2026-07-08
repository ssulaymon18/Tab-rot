// Map states to custom emojis mirroring the 'old paper left in the sun' aesthetic
const STATE_EMOJIS = {
  FRESH: "🌱",       // Just opened
  ONE_DAY: "📄",     // 1 Day (Fading)
  THREE_DAYS: "📜",  // 3 Days (Grainy/Scroll)
  ONE_WEEK: "🗺️",    // 1 Week (Cracked / Ancient Map)
  TWO_WEEKS: "🪵",   // 2 Weeks (Deeply decayed)
  MONTH_PLUS: "🪦",  // 1 Month+ (Ancient history)
  RECOVER: "✨"      // Click to restore sparkling visual
};

function changeFavicon(emoji) {
  const canvas = document.createElement('canvas');
  canvas.height = 64;
  canvas.width = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = '54px serif';
  ctx.fillText(emoji, 0, 54);
  const dataUrl = canvas.toDataURL();

  let links = document.querySelectorAll("link[rel*='icon']");
  if (links.length === 0) {
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    document.head.appendChild(newLink);
    links = [newLink];
  }

  links.forEach(link => {
    link.href = dataUrl;
  });
}

// Receive state update requests from background worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateState") {
    if (request.state === "RECOVER") {
      let toggle = true;
      const interval = setInterval(() => {
        changeFavicon(toggle ? STATE_EMOJIS.RECOVER : STATE_EMOJIS.FRESH);
        toggle = !toggle;
      }, 400);

      setTimeout(() => {
        clearInterval(interval);
        changeFavicon(STATE_EMOJIS.FRESH);
      }, 5000);
    } else {
      changeFavicon(STATE_EMOJIS[request.state]);
    }
  }
});