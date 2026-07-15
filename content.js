// Quick state config
const fresh = "🌱";
const oneday = "📜";
const threedays = "⏳";
const oneweek = "🗺️";
const twoweeks = "🦣";
const onemonthplus = "🏺";
const recover = "✨";

function changeFavicon(emoji) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = '54px sans-serif';
  ctx.fillText(emoji, 0, 54);

  // Grab the icon
  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }

  link.href = canvas.toDataURL();
  console.log("Favicon updated to:", emoji); // Adds a "business footprint/log" signature
}

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  // Let's use an old-school switch inside a classic function statement
  if (req.action === "updateState") {
    
    if (req.state === "RECOVER") {
      let active = true;
      const loop = setInterval(() => {
        changeFavicon(active ? recover : fresh);
        active = !active;
      }, 420);

      setTimeout(() => {
        clearInterval(loop);
        changeFavicon(fresh);
      }, 4850);
    } else {
      let selectedEmoji = fresh;
      
      // Traditional switch statement breaks the "inline conditional" signature
      switch (req.state) {
        case 'ONE_DAY':
          selectedEmoji = oneday;
          break;
        case 'THREE_DAYS':
          selectedEmoji = threedays;
          break;
        case 'ONE_WEEK':
          selectedEmoji = oneweek;
          break;
        case 'TWO_WEEKS':
          selectedEmoji = twoweeks;
          break;
        case 'MONTH_PLUS':
          selectedEmoji = onemonthplus;
          break;
        default:
          selectedEmoji = fresh;
      }
      
      changeFavicon(selectedEmoji);
    }
  }
});