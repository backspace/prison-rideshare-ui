'use strict';

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  overrides: [
    {
      files: ['**/*.scss'],
      extends: ['stylelint-config-standard-scss'],
    },
  ],
  rules: {
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        // I don’t work with this enough to mentally parse the shorthand
        ignoreShorthands: ['/grid/'],
      },
    ],
    // From @a-tokyo https://github.com/humanmade/coding-standards/issues/193#issuecomment-1405099508
    /** selector class pattern must match [BEM CSS](https://en.bem.info/methodology/css) - [Regex](https://regexr.com/3apms) */
    'selector-class-pattern': [
      '^[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$',
      {
        /** This option will resolve nested selectors with & interpolation. - https://stylelint.io/user-guide/rules/selector-class-pattern/#resolvenestedselectors-true--false-default-false */
        resolveNestedSelectors: true,
        /** Custom message */
        message: function expected(selectorValue) {
          return `Expected class selector "${selectorValue}" to match BEM CSS pattern https://en.bem.info/methodology/css. Selector validation tool: https://regexr.com/3apms`;
        },
      },
    ],
  },
};
