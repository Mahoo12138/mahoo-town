import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Mahoo Town",
  description: "Minecraft 农场物语服务器主页",
  srcDir: 'docs',
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '服务器介绍', link: '/overview' },
      { text: '模组列表', link: '/mods' },
      { text: '常见问题', link: '/faq' },
    ],

    sidebar: [
      {
        text: '简介',
        link: '/overview',
        items: [
          {
            text: '📜服务器规则',
            collapsed: false,
            items: [
              { text: '规则总览', link: '/server-rules' },
              { text: '游戏内规则', link: '/in-game-rules' },
              { text: '红石与机器', link: '/redstone-rules' }
            ]
          },
          { text: '🤝玩家协议', link: '/rules' },
          { text: '💬常见问题', link: '/faq' },
          { text: '📦模组列表', link: '/mods' },
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
