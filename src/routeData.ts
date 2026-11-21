import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

// starlight-blog ends the blog sidebar with an RSS link, and has no option to leave it out. The site's only RSS link
// is the icon beside the site title (src/components/StarlightSiteTitle.astro), so it's removed here, after the
// other route middleware has built the sidebar.
export const onRequest = defineRouteMiddleware(async (context, next) => {
	await next();
	const route = context.locals.starlightRoute;
	route.sidebar = route.sidebar.filter((entry) => entry.type !== 'link' || !entry.href.endsWith('/rss.xml'));
});
