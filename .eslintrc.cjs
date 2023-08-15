var tsConfigs = ["./tsconfig.json"];

var ruleOverrides = {};

module.exports = {
    overrides: [
        {
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
                "prettier",
            ],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: tsConfigs,
            },
            plugins: ["@typescript-eslint", "prettier"],
            rules: {
                "prettier/prettier": "error",
            },
            files: ["*.ts"],
        },
        {
            extends: ["eslint:recommended", "prettier"],
            files: "*.mjs",
            rules: ruleOverrides,
        },
        {
            extends: ["prettier"],
            files: "*.js",
            rules: ruleOverrides,
        },
    ],
    root: true,
};
