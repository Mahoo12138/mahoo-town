import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Mahoo Town",
  description: "A Minecraft Server Homepage",
  srcDir: 'docs',
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '玩法教程', link: '/tutorial' },
      { text: '常见问题', link: '/faq' },
    ],

    sidebar: [
      {
        text: '简介',
        link: '/overview',
        items: [
          { text: '🤝玩家协议', link: '/rules' },
          { text: '💬常见问题', link: '/faq' },
        ]
      },
      {
        text: '初来咋到',
        items: [
          { text: '🏃‍♂️游戏安装', link: '/play/get-started' },
          { text: '👔更换皮肤', link: '/play/skin' },
          { text: '💻基础命令', link: '/play/commands' },
        ]
      },
      {
        text: '玩法教程',
        link: "/tutorial",
        items: [
          { text: '圈地教程', link: '/tutorial/dominion' },
          { text: '机械动力', link: '/tutorial/create' },
          { text: '瓦尔基里', link: '/tutorial/valkyrie' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
