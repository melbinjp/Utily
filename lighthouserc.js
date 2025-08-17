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
          'warn',
          { minScore: 0.8, aggregationMethod: 'median-run' },
        ],
        'categories:accessibility': [
          'warn',
          { minScore: 0.8, aggregationMethod: 'median-run' },
        ],
        'categories:best-practices': [
          'warn',
          { minScore: 0.7, aggregationMethod: 'median-run' },
        ],
        'categories:seo': [
          'warn',
          { minScore: 0.7, aggregationMethod: 'median-run' },
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
