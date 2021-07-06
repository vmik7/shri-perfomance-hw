module.exports = {
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    extends: ['airbnb', 'plugin:jsx-a11y/recommended', 'eslint:recommended'],
    plugins: ['import', 'prettier', 'jsx-a11y'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    rules: {
        'no-restricted-syntax': 'off',
        'no-await-in-loop': 'off',

        // Предупреждение no-unused-vars вместо ошибки
        'no-unused-vars': 'warn',

        // Отступ 4
        indent: ['error', 4],

        // Не предлагает константы при деструктуризации
        'prefer-const': [
            'error',
            {
                destructuring: 'all',
            },
        ],

        // Неправильно работает в Windows.
        'linebreak-style': 'off',

        // Несовместимо с prettier
        'arrow-parens': 'off',

        // Несовместимо с prettier
        'object-curly-newline': 'off',

        // Несовместимо с prettier
        'no-mixed-operators': 'off',

        // Это - не наш стиль?
        'arrow-body-style': 'off',

        // Несовместимо с prettier
        'function-paren-newline': 'off',
        'no-plusplus': 'off',

        // Несовместимо с prettier
        'space-before-function-paren': 0,

        // airbnb позволяет некоторые пограничные случаи
        'max-len': ['error', 100, 2, { ignoreUrls: true }],

        // Это - не наш стиль?
        'no-param-reassign': 'off',

        // parseInt, parseFloat и radix выключены. Мне это не нравится.
        radix: 'off',

        // airbnb использует уведомление об ошибке
        'react/require-default-props': 'off',

        // airbnb использует уведомление об ошибке
        'react/forbid-prop-types': 'off',

        // airbnb использует .jsx
        'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],

        'prefer-destructuring': 'off',

        'react/no-find-dom-node': 'off',
        'react/no-did-mount-set-state': 'off',
        'react/no-unused-prop-types': 'off',
        'react/jsx-one-expression-per-line': 'off',

        'jsx-a11y/anchor-is-valid': [
            'error',
            { components: ['Link'], specialLink: ['to'] },
        ],

        // для ошибки вложенных свойств htmlFor элементов label
        'jsx-a11y/label-has-for': [
            2,
            {
                required: {
                    every: ['id'],
                },
            },
        ],

        'prettier/prettier': ['error'],
    },
};
