import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

// Docs and devlog posts share Starlight's collection; posts are the entries under blog/ and add starlight-blog's
// frontmatter (date, tags, excerpt, cover, draft, ...).
export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema({ extend: (context) => blogSchema(context) }) }),
};
