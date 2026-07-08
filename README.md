
Tab Rot is my new project: Chrome extension that makes long‑ignored tabs visibly “rot” over time by changing their favicon. Tabs progress through several states (fresh → infected → decay → rotten → recover) based on how long they have been open and when you last used them.

This helps you notice and close stale tabs instead of letting them quietly pile up.

How it works
Every tab gets a timestamp when it is created or when its URL changes.

The background script periodically checks all tabs and computes a state from the elapsed time:

START: brand new tab.
FRESH: recently opened.
INFECTION: has been open for a while.
DECAY: has been idle a long time.
ROTTEN: very old tab.
When the state changes, the extension sends a message to the content script in that tab.

The content script replaces the page’s favicon with another icons that corresponds to the current state.

When you re‑activate a tab, it briefly enters a TS_RECOVER state where the icon animates through the frames before settling back into its normal state.

Default state thresholds
Fresh: 2 minutes
Infection: 30 minutes
Decay: 3 hours
Rotten: 1 day
Recover animation: 5 seconds
Features
Tabs visibly age the longer they stay inactive, moving through multiple states
Each tab’s current decay stage is stored and restored across browser restarts using local storage.
When you revisit an aged tab, a restoration animation plays to make the recovery easy to notice.
Users can customize when decay begins with a configurable inactivity threshold (for example: after 1 hour, 1 day, or 1 week).
The extension does not alter how pages load, run scripts, or behave.
Getting it running
Tab Rot is not published in a web store yet, so you need to load it manually:

Open chrome://extensions (or brave://extensions in Brave).
Enable Developer mode.
Click Load unpacked and select the Tab-Vibe folder.
Any Chromium-based browser (Chrome, Brave, Edge, etc.) will load the extension using this method.
