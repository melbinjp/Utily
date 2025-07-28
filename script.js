document.addEventListener("DOMContentLoaded", () => {
    const settingsBtn = document.querySelector(".settings-btn");
    const modalOverlay = document.querySelector(".modal-overlay");
    const closeBtn = document.querySelector(".close-btn");
    const themeSwitcher = document.querySelector(".theme-switcher");
    const toolGrid = document.getElementById("tool-grid");
    const carouselInner = document.querySelector(".carousel-inner");
    const prevButton = document.querySelector(".carousel-control.prev");
    const nextButton = document.querySelector(".carousel-control.next");
    const indicatorsContainer = document.querySelector(".carousel-indicators");
    let currentIndex = 0;
    let autoplayInterval;

    settingsBtn.addEventListener("click", () => {
        modalOverlay.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
    });

    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove("active");
        }
    });

    fetch("tools.json")
        .then(response => response.json())
        .then(allTools => {
            const tools = allTools.filter(tool => tool.show);
            const featuredTools = tools.filter(tool => tool.featured);

            featuredTools.forEach((tool, index) => {
                const carouselItem = document.createElement("div");
                carouselItem.classList.add("carousel-item");
                if (tool.background_image) {
                    carouselItem.style.backgroundImage = `linear-gradient(to right, rgba(102, 126, 234, 0) 0%, rgba(118, 75, 162, 0.8) 50%, rgba(102, 126, 234, 0) 100%), url(${tool.background_image})`;
                }
                carouselItem.innerHTML = `
                    <div class="featured-content">
                        <div class="featured-text">
                                 <h2>🚀 Featured Tool</h2>
                                <h3>${tool.title}</h3>
                                <p>${tool.featured_description || tool.description}</p>
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
                                    <div class="card-icon"><i class="fa ${tool.icon}" aria-hidden="true"></i></div>
                                    <div class="card-content">
                                        <h4>${tool.floating_card_title || ''}</h4>
                                        <p>${tool.floating_card_description || ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                carouselInner.appendChild(carouselItem);

                const indicator = document.createElement("div");
                indicator.classList.add("indicator");
                indicator.dataset.index = index;
                indicatorsContainer.appendChild(indicator);
            });

            const indicators = document.querySelectorAll(".indicator");

            function updateCarousel() {
                const width = carouselInner.clientWidth;
                carouselInner.style.transform = `translateX(${-width * currentIndex}px)`;
                document.querySelectorAll('.carousel-item').forEach((item, index) => {
                    item.classList.toggle('active', index === currentIndex);
                });
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle("active", index === currentIndex);
                });
            }

            function resetAutoplay() {
                clearInterval(autoplayInterval);
                autoplayInterval = setInterval(() => {
                    currentIndex = (currentIndex + 1) % featuredTools.length;
                    updateCarousel();
                }, 5000);
            }

            nextButton.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % featuredTools.length;
                updateCarousel();
                resetAutoplay();
            });

            prevButton.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + featuredTools.length) % featuredTools.length;
                updateCarousel();
                resetAutoplay();
            });

            indicators.forEach(indicator => {
                indicator.addEventListener("click", () => {
                    currentIndex = parseInt(indicator.dataset.index);
                    updateCarousel();
                    resetAutoplay();
                });
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

            updateCarousel();
            resetAutoplay();
        });

    function setTheme(theme) {
        if (theme === 'system') {
            localStorage.removeItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    themeSwitcher.addEventListener('click', (e) => {
        if (e.target.classList.contains('theme-btn')) {
            setTheme(e.target.dataset.theme);
        }
    });

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('system');
    }
});
