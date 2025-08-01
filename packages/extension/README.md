# WeCanUseAI Platform Connector Extension

This directory contains the source code for the WeCanUseAI browser extension.

## Purpose

The purpose of this extension is to act as a bridge between the WeCanUseAI web platform and the user's local system. This will enable features such as:

- Accessing local files for use in web-based tools.
- Allowing web-based tools to interact with the local operating system.
- Providing a seamless workflow between the cloud and the local machine.

## Development

### Loading the Extension in Your Browser

To load this extension for development, follow these steps:

**For Google Chrome:**

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable "Developer mode" using the toggle in the top-right corner.
3.  Click the "Load unpacked" button.
4.  Select the `packages/extension` directory from this repository.

**For Mozilla Firefox:**

1.  Open Firefox and navigate to `about:debugging`.
2.  Click "This Firefox" in the sidebar.
3.  Click the "Load Temporary Add-on..." button.
4.  Select the `manifest.json` file inside the `packages/extension` directory.

The extension should now be installed and ready for development. Any changes you make to the files will require you to reload the extension from the same browser page.
