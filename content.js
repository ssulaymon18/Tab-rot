const STATE_EMOJIS = {
  FRESH: "🌱",
  INFECTION: "🍂",
  DECAY: "🍁",
  ROTTEN: "🍄",
  RECOVER: "✨"
};

function changeFavicon(emoji) {
  // Create a data URL from an emoji using a canvas element
  const canvas = document.createElement('canvas');
  canvas.height = 64;
  canvas.width = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = '54px serif';
  ctx.fillText(emoji, 0, 54);
  const dataUrl = canvas.toDataURL();

  // Find or create favicon link tags in the webpage
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

// Listen for updates from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateState") {
    if (request.state === "RECOVER") {
      // Flash animation for the recovery state
      let toggle = true;
      const interval = setInterval(() => {
        changeFavicon(toggle ? STATE_EMOJIS.RECOVER : STATE_EMOJIS.FRESH);
        toggle = !toggle;
      }, 500);

      // Stop the animation after 5 seconds
      setTimeout(() => {
        clearInterval(interval);
        changeFavicon(STATE_EMOJIS.FRESH);
      }, 5000);
    } else {
      changeFavicon(STATE_EMOJIS[request.state]);
    }
  }
});