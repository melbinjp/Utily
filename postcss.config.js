module.exports = {
  plugins: [
    require('postcss-import'),
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
    require('@fullhuman/postcss-purgecss')({
      content: [
        './index.html',
        './js/**/*.js',
        './components/**/*.html',
        './privacy.html',
        './terms.html',
        './contact.html'
      ],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: [
        'dark',
        'theme-dark',
        'theme-light',
        'active',
        'open',
        'hidden',
        /^fa-/,
        /^carousel-/
      ]
    }),
    require('cssnano')({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true,
        minifyGradients: true,
        mergeLonghand: true,
        mergeRules: true,
        minifySelectors: true,
        normalizeUrl: true,
        discardUnused: true,
        discardDuplicates: true,
        reduceIdents: false,
        zindex: false
      }]
    }),
  ],
};
