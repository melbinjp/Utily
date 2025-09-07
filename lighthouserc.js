module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8080/index.html'],
      numberOfRuns: 3,
      staticDistDir: './dist',
      settings: {
        chromeFlags: '--no-sandbox',
      },
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': [
          'error',
          { minScore: 0.85, aggregationMethod: 'median-run' },
        ],
        'categories:accessibility': [
          'error',
          { minScore: 0.9, aggregationMethod: 'median-run' },
        ],
        'categories:best-practices': [
          'error',
          { minScore: 0.85, aggregationMethod: 'median-run' },
        ],
        'categories:seo': [
          'error',
          { minScore: 0.9, aggregationMethod: 'median-run' },
        ],
        'critical-request-chains': 'off',
        'unused-javascript': 'off',
        'errors-in-console': ['error', { minScore: 0 }],
        'heading-order': ['error', { minScore: 0 }],
        'label-content-name-mismatch': ['error', { minScore: 0 }],
        'network-dependency-tree-insight': ['error', { minScore: 0 }],
        'target-size': ['error', { minScore: 0 }],
        'uses-rel-preconnect': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
