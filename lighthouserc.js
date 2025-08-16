module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8080/index.html'],
      numberOfRuns: 3,
      staticDistDir: './dist',
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.80, aggregationMethod: 'median-run' }],
        'categories:accessibility': ['warn', { minScore: 0.80, aggregationMethod: 'median-run' }],
        'categories:best-practices': ['warn', { minScore: 0.70, aggregationMethod: 'median-run' }],
        'categories:seo': ['warn', { minScore: 0.70, aggregationMethod: 'median-run' }],
        'critical-request-chains': 'off',
        'unused-javascript': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
