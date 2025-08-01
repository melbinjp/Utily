// background.js

// This script runs in the background of the extension.
// It can listen for browser events and manage the extension's state.

chrome.runtime.onInstalled.addListener(() => {
  console.log('WeCanUseAI Platform Connector installed.');
});
