document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('popup-input');
    const outputEl = document.getElementById('popup-output');
    const encodeBtn = document.getElementById('popup-encode-btn');

    // The encodeBase64 function is available on the window object
    // because it was loaded by the crypto-utils/index.js script.
    const { encodeBase64 } = window.cryptoUtils;

    encodeBtn.addEventListener('click', () => {
        try {
            const inputText = inputEl.value;
            if (inputText.trim() === '') {
                outputEl.textContent = 'Input is empty.';
                return;
            }
            outputEl.textContent = encodeBase64(inputText);
        } catch (error) {
            outputEl.textContent = 'Error encoding text.';
            console.error('Popup Encoding Error:', error);
        }
    });

    const readFileBtn = document.getElementById('read-file-btn');
    readFileBtn.addEventListener('click', async () => {
        try {
            if (!window.showOpenFilePicker) {
                alert('File System Access API is not supported in this browser.');
                return;
            }

            const [fileHandle] = await window.showOpenFilePicker();
            const file = await fileHandle.getFile();
            const contents = await file.text();

            // Get the absolute URL to the workspace app
            const workspaceUrl = chrome.runtime.getURL('apps/workspace/index.html');

            // Encode the content to make it URL-safe
            const encodedContent = encodeBase64(contents);

            // Create the URL with query parameters
            const urlWithParams = new URL(workspaceUrl);
            urlWithParams.searchParams.set('assetName', file.name);
            urlWithParams.searchParams.set('assetContent', encodedContent);
            urlWithParams.searchParams.set('assetType', 'Local File');

            // Open the workspace in a new tab with the asset data
            chrome.tabs.create({ url: urlWithParams.href });

        } catch (error) {
            console.error('Error reading file:', error);
            if (error.name !== 'AbortError') {
                alert('An error occurred while reading the file.');
            }
        }
    });
});
