// @ts-check
import { existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';

// The reference pages are generated from the Silverkeep repo (`npm run docs:gen` locally, the deploy
// workflow in CI), each by its own generator into its own folder. Builds still work without them: a
// topic's generated group is left out, and the console commands topic, which is all generated, goes.
const generated = (page) => existsSync(new URL(`./src/content/docs/docs/reference/${page}`, import.meta.url));
const hasSilverscript = generated('silverscript/index.md');
const hasDataFormats = generated('data/index.md');
const hasConsoleCommands = generated('console/index.md');

// One topic per kind of docs, picked from the switcher at the top of the sidebar (starlight-sidebar-topics).
const topics = [
	{
		label: 'Silverscript',
		link: '/docs/silverscript/getting-started/',
		icon: 'seti:c',
		items: [
			'docs/silverscript/getting-started',
			...(hasSilverscript
				? [
						{
							label: 'API reference',
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
					]
				: []),
		],
	},
	{
		label: 'Data formats',
		link: '/docs/data/overview/',
		icon: 'document',
		items: [
			'docs/data/overview',
			...(hasDataFormats
				? [{ label: 'Formats', items: [{ autogenerate: { directory: 'docs/reference/data' } }] }]
				: []),
		],
	},
	...(hasConsoleCommands
		? [
				{
					label: 'Console commands',
					link: '/docs/reference/console/',
					icon: 'seti:shell',
					items: [
						'docs/reference/console',
						{ label: 'Commands', items: [{ autogenerate: { directory: 'docs/reference/console/commands' } }] },
					],
				},
			]
		: []),
];

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
			description: 'Documentation for Project Silverkeep: Silverscript, data formats, console commands and modding.',
			favicon: '/favicon.svg',
			customCss: ['./src/styles/fonts.css', './src/styles/starlight.css'],
			components: {
				// Adds Home and Blog links to the docs header.
				SocialIcons: './src/components/StarlightNavLinks.astro',
			},
			// The docs home (a splash page, no sidebar) links to every topic.
			plugins: [starlightSidebarTopics(topics)],
		}),
	],
});
