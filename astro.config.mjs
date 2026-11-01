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
			// 라이트·다크 색을 함께 출력하고 global.css에서 시스템 설정에 따라 전환
			themes: {
				light: 'github-light',
				dark: 'github-dark-default',
			},
		},
	},
});
