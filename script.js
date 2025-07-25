document.addEventListener("DOMContentLoaded", () => {
    const toolGrid = document.getElementById("tool-grid");
    const featuredTool = document.getElementById("featured-tool");

    fetch("tools.json")
        .then(response => response.json())
        .then(tools => {
            const featured = tools.find(tool => tool.featured);
            if (featured) {
                featuredTool.innerHTML = `
                    <div class="featured-content">
                        <div class="featured-text">
                            <h2>🚀 Featured Tool</h2>
                            <h3>${featured.title}</h3>
                            <p>${featured.long_description}</p>
                            <div class="featured-actions">
                                <a href="${featured.url}" class="primary-btn" target="_blank">
                                    <span>Try it now</span>
                                    <i class="fa fa-arrow-right"></i>
                                </a>
                                <a href="#tools" class="secondary-btn">Explore all tools</a>
                            </div>
                        </div>
                        <div class="featured-visual">
                            <div class="floating-card">
                                <div class="card-icon">📄</div>
                                <div class="card-content">
                                    <h4>Smart Document Q&A</h4>
                                    <p>Ask questions, get instant answers from your documents</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            tools.forEach(tool => {
                const toolCard = document.createElement("div");
                toolCard.classList.add("tool-card");

                toolCard.innerHTML = `
                    <h3><i class="fa ${tool.icon}" aria-hidden="true"></i> <a href="${tool.url}" target="_blank">${tool.title}</a></h3>
                    <p>${tool.description}</p>
                `;

                toolGrid.appendChild(toolCard);
            });
        });
});
