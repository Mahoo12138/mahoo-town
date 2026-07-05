<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useServerStats, ingameTimeToHour } from '../composables/useServerStats'

const { data, loading, error, lastUpdated, refresh, uptime } = useServerStats()

/* ---------- 刷新倒计时 ---------- */
const REFRESH_SECONDS = 60
const nextRefreshIn = ref(REFRESH_SECONDS)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const resetCountdown = () => {
  nextRefreshIn.value = REFRESH_SECONDS
}
watch(lastUpdated, resetCountdown)

onMounted(() => {
  countdownTimer = setInterval(() => {
    if (nextRefreshIn.value > 0) nextRefreshIn.value--
  }, 1000)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

/* ---------- 派生数据 ---------- */

const isInitialLoading = computed(() => loading.value && !lastUpdated.value)

const lastUpdatedText = computed(() => {
  if (!lastUpdated.value) return '等待首次更新…'
  const diff = Math.floor((Date.now() - lastUpdated.value) / 1000)
  if (diff < 5) return '刚刚'
  if (diff < 60) return `${diff} 秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  return new Date(lastUpdated.value).toLocaleTimeString('zh-CN', { hour12: false })
})

/** 开服日期展示 */
const serverStartDate = computed(() => {
  if (!data.value.serverStartTime) return '—'
  const d = new Date(data.value.serverStartTime)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

/** 在线率 */
const onlineRate = computed(() => {
  if (!data.value.maxPlayers) return 0
  return Math.round((data.value.onlinePlayers / data.value.maxPlayers) * 100)
})

/** TPS 等级 */
const tpsLevel = computed(() => {
  if (data.value.tps >= 19.5) return 'good'
  if (data.value.tps >= 18) return 'warn'
  return 'bad'
})

/** 游戏内时间：是否白天 */
const isDay = computed(() => data.value.ingameTime < 12000)

/** 游戏内小时（0~24） */
const ingameHour = computed(() => ingameTimeToHour(data.value.ingameTime))

/** 游戏内时间显示 */
const ingameTimeText = computed(() => {
  if (!data.value.ingameTime) return '—'
  return `游戏内第 ${data.value.ingameTime.toLocaleString()} tick · ${String(ingameHour.value).padStart(2, '0')}:00`
})

/** 字节格式化 */
const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`
}

/** 操作系统简写 */
const osShort = computed(() => {
  const os = data.value.os
  if (!os) return '—'
  if (/ubuntu/i.test(os)) return 'Ubuntu'
  if (/debian/i.test(os)) return 'Debian'
  if (/centos/i.test(os)) return 'CentOS'
  if (/windows/i.test(os)) return 'Windows'
  if (/macos|darwin/i.test(os)) return 'macOS'
  return os.split(' ')[0] || os
})

/** 玩家头像 */
const avatarUrl = (name: string) => `https://minotar.net/helm/${encodeURIComponent(name)}/32.png`

/** 游戏模式配色 */
const gamemodeColor = (mode: string) => {
  const m = (mode || '').toLowerCase()
  if (m === 'survival') return '#34d399'
  if (m === 'creative') return '#fbbf24'
  if (m === 'adventure') return '#a855f7'
  if (m === 'spectator') return '#9ca3af'
  return '#86efac'
}
</script>

<template>
  <div class="stats-page">
    <!-- 顶部 Hero -->
    <header class="hero">
      <div class="hero-bg" />
      <div class="hero-inner">
        <div class="hero-text">
          <span class="eyebrow">Mahoo Town · Realtime</span>
          <h1>服务器实时数据</h1>
          <p>由 OPanel Open API 实时采集，每 60 秒自动刷新。数据公开透明，欢迎随时查看。</p>
        </div>
        <div class="hero-meta">
          <div class="status-pill" :class="{ online: data.online, offline: !data.online }">
            <span class="dot" />
            {{ data.online ? '服务器在线' : '数据采集中' }}
          </div>
          <div class="refresh-info">
            <span class="refresh-text">{{ lastUpdatedText }}</span>
            <button class="refresh-btn" :disabled="loading" @click="refresh" :title="`${nextRefreshIn}s 后自动刷新`">
              <svg :class="{ spinning: loading }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
              <span>手动刷新</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 错误提示 -->
    <div v-if="error" class="error-banner">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      <span>{{ error }}，显示的数据可能不完整。</span>
    </div>

    <!-- 首次加载骨架 -->
    <div v-if="isInitialLoading" class="loading-overlay">
      <div class="spinner" />
      <span>正在从 {{ data.motd ? 'OPanel' : 'API' }} 拉取数据…</span>
    </div>

    <!-- 核心指标 -->
    <section class="section">
      <div class="section-head">
        <h2>核心指标</h2>
        <p>服务器最关键的实时数据</p>
      </div>
      <div class="metric-grid">
        <article class="metric-card highlight">
          <div class="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">开服时间</span>
            <span class="metric-value">{{ serverStartDate }}</span>
            <span class="metric-sub">已稳定运行 {{ uptime.days }} 天 {{ uptime.hours }} 时 {{ uptime.minutes }} 分</span>
          </div>
        </article>

        <article class="metric-card">
          <div class="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">在线玩家</span>
            <span class="metric-value">
              {{ data.onlinePlayers }}
              <span class="metric-value-suffix">/ {{ data.maxPlayers }}</span>
            </span>
            <span class="metric-sub">在线率 {{ onlineRate }}%</span>
          </div>
        </article>

        <article class="metric-card">
          <div class="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">注册玩家</span>
            <span class="metric-value">{{ data.registered }}</span>
            <span class="metric-sub">被封禁 {{ data.banned }} 人</span>
          </div>
        </article>

        <article class="metric-card">
          <div class="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">服务器 TPS</span>
            <span class="metric-value" :class="['tps', tpsLevel]">{{ data.tps ? data.tps.toFixed(1) : '—' }}</span>
            <span class="metric-sub">稳定 20.0 视为最佳</span>
          </div>
        </article>
      </div>
    </section>

    <!-- 服务器性能 -->
    <section class="section">
      <div class="section-head">
        <h2>服务器性能</h2>
        <p>CPU 与内存的实时占用情况</p>
      </div>
      <div class="perf-grid">
        <article class="perf-card">
          <div class="perf-head">
            <div class="perf-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
              <span>CPU 占用</span>
            </div>
            <span class="perf-value" :class="{ warn: data.cpu > 70, bad: data.cpu > 90 }">
              {{ data.cpu ? data.cpu.toFixed(1) : '0.0' }}<span class="unit">%</span>
            </span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill cpu" :style="{ width: data.cpu + '%' }" />
          </div>
          <div class="perf-meta">核心数：{{ data.cpuCore || '—' }}</div>
        </article>

        <article class="perf-card">
          <div class="perf-head">
            <div class="perf-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><line x1="6" y1="10" x2="6" y2="14"></line><line x1="10" y1="10" x2="10" y2="14"></line><line x1="14" y1="10" x2="14" y2="14"></line><line x1="18" y1="10" x2="18" y2="14"></line></svg>
              <span>JVM 内存</span>
            </div>
            <span class="perf-value" :class="{ warn: data.jvmMemory > 70, bad: data.jvmMemory > 90 }">
              {{ data.jvmMemory ? data.jvmMemory.toFixed(1) : '0.0' }}<span class="unit">%</span>
            </span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill mem" :style="{ width: data.jvmMemory + '%' }" />
          </div>
          <div class="perf-meta">Java {{ data.java || '—' }}</div>
        </article>

        <article class="perf-card">
          <div class="perf-head">
            <div class="perf-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
              <span>系统内存</span>
            </div>
            <span class="perf-value">{{ formatBytes(data.systemMemory) }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill sys" :style="{ width: '100%' }" />
          </div>
          <div class="perf-meta">{{ osShort }} · {{ data.arch || '—' }}</div>
        </article>
      </div>
    </section>

    <!-- 服务器信息 -->
    <section class="section">
      <div class="section-head">
        <h2>服务器信息</h2>
        <p>基础配置与游戏内状态</p>
      </div>
      <div class="info-grid">
        <article class="info-card wide">
          <span class="info-label">MOTD</span>
          <span class="info-value motd">{{ data.motd || '—' }}</span>
        </article>

        <article class="info-card">
          <span class="info-label">服务器端口</span>
          <span class="info-value">{{ data.port || '—' }}</span>
        </article>

        <article class="info-card">
          <span class="info-label">白名单</span>
          <span class="info-value" :class="data.whitelist ? 'tag-warn' : 'tag-ok'">
            {{ data.whitelist ? '已开启' : '未开启' }}
          </span>
        </article>

        <article class="info-card">
          <span class="info-label">游戏内时间</span>
          <span class="info-value time">
            <span v-if="data.ingameTime" class="time-icon" :class="{ night: !isDay }">
              <svg v-if="isDay" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </span>
            {{ ingameTimeText }}
          </span>
        </article>

        <article class="info-card">
          <span class="info-label">Java 版本</span>
          <span class="info-value">{{ data.java || '—' }}</span>
        </article>

        <article class="info-card">
          <span class="info-label">操作系统</span>
          <span class="info-value">{{ osShort }} · {{ data.arch || '—' }}</span>
        </article>
      </div>
    </section>

    <!-- 玩家列表 -->
    <section class="section">
      <div class="section-head">
        <h2>玩家列表</h2>
        <p>共 {{ data.registered }} 名玩家 · {{ data.onlinePlayers }} 人在线</p>
      </div>
      <div v-if="data.players.length === 0" class="empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
        <p>暂无玩家数据</p>
      </div>
      <div v-else class="player-grid">
        <article
          v-for="p in data.players"
          :key="p.uuid"
          class="player-card"
          :class="{ offline: !p.isOnline }"
        >
          <img :src="avatarUrl(p.name)" :alt="p.name" class="player-avatar" />
          <div class="player-info">
            <span class="player-name">{{ p.name }}</span>
            <span class="player-mode" :style="{ color: gamemodeColor(p.gamemode) }">
              {{ p.gamemode || 'survival' }}
            </span>
          </div>
          <span class="player-status" :class="{ online: p.isOnline }">
            <span class="status-dot" />
            {{ p.isOnline ? '在线' : '离线' }}
          </span>
        </article>
      </div>
    </section>

    <!-- 地图探索（占位） -->
    <section class="section">
      <div class="section-head">
        <h2>地图探索程度</h2>
        <p>等待自定义 mod 上线后接入</p>
      </div>
      <div class="explore-grid">
        <article class="explore-card">
          <div class="explore-head">
            <div class="explore-title">
              <span class="dimension-dot overworld" />
              <span>主世界</span>
            </div>
            <span class="explore-pct">—</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill overworld" style="width: 0%" />
          </div>
          <div class="explore-meta">
            <span>区块数据</span>
            <span>等待 mod</span>
          </div>
        </article>

        <article class="explore-card">
          <div class="explore-head">
            <div class="explore-title">
              <span class="dimension-dot nether" />
              <span>下界</span>
            </div>
            <span class="explore-pct">—</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill nether" style="width: 0%" />
          </div>
          <div class="explore-meta">
            <span>区块数据</span>
            <span>等待 mod</span>
          </div>
        </article>

        <article class="explore-card">
          <div class="explore-head">
            <div class="explore-title">
              <span class="dimension-dot end" />
              <span>末地</span>
            </div>
            <span class="explore-pct">—</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill end" style="width: 0%" />
          </div>
          <div class="explore-meta">
            <span>区块数据</span>
            <span>等待 mod</span>
          </div>
        </article>
      </div>
      <p class="section-foot">自定义 mod 仍在开发中，待其发布后将自动展示主世界、下界、末地的探索数据。</p>
    </section>

    <footer class="page-footer">
      <p>数据由 OPanel Open API 实时上报 · 页面内容由 VitePress 渲染</p>
    </footer>
  </div>
</template>

<style scoped>
.stats-page {
  width: 100%;
  background: #fdfbf7;
  color: #2c2926;
}

/* ---------- Hero ---------- */
.hero {
  position: relative;
  padding: 6rem 1.5rem 4.5rem;
  background: linear-gradient(135deg, #1e3c2f 0%, #2a5242 100%);
  color: #fff;
  overflow: hidden;
  isolation: isolate;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  z-index: -1;
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  background: rgba(134, 239, 172, 0.15);
  color: #86efac;
  padding: 0.35rem 0.75rem;
  border-radius: 100px;
  margin-bottom: 1rem;
}

.hero h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
}

.hero-text p {
  font-size: 1.05rem;
  opacity: 0.75;
  max-width: 540px;
  margin: 0;
  line-height: 1.6;
}

.hero-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
}

.status-pill .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.2);
}

.status-pill.online .dot {
  background: #34d399;
  box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.25);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.25); }
  50% { box-shadow: 0 0 0 8px rgba(52, 211, 153, 0.1); }
}

