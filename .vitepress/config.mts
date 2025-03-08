import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Mahoo Town",
  description: "A Minecraft Server Homepage",
  srcDir: 'docs',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Wiki', link: '/wiki' },
      { text: 'FAQ', link: '/faq' }
    ],

    sidebar: [
      {
        text: 'Wiki',
        items: [
          { text: 'Wiki', link: '/wiki' },
          { text: 'FAQ', link: '/faq' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
