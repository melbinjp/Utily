module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier', // Must be last to override other configs
  ],
  // Add any custom rules here
  rules: {
    'no-descending-specificity': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],
  },
};
