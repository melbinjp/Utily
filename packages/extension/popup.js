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
});
