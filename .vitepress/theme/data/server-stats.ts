/**
 * 服务器统计数据源
 *
 * 当前为占位数据，等待服务端 mod 开发完成后接入真实数据源。
 * 接入方式：将下面的 mock 数据替换为从 API 拉取的请求即可。
 * 推荐 API 端点：`https://play.mahoo12138.cn/api/stats`
 *
 * 字段命名遵循服务端 mod 计划输出的 JSON 结构，便于平滑替换。
 */

export interface ServerStats {
  /** 服务器开服时间（ISO 字符串） */
  serverStartTime: string
  /** 当前在线人数上限 */
  maxPlayers: number
  players: {
    /** 注册玩家总数 */
    registered: number
    /** 当前在线玩家数 */
    online: number
    /** 近 7 日活跃玩家 */
    activeLastWeek: number
    /** 近 30 日活跃玩家 */
    activeLastMonth: number
  }
  world: {
    /** 主世界名称 */
    name: string
    /** 已生成的区块数 */
    chunksGenerated: number
    /** 总放置方块数 */
    blocksPlaced: number
    exploration: {
      /** 主世界 0~100 */
      overworld: number
      /** 下界 0~100 */
      nether: number
      /** 末地 0~100 */
      end: number
    }
  }
  claims: {
    /** 已圈地数量 */
    total: number
    /** 已圈地块数 */
    totalChunks: number
  }
  economy: {
    /** 累计交易笔数 */
    totalTransactions: number
    /** 累计流通货币 */
    totalCurrency: number
    /** 货币名称 */
    currencyName: string
  }
  /** 服务器运行状态 */
  status: {
    /** 是否在线 */
    online: boolean
    /** 平均 TPS（每秒 tick 数） */
    tps: number
    /** 占用内存（MB） */
    memoryUsage: number
  }
  /** 最近活动 */
  recentActivity: Array<{
    player: string
    action: string
    time: string
  }>
}

const mockStats: ServerStats = {
  serverStartTime: '2025-08-12T10:00:00+08:00',
  maxPlayers: 20,
  players: {
    registered: 128,
    online: 0,
    activeLastWeek: 0,
    activeLastMonth: 0,
  },
  world: {
    name: 'Mahoo',
    chunksGenerated: 0,
    blocksPlaced: 0,
    exploration: {
      overworld: 0,
      nether: 0,
      end: 0,
    },
  },
  claims: {
    total: 0,
    totalChunks: 0,
  },
  economy: {
    totalTransactions: 0,
    totalCurrency: 0,
    currencyName: 'M币',
  },
  status: {
    online: false,
    tps: 20,
    memoryUsage: 0,
  },
  recentActivity: [],
}

export default mockStats
