module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
    require('@fullhuman/postcss-purgecss')({
      content: [
        './index.html',
        './script.js'
      ],
      defaultExtractor: content => content.match(/[\w-./:]+(?<!:)/g) || []
    })
  ]
};
