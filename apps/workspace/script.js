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
            // Show a snippet of the content
            title.textContent = asset.content.substring(0, 20) + '...';

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

    // Initial render
    renderAssets();

    // Listen for changes in local storage from other tabs/windows
    window.addEventListener('storage', (event) => {
        if (event.key === 'wecanuseai-assets') {
            renderAssets();
        }
    });
});
