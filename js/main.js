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

// Konami code easter egg — shows a random lighthearted quote
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

const quotes = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: 'Thomas Edison' },
  { text: "It always seems impossible until it's done.", author: 'Nelson Mandela' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: "You miss 100% of the shots you don't take.", author: '— Wayne Gretzky  — Michael Scott' },
  { text: "Life is what happens when you're busy making other plans.", author: 'John Lennon' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'Do one thing every day that scares you.', author: 'Eleanor Roosevelt' },
  { text: "Whether you think you can, or you think you can't — you're right.", author: 'Henry Ford' },
];

const showRandomQuote = () => {
  const modal = document.getElementById('quote-modal');
  const textEl = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  if (!modal || !textEl || !authorEl) return;

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  textEl.textContent = `"${quote.text}"`;
  authorEl.textContent = `— ${quote.author}`;
  modal.classList.remove('hidden');
  modal.focus();
};

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      showRandomQuote();
    }
  } else {
    konamiIndex = 0;
  }
});

document.addEventListener('click', (e) => {
  const modal = document.getElementById('quote-modal');
  if (!modal) return;
  if (e.target.id === 'quote-close' || e.target.id === 'quote-modal') {
    modal.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('quote-modal');
    modal?.classList.add('hidden');
  }
});
