<script setup lang="ts">
import { computed } from 'vue'
import mockStats from '../data/server-stats'

const stats = mockStats

/** 服务器运行时长（天/小时/分钟） */
const uptime = computed(() => {
  const start = new Date(stats.serverStartTime).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - start)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)

  return { days, hours, minutes }
})

/** 开服日期展示 */
const serverStartDate = computed(() => {
  const d = new Date(stats.serverStartTime)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

/** 在线率 */
const onlineRate = computed(() => {
  if (!stats.maxPlayers) return 0
  return Math.round((stats.players.online / stats.maxPlayers) * 100)
})

/** 数据是否全部为零（说明数据源尚未就绪） */
const isPending = computed(() => {
  return (
    stats.players.online === 0 &&
    stats.world.chunksGenerated === 0 &&
    stats.economy.totalTransactions === 0 &&
    stats.world.exploration.overworld === 0
  )
})

/** TPS 颜色等级 */
const tpsLevel = computed(() => {
  if (stats.status.tps >= 19.5) return 'good'
  if (stats.status.tps >= 18) return 'warn'
  return 'bad'
})
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
          <p>由服务端 mod 实时采集，每 60 秒自动刷新。数据公开透明，欢迎随时查看。</p>
        </div>
        <div class="status-pill" :class="{ online: stats.status.online, offline: !stats.status.online }">
          <span class="dot" />
          {{ stats.status.online ? '服务器在线' : '数据采集中' }}
        </div>
      </div>
    </header>

    <!-- 等待数据源 -->
    <div v-if="isPending" class="pending-banner">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <span>数据源尚未就绪：服务端 mod 仍在开发中，以下展示为占位结构，待接口上线后将自动展示真实数据。</span>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">注册玩家</span>
            <span class="metric-value">{{ stats.players.registered }}</span>
            <span class="metric-sub">社区累计成员</span>
          </div>
        </article>

        <article class="metric-card">
          <div class="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">在线玩家</span>
            <span class="metric-value">
              {{ stats.players.online }}
              <span class="metric-value-suffix">/ {{ stats.maxPlayers }}</span>
            </span>
            <span class="metric-sub">在线率 {{ onlineRate }}%</span>
          </div>
        </article>

        <article class="metric-card">
          <div class="metric-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
          <div class="metric-body">
            <span class="metric-label">服务器 TPS</span>
            <span class="metric-value" :class="['tps', tpsLevel]">{{ stats.status.tps.toFixed(1) }}</span>
            <span class="metric-sub">稳定 20.0 视为最佳</span>
          </div>
        </article>
      </div>
    </section>

    <!-- 地图探索 -->
    <section class="section">
      <div class="section-head">
        <h2>地图探索程度</h2>
        <p>三个维度已加载区块的探索覆盖率</p>
      </div>
      <div class="explore-grid">
        <article class="explore-card">
          <div class="explore-head">
            <div class="explore-title">
              <span class="dimension-dot overworld" />
              <span>主世界</span>
            </div>
            <span class="explore-pct">{{ stats.world.exploration.overworld }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill overworld" :style="{ width: stats.world.exploration.overworld + '%' }" />
          </div>
          <div class="explore-meta">
            <span>世界名：{{ stats.world.name }}</span>
            <span>区块：{{ stats.world.chunksGenerated.toLocaleString() }}</span>
          </div>
        </article>

        <article class="explore-card">
          <div class="explore-head">
            <div class="explore-title">
              <span class="dimension-dot nether" />
              <span>下界</span>
            </div>
            <span class="explore-pct">{{ stats.world.exploration.nether }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill nether" :style="{ width: stats.world.exploration.nether + '%' }" />
          </div>
          <div class="explore-meta">
            <span>地狱交通网络</span>
            <span>区块：—</span>
          </div>
        </article>

        <article class="explore-card">
          <div class="explore-head">
            <div class="explore-title">
              <span class="dimension-dot end" />
              <span>末地</span>
            </div>
            <span class="explore-pct">{{ stats.world.exploration.end }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill end" :style="{ width: stats.world.exploration.end + '%' }" />
          </div>
          <div class="explore-meta">
            <span>末影龙已被挑战</span>
            <span>区块：—</span>
          </div>
        </article>
      </div>
    </section>

    <!-- 次要数据 -->
    <section class="section">
      <div class="section-head">
        <h2>服务器生态</h2>
        <p>玩家活动、领地与经济相关数据</p>
      </div>
      <div class="eco-grid">
        <article class="eco-card">
          <div class="eco-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <span class="eco-value">{{ stats.claims.total }}</span>
          <span class="eco-label">已圈领地</span>
        </article>

        <article class="eco-card">
          <div class="eco-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          </div>
          <span class="eco-value">{{ stats.claims.totalChunks }}</span>
          <span class="eco-label">圈地覆盖区块</span>
        </article>

        <article class="eco-card">
          <div class="eco-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <span class="eco-value">{{ stats.economy.totalCurrency.toLocaleString() }}</span>
          <span class="eco-label">流通 {{ stats.economy.currencyName }}</span>
        </article>

        <article class="eco-card">
          <div class="eco-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <span class="eco-value">{{ stats.economy.totalTransactions.toLocaleString() }}</span>
          <span class="eco-label">累计交易</span>
        </article>

        <article class="eco-card">
          <div class="eco-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <span class="eco-value">{{ stats.world.blocksPlaced.toLocaleString() }}</span>
          <span class="eco-label">累计放置方块</span>
        </article>

        <article class="eco-card">
          <div class="eco-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span class="eco-value">{{ stats.players.activeLastWeek }}</span>
          <span class="eco-label">7 日活跃</span>
        </article>
      </div>
    </section>

    <!-- 最近活动 -->
    <section class="section">
      <div class="section-head">
        <h2>最近活动</h2>
        <p>玩家最近的登录与游戏事件</p>
      </div>
      <div v-if="stats.recentActivity.length === 0" class="empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <p>暂无活动记录，等待第一位玩家上线。</p>
      </div>
      <ul v-else class="activity-list">
        <li v-for="(item, i) in stats.recentActivity" :key="i" class="activity-item">
          <span class="activity-player">{{ item.player }}</span>
          <span class="activity-action">{{ item.action }}</span>
          <span class="activity-time">{{ item.time }}</span>
        </li>
      </ul>
    </section>

    <footer class="page-footer">
      <p>数据由服务端 mod 实时上报 · 页面内容由 VitePress 渲染</p>
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

/* ---------- 通用 section ---------- */
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

/* ---------- Pending banner ---------- */
.pending-banner {
  max-width: 1200px;
  margin: -2rem 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #fef3c7;
  border: 1px solid #fde68a;
  color: #92400e;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.5;
  position: relative;
  z-index: 1;
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
  color: #1a1918;
  font-variant-numeric: tabular-nums;
}

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

.progress-fill.overworld { background: linear-gradient(90deg, #34d399, #10b981); }
.progress-fill.nether { background: linear-gradient(90deg, #f87171, #ef4444); }
.progress-fill.end { background: linear-gradient(90deg, #c084fc, #a855f7); }

.explore-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.825rem;
  color: #6b6661;
}

/* ---------- Eco Grid ---------- */
.eco-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.eco-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: transform 0.2s ease;
}

.eco-card:hover {
  transform: translateY(-2px);
}

.eco-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #ecfdf5;
  color: #1e3c2f;
  border-radius: 10px;
}

.eco-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1918;
  font-variant-numeric: tabular-nums;
}

.eco-label {
  font-size: 0.825rem;
  color: #6b6661;
}

/* ---------- Activity ---------- */
.activity-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-item {
  display: grid;
  grid-template-columns: minmax(120px, 1fr) 3fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
}

.activity-player {
  font-weight: 600;
  color: #1a1918;
}

.activity-action {
  color: #5c5853;
  font-size: 0.95rem;
}

.activity-time {
  font-size: 0.825rem;
  color: #6b6661;
  font-variant-numeric: tabular-nums;
}

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

/* ---------- Footer ---------- */
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

  .section {
    padding: 3rem 1.25rem;
  }

  .metric-card {
    padding: 1.25rem;
  }

  .metric-value {
    font-size: 1.5rem;
  }

  .activity-item {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .activity-time {
    text-align: left;
  }
}
</style>
