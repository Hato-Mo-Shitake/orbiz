import obsidianmd from 'eslint-plugin-obsidianmd';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig(
	globalIgnores([
		'node_modules',
		'dist',
		'esbuild.config.mjs',
		'version-bump.mjs',
		'versions.json',
		'main.js',
		'package.json',
		'package-lock.json',
		'tsconfig.json',
	]),
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: ['eslint.config.mts', 'manifest.json'],
				},
				// @ts-expect-error -- 実行環境は Node.js 24 だが、型定義に dirname がない
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.json'],
			},
		},
	},
	...obsidianmd.configs.recommended,
	{
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['**/internal/**'],
							message: 'Do not import internals directly.',
						},
					],
				},
			],
		},
	},
	{
		files: ["src/__for_dev/dev-utils.ts"],
		rules: {
			"eslint-comments/no-restricted-disable": "off",
			"eslint-comments/no-unlimited-disable": "off",
			"eslint-comments/disable-enable-pair": "off",
		},
	}
);
