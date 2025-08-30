const { fontawesomeSubset } = require('fontawesome-subset');
const fs = require('fs');

const outputDir = 'dist/webfonts';
fs.mkdirSync(outputDir, { recursive: true });

fontawesomeSubset(
  {
    solid: ['brain', 'moon', 'chevron-left', 'chevron-right'],
  },
  outputDir,
  {
    targetFormats: ['woff2'],
  }
);
