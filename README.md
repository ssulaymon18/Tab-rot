Tab Rot 🪦🌱


The Chrome extension I created as my brain’s response to my browser becoming a grave-yard with 90+ tabs open but untouched for weeks.


Rather than just removing these tabs, Tab Rot adds a sense of rot to these unused tabs by updating their icons to reflect their level of decay.


How it works

Each time a tab is opened or its url updated, the tab gets a time stamp. A background script calculates the age of a tab and updates its favicon to match the stage of its decay:


🌱 Fresh: recently opened tab

📄 1 Day: beginning to decay

📜 3 Days: starting to get some dust

🗺️ 1 Week: ancient map status

🪵 2 Weeks: rotting wood

🪦 1 Month+: deceased, tombstone


What’s best about this: when you click an extremely old tab back into activity, it briefly animates (✨ → 🌱) to become fresh again.


How to run it locally

Being a Chrome Webstore project-in-progress, there is no way to download it from there, which means you need to manually install it:

 Download or clone this folder.
 Open chrome://extensions/ in your browser.
 Turn Developer mode on in the top right corner.
 Click “Load unpacked” in the top left corner and select this folder.
