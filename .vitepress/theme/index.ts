// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'

import './style.scss'

export default {
  Layout,
  NotFound,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
