document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('input');
    const outputEl = document.getElementById('output');
    const encodeBtn = document.getElementById('encode-btn');
    const decodeBtn = document.getElementById('decode-btn');
    const copyBtn = document.getElementById('copy-btn');
    const saveAssetBtn = document.getElementById('save-asset-btn');
    const clearBtn = document.getElementById('clear-btn');

    const { encodeBase64, decodeBase64 } = window.cryptoUtils;

    const getAssets = () => {
        return JSON.parse(localStorage.getItem('wecanuseai-assets') || '[]');
    };

    const saveAssets = (assets) => {
        localStorage.setItem('wecanuseai-assets', JSON.stringify(assets));
    };

    encodeBtn.addEventListener('click', () => {
        try {
            const inputText = inputEl.value;
            if (inputText.trim() === '') {
                outputEl.value = 'Input is empty.';
                return;
            }
            outputEl.value = encodeBase64(inputText);
        } catch (error) {
            outputEl.value = 'Error encoding text.';
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
            outputEl.value = 'Error decoding text.';
            console.error('Decoding Error:', error);
        }
    });

    saveAssetBtn.addEventListener('click', () => {
        const outputText = outputEl.value;
        if (outputText.trim() === '' || outputText.startsWith('Error')) {
            alert('Cannot save an empty or error output as an asset.');
            return;
        }

        const assets = getAssets();
        const newAsset = {
            id: `asset-${Date.now()}`,
            type: 'Base64 Text',
            content: outputText,
            createdAt: new Date().toISOString()
        };
        assets.push(newAsset);
        saveAssets(assets);

        const originalText = saveAssetBtn.innerText;
        saveAssetBtn.innerText = 'Saved!';
        setTimeout(() => {
            saveAssetBtn.innerText = originalText;
        }, 1500);
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
