document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('input');
    const outputEl = document.getElementById('output');
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');

    // The encodeBase64 and decodeBase64 functions are available on the window object
    // because they were loaded by the crypto-utils/index.js script.
    const { encodeBase64, decodeBase64 } = window.cryptoUtils;

    encodeBtn.addEventListener('click', () => {
        try {
            const inputText = inputEl.value;
            if (inputText.trim() === '') {
                outputEl.value = 'Input is empty.';
                return;
            }
            outputEl.value = encodeBase64(inputText);
        } catch (error) {
            outputEl.value = 'Error encoding text. Make sure the input is valid.';
            console.error('Encoding Error:', error);
        }
    });

    decodeBtn.addEventListener('click', () => {
        try {
            const inputText = inputEl.value;
            if (inputText.trim() === '') {
                outputEl.value = 'Input is empty.';
                return;
            }
            outputEl.value = decodeBase64(inputText);
        } catch (error) {
            outputEl.value = 'Error decoding text. Make sure the input is a valid Base64 string.';
            console.error('Decoding Error:', error);
        }
    });

    copyBtn.addEventListener('click', () => {
        if (outputEl.value.trim() === '' || outputEl.value.startsWith('Error')) {
            return;
        }
        navigator.clipboard.writeText(outputEl.value).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied!';
            setTimeout(() => {
                copyBtn.innerText = originalText;
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });

    clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
    });
});
