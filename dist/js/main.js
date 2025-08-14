import { AIToolsPortal } from './AIToolsPortal.js';

function addKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .error-message {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex; align-items: center; justify-content: center;
            z-index: 2000; color: white; text-align: center;
        }
        .error-content {
            background: #dc3545; padding: 2rem; border-radius: 1rem; max-width: 400px;
        }
        .error-content i { font-size: 3rem; margin-bottom: 1rem; }
        .error-content button {
            background: white; color: #dc3545; border: none;
            padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer;
            margin-top: 1rem; font-weight: 600;
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
    addKeyframes();
    new AIToolsPortal();
});
