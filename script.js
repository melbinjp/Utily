document.addEventListener("DOMContentLoaded", () => {
    const toolGrid = document.getElementById("tool-grid");
    const carouselInner = document.querySelector(".carousel-inner");
    const prevButton = document.querySelector(".carousel-control.prev");
    const nextButton = document.querySelector(".carousel-control.next");
    let currentIndex = 0;

    fetch("tools.json")
        .then(response => response.json())
        .then(tools => {
            const featuredTools = tools.filter(tool => tool.featured);

            featuredTools.forEach(tool => {
                const carouselItem = document.createElement("div");
                carouselItem.classList.add("carousel-item");
                carouselItem.innerHTML = `
                    <div id="featured-tool">
                        <div class="featured-content">
                            <div class="featured-text">
                                <h2>🚀 Featured Tool</h2>
                                <h3>${tool.title}</h3>
                                <p>${tool.long_description}</p>
                                <div class="featured-actions">
                                    <a href="${tool.url}" class="primary-btn" target="_blank">
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
                    </div>
                `;
                carouselInner.appendChild(carouselItem);
            });

            function updateCarousel() {
                const width = carouselInner.clientWidth;
                carouselInner.style.transform = `translateX(${-width * currentIndex}px)`;
            }

            nextButton.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % featuredTools.length;
                updateCarousel();
            });

            prevButton.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + featuredTools.length) % featuredTools.length;
                updateCarousel();
            });

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
