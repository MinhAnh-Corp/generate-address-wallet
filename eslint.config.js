import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'vite.config.ts']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactRefresh.configs.vite,
  {
    files: ['vite.config.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Code style and formatting rules
      'no-multi-spaces': ['error', {
        ignoreEOLComments: false,
        exceptions: {
          Property: false,
          VariableDeclarator: false,
          ImportDeclaration: false,
        },
      }],
      'no-trailing-spaces': ['error', {
        ignoreComments: false,
        skipBlankLines: false,
      }],
      'eol-last': ['error', 'always'],
      'quotes': ['error', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: true,
      }],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      }],
      'no-multiple-empty-lines': ['error', {
        max: 1,
        maxEOF: 0,
        maxBOF: 0,
      }],
      'padded-blocks': ['error', 'never'],
      'lines-between-class-members': ['error', 'always', {
        exceptAfterSingleLine: false,
      }],
      'max-len': ['error', {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true,
      }],
      'no-whitespace-before-property': 'error',
      'spaced-comment': ['error', 'always', {
        line: {
          markers: ['/'],
          exceptions: ['-', '+'],
        },
        block: {
          markers: ['!'],
          exceptions: ['*'],
          balanced: true,
        },
      }],

      // Spacing rules
      'object-curly-spacing': ['error', 'always'],
      'object-curly-newline': ['error', {
        ObjectExpression: {
          multiline: true,
          minProperties: 2,
          consistent: true,
        },
        ObjectPattern: {
          multiline: true,
          minProperties: 2,
          consistent: true,
        },
        ImportDeclaration: {
          multiline: true,
          minProperties: 3,
          consistent: true,
        },
        ExportDeclaration: {
          multiline: true,
          minProperties: 3,
          consistent: true,
        },
      }],
      'array-bracket-spacing': ['error', 'never'],
      'array-bracket-newline': ['error', {
        multiline: true,
        minItems: 3,
      }],
      'array-element-newline': ['error', {
        multiline: true,
        minItems: 3,
      }],
      'computed-property-spacing': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': ['error', {
        words: true,
        nonwords: false,
      }],
      'keyword-spacing': ['error', {
        before: true,
        after: true,
        overrides: {
          if: { after: true },
          for: { after: true },
          while: { after: true },
          switch: { after: true },
          catch: { after: true },
        },
      }],
      'comma-spacing': ['error', {
        before: false,
        after: true,
      }],
      'key-spacing': ['error', {
        beforeColon: false,
        afterColon: true,
        mode: 'strict',
      }],
      'semi-spacing': ['error', {
        before: false,
        after: true,
      }],
      'arrow-spacing': ['error', {
        before: true,
        after: true,
      }],
      'block-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs', {
        allowSingleLine: true,
      }],
      'func-call-spacing': ['error', 'never'],
      'function-paren-newline': ['error', 'multiline-arguments'],
      'indent': ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoredNodes: [
          'TemplateLiteral *',
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXFragment',
          'JSXOpeningFragment',
          'JSXClosingFragment',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild',
        ],
        offsetTernaryExpressions: true,
      }],

      // Import order rules
      'import/order': ['error', {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react-dom',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: 'src/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '../**',
            group: 'parent',
            position: 'before',
          },
          {
            pattern: './**',
            group: 'sibling',
            position: 'after',
          },
          {
            pattern: '*.css',
            group: 'index',
            position: 'after',
          },
          {
            pattern: '*.{css,scss,sass,less}',
            group: 'index',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-dom'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        warnOnUnassignedImports: false,
      }],
      'import/newline-after-import': ['error', {
        count: 1,
      }],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.app.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },
])
