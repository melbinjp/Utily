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
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
