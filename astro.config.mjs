// @ts-check
import { existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// The reference pages are generated from the Silverkeep repo (`npm run docs:gen` locally, the deploy
// workflow in CI). Builds still work without them; the sidebar just leaves those groups out.
const hasReference = existsSync(
	new URL('./src/content/docs/docs/reference/silverscript/index.md', import.meta.url),
);

const referenceSidebar = hasReference
	? [
			{
				label: 'Silverscript API',
				items: [
					'docs/reference/silverscript',
					{
						label: 'API objects',
						items: [{ autogenerate: { directory: 'docs/reference/silverscript/api' } }],
					},
					{
						label: 'Types',
						collapsed: true,
						items: [{ autogenerate: { directory: 'docs/reference/silverscript/types' } }],
					},
					'docs/reference/silverscript/enums',
					'docs/reference/silverscript/globals',
					'docs/reference/silverscript/containers',
				],
			},
			{ label: 'Data formats', items: [{ autogenerate: { directory: 'docs/reference/data' } }] },
		]
	: [];

export default defineConfig({
	site: 'https://breedurbin.github.io',
	// Served from the repo's GitHub Pages path. If this changes (e.g. a custom domain), also update
	// `docs:gen` in package.json and the render step in .github/workflows/deploy.yml.
	base: '/SilverkeepStudiosSite',
	trailingSlash: 'ignore',
	output: 'static',
	integrations: [
		starlight({
			title: 'Project Silverkeep',
			description: 'Documentation for Project Silverkeep: Silverscript, data formats and modding.',
			favicon: '/favicon.svg',
			customCss: ['./src/styles/fonts.css', './src/styles/starlight.css'],
			components: {
				// Adds Home and Blog links to the docs header.
				SocialIcons: './src/components/StarlightNavLinks.astro',
			},
			sidebar: [
				{
					label: 'Start here',
					items: ['docs', 'docs/silverscript/getting-started', 'docs/data/overview'],
				},
				...referenceSidebar,
			],
		}),
	],
});
