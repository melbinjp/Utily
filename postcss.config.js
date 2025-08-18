module.exports = {
  plugins: [
    require('postcss-import'),
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
    require('@fullhuman/postcss-purgecss')({
      content: ['./index.html', './js/**/*.js'],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
