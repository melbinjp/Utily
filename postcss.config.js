module.exports = {
  plugins: [
    require('postcss-import'),
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
