import js from '@eslint/js'
import globals from 'globals'

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            'no-unused-vars': 'off', // Чтобы не ругался на неиспользуемые переменные
            'no-undef': 'off', // Чтобы не ругался на document
        },
    },
]
