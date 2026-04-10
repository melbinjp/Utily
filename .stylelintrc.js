module.exports = {
  extends: ['stylelint-config-standard'],
  // Add any custom rules here
  rules: {
    'no-descending-specificity': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],
    'rule-empty-line-before': null,
  },
};
