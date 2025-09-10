import { AIToolsPortal } from './AIToolsPortal.js';

// Load the main stylesheet asynchronously
const loadCSS = () => {
  const stylesheet = document.getElementById('main-stylesheet');
  if (stylesheet) {
    stylesheet.media = 'all';
  }
};

// Use requestIdleCallback for non-critical initialization
const startApp = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      new AIToolsPortal();
    });
  } else {
    setTimeout(() => {
      new AIToolsPortal();
    }, 1);
  }
};

// Use passive event listeners where possible
document.addEventListener(
  'DOMContentLoaded',
  () => {
    loadCSS();
    startApp();
  },
  { passive: true }
);

// Konami code to reveal GitHub repos
const konamiCode = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];
let konamiIndex = 0;

const fetchGitHubRepos = async () => {
  const username = 'melbinjp';
  const url = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`;
  const reposGrid = document.getElementById('github-repos-grid');
  const reposSection = document.getElementById('github-repos-section');

  if (!reposGrid || !reposSection) return;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }
    const repos = await response.json();

    reposGrid.innerHTML = ''; // Clear placeholder

    repos.slice(0, 6).forEach(repo => {
      const repoCard = document.createElement('div');
      repoCard.className = 'tool-card';
      repoCard.innerHTML = `
        <h3 class="tool-card-title">${repo.name}</h3>
        <p class="tool-card-description">${repo.description || 'No description available.'}</p>
        <div class="tool-card-footer">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="tool-card-link">View on GitHub</a>
          <div class="tool-card-stats">
            <span>⭐ ${repo.stargazers_count}</span>
            <span> Forks: ${repo.forks_count}</span>
          </div>
        </div>
      `;
      reposGrid.appendChild(repoCard);
    });

    reposSection.classList.remove('hidden');
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    reposGrid.innerHTML = '<p>Could not load GitHub repositories.</p>';
    reposSection.classList.remove('hidden');
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      fetchGitHubRepos();
    }
  } else {
    konamiIndex = 0;
  }
});
