document.addEventListener('DOMContentLoaded', () => {
    const assetGrid = document.getElementById('asset-grid');

    const getAssets = () => {
        return JSON.parse(localStorage.getItem('wecanuseai-assets') || '[]');
    };

    let availableTools = [];

    const fetchTools = async () => {
        try {
            // Adjust the path to be relative to the workspace app's location
            const response = await fetch('../portal/tools.json');
            if (!response.ok) {
                throw new Error('Failed to fetch tools.json');
            }
            availableTools = await response.json();
        } catch (error) {
            console.error(error);
            // Handle error, maybe show a message to the user
        }
    };

    const renderAssets = async () => {
        await fetchTools(); // Ensure tools are loaded before rendering assets
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

            const cardFooter = document.createElement('div');
            cardFooter.className = 'asset-card-footer';

            const openWithBtn = document.createElement('button');
            openWithBtn.className = 'open-with-btn';
            openWithBtn.textContent = 'Open With...';

            const toolListDropdown = document.createElement('div');
            toolListDropdown.className = 'tool-list-dropdown';
            toolListDropdown.style.display = 'none'; // Hidden by default

            availableTools.forEach(tool => {
                if (tool.show) { // Only show tools that are meant to be visible
                    const toolButton = document.createElement('button');
                    toolButton.className = 'tool-list-item';
                    toolButton.textContent = tool.title;
                    toolButton.onclick = () => {
                        // Encode the asset content to be URL-safe
                        const encodedContent = window.cryptoUtils.encodeBase64(asset.content);
                        const toolUrl = new URL(tool.url, window.location.origin);
                        toolUrl.searchParams.set('data', encodedContent);
                        window.open(toolUrl, '_blank');
                    };
                    toolListDropdown.appendChild(toolButton);
                }
            });

            openWithBtn.onclick = () => {
                toolListDropdown.style.display = toolListDropdown.style.display === 'none' ? 'block' : 'none';
            };

            cardFooter.appendChild(openWithBtn);
            cardFooter.appendChild(toolListDropdown);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.onclick = () => deleteAsset(asset.id);

            card.appendChild(deleteBtn);
            card.appendChild(thumbnail);
            card.appendChild(title);
            card.appendChild(cardFooter); // Append the footer to the card
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