.refresh-info {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.refresh-text {
  font-variant-numeric: tabular-nums;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---------- Banners ---------- */
.error-banner {
  max-width: 1200px;
  margin: -2rem 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.5;
  position: relative;
  z-index: 1;
}

.loading-overlay {
  max-width: 1200px;
  margin: 2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #6b6661;
  font-size: 0.95rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(30, 60, 47, 0.2);
  border-top-color: #1e3c2f;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ---------- Section ---------- */
.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}

.section-head {
  margin-bottom: 2.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 1.5rem;
}

.section-head h2 {
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #1a1918;
  letter-spacing: -0.01em;
}

.section-head p {
  font-size: 1rem;
  color: #6b6661;
  margin: 0;
}

.section-foot {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #9c9893;
  text-align: center;
}

/* ---------- Metric Grid ---------- */
.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(30, 60, 47, 0.08);
}

.metric-card.highlight {
  background: linear-gradient(135deg, #1e3c2f 0%, #2a5242 100%);
  color: #fff;
  border-color: transparent;
}

.metric-card.highlight .metric-label,
.metric-card.highlight .metric-sub {
  color: rgba(255, 255, 255, 0.7);
}

.metric-card.highlight .metric-icon {
  background: rgba(134, 239, 172, 0.18);
  color: #86efac;
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #ecfdf5;
  color: #1e3c2f;
  border-radius: 12px;
  flex-shrink: 0;
}

.metric-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.metric-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b6661;
  font-weight: 600;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.1;
  color: #1a1918;
}

.metric-card.highlight .metric-value {
  color: #fff;
}

.metric-value-suffix {
  font-size: 1rem;
  font-weight: 500;
  color: #6b6661;
  margin-left: 0.25rem;
}

.metric-card.highlight .metric-value-suffix {
  color: rgba(255, 255, 255, 0.6);
}

.metric-sub {
  font-size: 0.825rem;
  color: #6b6661;
}

.metric-value.tps.good { color: #059669; }
.metric-value.tps.warn { color: #d97706; }
.metric-value.tps.bad { color: #dc2626; }

/* ---------- Performance ---------- */
.perf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.perf-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.perf-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.perf-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #1a1918;
}

.perf-title svg {
  color: #1e3c2f;
}

.perf-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1918;
  font-variant-numeric: tabular-nums;
}

.perf-value .unit {
  font-size: 1rem;
  font-weight: 500;
  color: #6b6661;
  margin-left: 0.15rem;
}

.perf-value.warn { color: #d97706; }
.perf-value.bad { color: #dc2626; }

.perf-meta {
  font-size: 0.825rem;
  color: #6b6661;
}

/* ---------- Info Grid ---------- */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.info-card.wide {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b6661;
  font-weight: 600;
}

.info-value {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1a1918;
}

.info-value.motd {
  font-family: ui-monospace, 'SF Mono', Consolas, monospace;
  font-size: 0.95rem;
  color: #5c5853;
  word-break: break-all;
}

.info-value.time {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-variant-numeric: tabular-nums;
}

.time-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
}

.time-icon.night {
  color: #818cf8;
}

.tag-ok { color: #059669; }
.tag-warn { color: #d97706; }

/* ---------- Player Grid ---------- */
.player-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.75rem;
}

.player-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  transition: transform 0.15s ease;
}

.player-card:hover {
  transform: translateY(-1px);
}

.player-card.offline {
  opacity: 0.6;
}

.player-avatar {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  image-rendering: pixelated;
  flex-shrink: 0;
  background: #f1ede4;
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
}

.player-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1918;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-mode {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.player-status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: #6b6661;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9c9893;
}

.player-status.online {
  color: #059669;
}

.player-status.online .status-dot {
  background: #34d399;
  box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.2);
}

/* ---------- Explore Grid ---------- */
.explore-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.explore-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 18px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.explore-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.explore-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  font-size: 1.05rem;
  color: #1a1918;
}

.dimension-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dimension-dot.overworld { background: #34d399; }
.dimension-dot.nether { background: #ef4444; }
.dimension-dot.end { background: #a855f7; }

.explore-pct {
  font-size: 1.5rem;
  font-weight: 700;
  color: #9c9893;
  font-variant-numeric: tabular-nums;
}

.explore-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.825rem;
  color: #9c9893;
}

/* ---------- Progress ---------- */
.progress-bar {
  height: 8px;
  background: #f1ede4;
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.progress-fill.cpu { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.progress-fill.mem { background: linear-gradient(90deg, #60a5fa, #3b82f6); }
.progress-fill.sys { background: linear-gradient(90deg, #86efac, #34d399); }
.progress-fill.overworld { background: linear-gradient(90deg, #34d399, #10b981); }
.progress-fill.nether { background: linear-gradient(90deg, #f87171, #ef4444); }
.progress-fill.end { background: linear-gradient(90deg, #c084fc, #a855f7); }

/* ---------- Empty / Footer ---------- */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  background: #fff;
  border: 1px dashed rgba(0, 0, 0, 0.12);
  border-radius: 18px;
  color: #9c9893;
  text-align: center;
}

.empty p {
  margin: 0;
  font-size: 0.95rem;
}

.page-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 2rem 1.5rem;
  text-align: center;
  color: #9c9893;
  font-size: 0.875rem;
}

.page-footer p {
  margin: 0;
}

/* ---------- Responsive ---------- */
@media (max-width: 640px) {
  .hero {
    padding: 4rem 1.25rem 3rem;
  }

  .hero-meta {
    align-items: flex-start;
    width: 100%;
  }

  .section {
    padding: 3rem 1.25rem;
  }

  .metric-card {
    padding: 1.25rem;
  }

  .metric-value {
    font-size: 1.5rem;
  }
}
</style>
