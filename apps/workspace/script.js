document.addEventListener('DOMContentLoaded', () => {
    const assetGrid = document.getElementById('asset-grid');

    const getAssets = () => {
        return JSON.parse(localStorage.getItem('wecanuseai-assets') || '[]');
    };

    const renderAssets = () => {
        const assets = getAssets();
        assetGrid.innerHTML = ''; // Clear existing assets

        if (assets.length === 0) {
            assetGrid.innerHTML = '<p>No assets yet. Go create some with a tool!</p>';
            return;
        }

        assets.forEach(asset => {
            const card = document.createElement('div');
            card.className = 'asset-card';
            card.dataset.id = asset.id;

            const thumbnail = document.createElement('div');
            thumbnail.className = 'asset-thumbnail';
            // In a real app, this might show a preview. For text, we'll show the type.
            thumbnail.textContent = asset.type;

            const title = document.createElement('div');
            title.className = 'asset-title';
            // Show the asset name if it exists, otherwise show a snippet
            title.textContent = asset.name || asset.content.substring(0, 20) + '...';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.onclick = () => deleteAsset(asset.id);

            card.appendChild(deleteBtn);
            card.appendChild(thumbnail);
            card.appendChild(title);
            assetGrid.appendChild(card);
        });
    };

    const deleteAsset = (assetId) => {
        let assets = getAssets();
        assets = assets.filter(asset => asset.id !== assetId);
        localStorage.setItem('wecanuseai-assets', JSON.stringify(assets)); // Use a consistent key
        renderAssets();
    };

    const handleIncomingAsset = () => {
        const params = new URLSearchParams(window.location.search);
        const assetName = params.get('assetName');
        const assetContentEncoded = params.get('assetContent');
        const assetType = params.get('assetType');

        if (assetName && assetContentEncoded && assetType) {
            const assets = getAssets();
            const newAsset = {
                id: `asset-${Date.now()}`,
                type: assetType,
                // The content is Base64 encoded, so we need to decode it.
                // We need access to the decodeBase64 function here.
                // For now, let's assume it's available on `window.cryptoUtils`
                content: window.cryptoUtils.decodeBase64(assetContentEncoded),
                createdAt: new Date().toISOString(),
                name: assetName // Add the file name
            };
            assets.push(newAsset);
            localStorage.setItem('wecanuseai-assets', JSON.stringify(assets));

            // Clean the URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    };

    // Initial render
    handleIncomingAsset();
    renderAssets();

    // Listen for changes in local storage from other tabs/windows
    window.addEventListener('storage', (event) => {
        if (event.key === 'wecanuseai-assets') {
            renderAssets();
        }
    });
});
