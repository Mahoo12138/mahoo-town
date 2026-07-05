/**
 * 服务器数据 composable
 *
 * 从 OPanel Open API 拉取实时数据，合并后返回统一的视图模型。
 * - 仅在客户端运行（避免 SSR 抓取外部 API）
 * - 默认 60 秒轮询一次
 * - 任意一个接口失败不会让整个请求失败，而是用 0/空值兜底
 */

import { ref, computed, onMounted, onUnmounted, type Ref, type ComputedRef } from 'vue'

/* ---------- OPanel 原始响应类型 ---------- */

export interface OPanelInfo {
  motd: string
  maxPlayerCount: number
  system: {
    memory: number
    java: string
    os: string
    gpus: string[]
    arch: string
    cpuThread: number
    cpuName: string
    cpuCore: number
  }
  code: number
  port: number
  ingameTime: number
  whitelist: boolean
  error: string
  uptime: number
}

export interface OPanelMonitor {
  memory: number
  code: number
  tps: number
  cpu: number
  error: string
}

export interface OPanelPlayer {
  name: string
  isOnline: boolean
  isBanned: boolean
  uuid: string
  gamemode: string
}

export interface OPanelPlayers {
  code: number
  players: OPanelPlayer[]
  error: string
}

/* ---------- 视图模型 ---------- */

export interface PlayerEntry {
  name: string
  uuid: string
  gamemode: string
  isOnline: boolean
}

export interface ServerStatsView {
  online: boolean
  /** 服务器 MOTD */
  motd: string
  /** 端口 */
  port: number
  /** 最大玩家 */
  maxPlayers: number
  /** 累计注册玩家（OPanel 提供所有已知玩家） */
  registered: number
  /** 当前在线 */
  onlinePlayers: number
  /** 白名单状态 */
  whitelist: boolean
  /** 服务器开服时间（ISO） */
  serverStartTime: string
  /** 已运行时长（毫秒） */
  uptimeMs: number
  /** 游戏内时间（tick） */
  ingameTime: number
  /** TPS */
  tps: number
  /** CPU 使用率 % */
  cpu: number
  /** JVM 内存使用率 %（来自 /monitor） */
  jvmMemory: number
  /** 系统总内存（字节） */
  systemMemory: number
  /** Java 版本 */
  java: string
  /** 操作系统 */
  os: string
  /** CPU 架构 */
  arch: string
  /** CPU 核心数 */
  cpuCore: number
  /** 玩家列表（在线优先） */
  players: PlayerEntry[]
  /** 在线玩家 */
  onlineList: PlayerEntry[]
  /** 离线玩家 */
  offlineList: PlayerEntry[]
  /** 被封禁玩家数 */
  banned: number
}

interface UseServerStats {
  data: Ref<ServerStatsView>
  loading: Ref<boolean>
  error: Ref<string | null>
  lastUpdated: Ref<number | null>
  refresh: () => Promise<void>
  uptime: ComputedRef<{ days: number; hours: number; minutes: number; seconds: number }>
}

const DEFAULT_HOST = 'https://api.mahoo12138.cn/minecraft'
const REFRESH_INTERVAL = 60_000

const emptyStats = (): ServerStatsView => ({
  online: false,
  motd: '',
  port: 0,
  maxPlayers: 0,
  registered: 0,
  onlinePlayers: 0,
  whitelist: false,
  serverStartTime: '',
  uptimeMs: 0,
  ingameTime: 0,
  tps: 0,
  cpu: 0,
  jvmMemory: 0,
  systemMemory: 0,
  java: '',
  os: '',
  arch: '',
  cpuCore: 0,
  players: [],
  onlineList: [],
  offlineList: [],
  banned: 0,
})

/** 把游戏内时间 tick 转为 0~24 小时 */
export const ingameTimeToHour = (tick: number): number => {
  if (!tick) return 0
  return Math.floor(((tick % 24000) / 1000) * 24) % 24
}

export function useServerStats(): UseServerStats {
  const host = (import.meta.env.VITE_API_HOST as string | undefined)?.replace(/\/$/, '') || DEFAULT_HOST

  const data = ref<ServerStatsView>(emptyStats()) as Ref<ServerStatsView>
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<number | null>(null)

  let timer: ReturnType<typeof setInterval> | null = null

  const safeFetch = async <T>(path: string): Promise<T | null> => {
    try {
      const res = await fetch(`${host}${path}`, { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = (await res.json()) as T & { code?: number; error?: string }
      if (json && typeof json === 'object' && 'code' in json && json.code !== 200) {
        throw new Error(json.error || `API ${path} code=${json.code}`)
      }
      return json
    } catch (e) {
      console.warn(`[useServerStats] ${path} failed:`, e)
      return null
    }
  }

  const refresh = async () => {
    loading.value = true
    try {
      const [info, monitor, playersResp] = await Promise.all([
        safeFetch<OPanelInfo>('/open-api/info'),
        safeFetch<OPanelMonitor>('/open-api/monitor'),
        safeFetch<OPanelPlayers>('/open-api/players'),
      ])

      const next: ServerStatsView = { ...emptyStats() }

      if (info) {
        next.online = info.code === 200 && !info.error
        next.motd = info.motd
        next.port = info.port
        next.maxPlayers = info.maxPlayerCount
        next.whitelist = info.whitelist
        next.serverStartTime = new Date(Date.now() - info.uptime * 1000).toISOString()
        next.uptimeMs = info.uptime * 1000
        next.ingameTime = info.ingameTime
        next.systemMemory = info.system?.memory ?? 0
        next.java = info.system?.java ?? ''
        next.os = info.system?.os ?? ''
        next.arch = info.system?.arch ?? ''
        next.cpuCore = info.system?.cpuCore ?? 0
      }

      if (monitor) {
        next.tps = monitor.tps
        next.cpu = monitor.cpu
        next.jvmMemory = monitor.memory
      }

      if (playersResp?.players) {
        const list = playersResp.players
        next.players = list.map((p) => ({
          name: p.name,
          uuid: p.uuid,
          gamemode: p.gamemode,
          isOnline: p.isOnline,
        }))
        next.onlineList = next.players.filter((p) => p.isOnline)
        next.offlineList = next.players.filter((p) => !p.isOnline)
        next.registered = list.length
        next.onlinePlayers = next.onlineList.length
        next.banned = list.filter((p) => p.isBanned).length
      }

      // 在线玩家优先
      next.players.sort((a, b) => Number(b.isOnline) - Number(a.isOnline))

      data.value = next
      error.value = info || monitor || playersResp ? null : '所有数据接口均不可达'
      lastUpdated.value = Date.now()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '未知错误'
    } finally {
      loading.value = false
    }
  }

  const uptime = computed(() => {
    const ms = data.value.uptimeMs
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const seconds = Math.floor((ms / 1000) % 60)
    return { days, hours, minutes, seconds }
  })

  onMounted(() => {
    refresh()
    timer = setInterval(refresh, REFRESH_INTERVAL)
  })

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  })

  return { data, loading, error, lastUpdated, refresh, uptime }
}
