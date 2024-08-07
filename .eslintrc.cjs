// Definitiv nicht die BARAL ESLint Konfiguration

// Export nach .eslintrc
module.exports = {

    // Environments stellen vordefinierte globale Variablen bereit
    // https://eslint.org/docs/latest/user-guide/configuring/language-options#specifying-environments
    env: {
        browser: true, // Browser Variablen: document, window, etc.
        es2021: true, // ECMA-Script 2021
    },

    // Globale Variablen, die überschrieben oder nur gelesen werden dürfen
    // https://eslint.org/docs/latest/user-guide/configuring/language-options#specifying-globals
    globals: {
        Atomics: 'readonly', // TODO: Notwendig?
        SharedArrayBuffer: 'readonly', // TODO: Notwendig?
    },

    // Erweiterungen
    // https://eslint.org/docs/latest/user-guide/configuring/configuration-files#extending-configuration-files
    extends: [
        'airbnb', // Airbnb Styleguide. https://github.com/airbnb/javascript
        'airbnb-typescript', // Airbnb Typescript Styleguide. https://github.com/iamturns/eslint-config-airbnb-typescript
        'plugin:react-hooks/recommended', // Rules of Hooks. https://www.npmjs.com/package/eslint-plugin-react-hooks
    ],

    // Parser
    // Parser Repository: https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/parser
    // ESLint: https://eslint.org/docs/latest/user-guide/configuring/plugins#specifying-parser
    parser: '@typescript-eslint/parser',

    // Parser Optionen
    // https://eslint.org/docs/latest/user-guide/configuring/language-options#specifying-parser-options
    parserOptions: {
        sourceType: 'module', // Code Struktur in ECMAScript modules
        project: './tsconfig.json', // Attribut des TypeScript Parsers: Pfad zu tsconfig.json
    },

    // Plugins
    // https://eslint.org/docs/latest/user-guide/configuring/plugins#configuring-plugins
    plugins: [
        '@typescript-eslint', // TypeScript. https://github.com/typescript-eslint/typescript-eslint
        'react', // React. https://github.com/jsx-eslint/eslint-plugin-react
    ],

    // Regelwerk
    // https://eslint.org/docs/latest/user-guide/configuring/rules#configuring-rules
    // Im Folgenden sind Abweichungen von der airbnb styleguide Konfiguration definiert:
    //  - 🆕 Regel wird überschrieben
    //  - 🆗 Regel wurde schon diskutiert, bleibt aber wie sie ist
    //  - 1️⃣ Regel ist sinnvoll darf aber in Einzelfällen begründet abgestellt werden
    rules: {

        // 🆕 Einrückung von 4 Leerzeichen
        // https://eslint.org/docs/latest/rules/indent
        indent: 'off',
        '@typescript-eslint/indent': ['warn', 4],
        'react/jsx-indent': ['warn', 4],
        'react/jsx-indent-props': ['warn', 4],

        // 🆕 Maximale Zeilenlänge ausstellen (in TSX zu oft längere Zeilen entstehen)
        // https://eslint.org/docs/latest/rules/max-len
        'max-len': 'off',

        // 🆕 Unterstriche werden in @typescript/naming-convention behandelt
        // https://eslint.org/docs/latest/rules/no-underscore-dangle
        'no-underscore-dangle': 'off',

        // 🆕 Variablen Namen
        // https://typescript-eslint.io/rules/naming-convention/
        '@typescript-eslint/naming-convention': ['warn', {
            format: ['camelCase', 'PascalCase'],
            selector: ['variableLike'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'forbid',
        }],

        // 🆕 Zyklische Imports werden in den Projekten oft benutzt
        // https://github.com/import-js/eslint-plugin-import/blob/d81f48a2506182738409805f5272eff4d77c9348/docs/rules/no-cycle.md
        'import/no-cycle': 'off',

        // 🆕 Inkrement Operator i++ erlauben
        // https://eslint.org/docs/latest/rules/no-plusplus
        'no-plusplus': 'off',

        // 🆕 Verschachtelte If-Statments: condition ? expressionA : expressionB
        // https://eslint.org/docs/latest/rules/no-nested-ternary
        'no-nested-ternary': 'off',

        // 🆕 Wenn das Interface einer Komponente alle Properties definiert, kann Spreading ohne Bedenken verwendet werden
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
        'react/jsx-props-no-spreading': ['error', { custom: 'ignore' }],

        // 🆕 Mit Destructuring wird in der ersten Zeile einer Funktion gezeigt welche properties
        // tatsächlich verwendet werden. Ausserdem wird der Code meistens kürzer und damit lesbarer.
        // Ein Refactoring wäre aber viel Aufwand für eine Verbesserung der Lesbarkeit, daher nur 'warn'.
        // Destructuring Syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        // ESLint: https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
        'react/destructuring-assignment': ['warn', 'always'],

        // 🆕 Klassenmethoden die nicht this verwenden könnten wahrscheinlich static sein
        // oder sollten (konzeptionell) wo anders implementiert werden. Die airbnb-Regel bleibt.
        // https://eslint.org/docs/latest/rules/class-methods-use-this
        // 'class-methods-use-this': ['error', { exceptMethods: [] }],

        // 🆗 no-restricted-globals verbietet das Verwenden von globalen Variablen, die als Bad Practices angesehen werden
        // Die Regel von airbnb bleibt, weil die bad practices leicht zu verbessern sind. Bsp: 'parent' -> 'window.parent'
        // Liste der Variablen: https://www.npmjs.com/package/confusing-browser-globals
        // ESLint: https://eslint.org/docs/latest/rules/no-restricted-globals
        // 'no-restricted-globals': [...confusing-browser-globals],

        // 🆕 Regel wird nicht mehr empfohlen und wirft inkorrekte Fehler.
        // https://typescript-eslint.io/rules/space-before-blocks/
        '@typescript-eslint/space-before-blocks': 'off',

        // 🆕 Regel ausschalten wird empfohlen. Es werden keine Leerzeilen zwischen Klassenfeldern erzwungen.
        // https://typescript-eslint.io/rules/lines-between-class-members/
        'lines-between-class-members': 'off',
        '@typescript-eslint/lines-between-class-members': 'off',

        // 🆕 Komponenten werden mittels arrow-functions definiert
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md
        'react/function-component-definition': ['error', {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function',
        }],

        // 🆕 Optionale Komponenten-Props haben nicht immer sinnvolle default Werte
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
        'react/require-default-props': 'off',

        // 🆕 Alle Parameter-Zuweisungen zu entfernen wäre ein großer Aufwand für wenig Nutzen.
        // https://eslint.org/docs/latest/rules/no-param-reassign
        'no-param-reassign': 'off',

        // 🆗 airbnb-Regel bleibt bei 1 Klasse pro Datei. Ggf. dürfen einzelne Dateien ausgenommen werden.
        // In dem Fall bitte begründen, warum mehrere Klassen in einer Datei sind.
        // https://eslint.org/docs/latest/rules/max-classes-per-file
        // "max-classes-per-file": ["error", 1],

        // 🆕 Disallow missing React when using JSX (react/react-in-jsx-scope)
        // airbnb überschreibt eslint-plugin-react regel
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',

        // 🆗 Fordert LF linebreak (unix). Regel bleibt. Wiki beschreibt wie man linebreaks in Git konfigurieren muss.
        // https://wiki/Projekt_Konfigurationen#Line_breaks
        // https://eslint.org/docs/latest/rules/linebreak-style
        // "linebreak-style": "off",

        // 1️⃣ Autofocus sollte für Barrierefreiheit nur verwendet werden, wenn das Inputfeld der Hauptbestandteil
        // der Seite ist (Vgl. Google Sucheingabe).
        // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/no-autofocus.md
        // "no-autofocus": "error",

        // 1️⃣ Implied eval tritt auch dann auf wenn wir den 'new Function' Konstruktor nutzen um Custom Skripte
        // als string einzulesen. Nur in Einzelfällen benutzen.
        // https://github.com/typescript-eslint/typescript-eslint/blob/v4.33.0/packages/eslint-plugin/docs/rules/no-implied-eval.md
        // "no-implied-eval": "error",

        // 1️⃣ Regel bleibt um toten Code zu vermeiden. Allerdings ist die Überprüfung der Regel fehlerhaft und
        // properties oder methoden werden zu Unrecht als nicht-verwendet klassifiziert.
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
        // "no-unused-prop-types": "error",

        // 🆕 Verhindert, dass anonyme Funktionen in Einzeiler korrigiert werden
        // https://eslint.org/docs/latest/rules/arrow-body-style
        'arrow-body-style': 'off',

        // 🆕 Legt den Aufbau einer Komponente fest.
        // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
        'react/sort-comp': ['warn', {
            order: [
                'static-variables',
                'instance-variables',
                'static-methods',
                'lifecycle',
                '/^handle.+$/',
                '/^on.+$/',
                'getters',
                'setters',
                '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
                'instance-methods',
                'everything-else',
                'rendering',
            ],
        }],
    },
};
