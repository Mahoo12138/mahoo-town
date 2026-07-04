<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useData } from 'vitepress'

const base = useData().site.value.base
const route = useRoute()
const path = route.path.replace(base, '').replace('index.html', '')

const scrolled = ref(false)
const menuOpen = ref(false)

const links = [
  { text: '主页', href: '/' },
  { text: '服务器介绍', href: '/overview' },
  { text: '服务器数据', href: '/stats' },
  { text: '模组列表', href: '/mods' },
  { text: '常见问题', href: '/faq' },
]

const isActive = (href: string) => {
  if (href === '/') return path === '' || path === '/'
  return path === href
}

const onScroll = () => {
  scrolled.value = window.scrollY > 16
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="stats-header" :class="{ scrolled }">
    <div class="stats-header-inner">
      <a :href="base" class="brand">
        <img :src="`${base}img/logo.png`" alt="Mahoo Town" class="brand-logo" />
        <span class="brand-name">Mahoo Town</span>
      </a>

      <button
        class="menu-toggle"
        :class="{ open: menuOpen }"
        aria-label="切换导航"
        @click="menuOpen = !menuOpen"
      >
        <span /><span /><span />
      </button>

      <nav class="stats-nav" :class="{ open: menuOpen }">
        <a
          v-for="link in links"
          :key="link.href"
          :href="`${base}${link.href.replace(/^\//, '')}`"
          class="stats-nav-link"
          :class="{ active: isActive(link.href) }"
          @click="menuOpen = false"
        >
          {{ link.text }}
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.stats-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(30, 60, 47, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.stats-header.scrolled {
  background: rgba(30, 60, 47, 0.95);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.stats-header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
}

.brand-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: cover;
}

.brand-name {
  background: linear-gradient(90deg, #fff, #86efac);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stats-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats-nav-link {
  position: relative;
  padding: 0.5rem 0.875rem;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  font-size: 0.925rem;
  font-weight: 500;
  border-radius: 8px;
  transition: color 0.2s ease, background 0.2s ease;
}

.stats-nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.stats-nav-link.active {
  color: #86efac;
  background: rgba(134, 239, 172, 0.12);
}

.menu-toggle {
  display: none;
  background: transparent;
  border: 0;
  width: 40px;
  height: 40px;
  padding: 0;
  cursor: pointer;
  position: relative;
}

.menu-toggle span {
  position: absolute;
  left: 10px;
  right: 10px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease, top 0.25s ease;
}

.menu-toggle span:nth-child(1) { top: 13px; }
.menu-toggle span:nth-child(2) { top: 19px; }
.menu-toggle span:nth-child(3) { top: 25px; }

.menu-toggle.open span:nth-child(1) { top: 19px; transform: rotate(45deg); }
.menu-toggle.open span:nth-child(2) { opacity: 0; }
.menu-toggle.open span:nth-child(3) { top: 19px; transform: rotate(-45deg); }

@media (max-width: 720px) {
  .menu-toggle {
    display: block;
  }

  .stats-nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    padding: 0.75rem 1rem 1.25rem;
    background: rgba(30, 60, 47, 0.98);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  .stats-nav.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .stats-nav-link {
    padding: 0.75rem 0.875rem;
  }
}
</style>
