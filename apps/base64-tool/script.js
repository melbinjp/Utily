document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('input');
    const outputEl = document.getElementById('output');
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');

    // Encode function
    encodeBtn.addEventListener('click', () => {
        try {
            const inputText = inputEl.value;
            if (inputText.trim() === '') {
                outputEl.value = 'Input is empty.';
                return;
            }
            // btoa() can throw an error for non-latin characters
            const encodedText = btoa(unescape(encodeURIComponent(inputText)));
            outputEl.value = encodedText;
        } catch (error) {
            outputEl.value = 'Error encoding text. Make sure the input is valid.';
            console.error('Encoding Error:', error);
        }
    });

    // Decode function
    decodeBtn.addEventListener('click', () => {
        try {
            const inputText = inputEl.value;
            if (inputText.trim() === '') {
                outputEl.value = 'Input is empty.';
                return;
            }
            const decodedText = decodeURIComponent(escape(atob(inputText)));
            outputEl.value = decodedText;
        } catch (error) {
            outputEl.value = 'Error decoding text. Make sure the input is a valid Base64 string.';
            console.error('Decoding Error:', error);
        }
    });

    // Copy to clipboard function
    copyBtn.addEventListener('click', () => {
        if (outputEl.value.trim() === '' || outputEl.value.startsWith('Error')) {
            return; // Don't copy empty or error messages
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

    // Clear function
    clearBtn.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
    });
});
