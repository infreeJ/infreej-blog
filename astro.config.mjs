// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://infreej.dev',
    trailingSlash: 'always',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			// 라이트·다크 색을 light-dark()로 함께 출력해 페이지의 color-scheme을 따르게 한다
			themes: {
				light: 'github-light',
				dark: 'github-dark-default',
			},
			defaultColor: 'light-dark()',
		},
	},
});
