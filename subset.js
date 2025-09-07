const { fontawesomeSubset } = require('fontawesome-subset');
const fs = require('fs');
const path = require('path');

const outputDir = path.join('dist', 'webfonts');
fs.mkdirSync(outputDir, { recursive: true });

fontawesomeSubset(
  {
    solid: [
      'brain',
      'moon',
      'chevron-left',
      'chevron-right',
      'sun',
      'rocket',
      'arrow-right',
      'external-link-alt',
      'comments',
      'microphone',
      'cube',
      'closed-captioning',
      'video',
      'image',
      'desktop',
      'code-branch',
      'star',
      'exclamation-triangle',
    ],
    brands: ['youtube'],
  },
  outputDir,
  {
    targetFormats: ['woff2'],
  }
);
