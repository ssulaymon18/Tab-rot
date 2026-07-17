const fresh = "🌱";
const oneDay = "📜";
const threeDays = "⏳";
const oneWeek = "🗺️";
const twoWeeks = "🦣";
const oneMonth = "🏺";
const recover = "✨";

function changeFavicon(emoji) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = '54px sans-serif';
  ctx.fillText(emoji, 0, 54);

  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }

  link.href = canvas.toDataURL();
  console.log("Favicon updated to:", emoji); 
}

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  if (req.action === "updateState") {
    
    if (req.state === "recover") {
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
      
      switch (req.state) {
        case 'oneDay':
          selectedEmoji = oneDay;
          break;
        case 'threeDays':
          selectedEmoji = threeDays;
          break;
        case 'oneWeek':
          selectedEmoji = oneWeek;
          break;
        case 'twoWeeks':
          selectedEmoji = twoWeeks;
          break;
        case 'oneMonth':
          selectedEmoji = oneMonth;
          break;
        default:
          selectedEmoji = fresh;
      }
      
      changeFavicon(selectedEmoji);
    }
  }
});