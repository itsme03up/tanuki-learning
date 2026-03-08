// src/components/FileSystemMap.tsx
import './FileSystemMap.css'

type Node = {
  id: string
  label: string
  x: number
  y: number
  description: string
  highlight?: boolean
}

const NODES: Node[] = [
  { id: 'root', label: '/',          x: 200, y: 60,  description: '銀河の中心' },
  { id: 'home', label: '/home',      x: 80,  y: 200, description: 'ホーム星雲' },
  { id: 'etc',  label: '/etc',       x: 200, y: 200, description: '設定惑星' },
  { id: 'usr',  label: '/usr',       x: 320, y: 200, description: 'USR星団' },
  { id: 'var',  label: '/var',       x: 80,  y: 360, description: 'VAR星団' },
  { id: 'tmp',  label: '/tmp',       x: 320, y: 360, description: '一時小惑星帯' },
  { id: 'user', label: '/home/user', x: 80,  y: 500, description: '君の宇宙船' },
]

const EDGES = [
  ['root', 'home'],
  ['root', 'etc'],
  ['root', 'usr'],
  ['home', 'var'],
  ['usr',  'tmp'],
  ['home', 'user'],
]

type Props = {
  currentPath?: string
}

export const FileSystemMap = ({ currentPath = '/home' }: Props) => {
  const getNodeById = (id: string) => NODES.find(n => n.id === id)!

  return (
    <div className="fsmap-wrapper">
      <svg viewBox="0 0 400 580" className="fsmap-svg">
        {/* 星背景 */}
        {[...Array(30)].map((_, i) => (
          <circle
            key={i}
            cx={Math.sin(i * 137.5) * 180 + 200}
            cy={Math.cos(i * 97.3) * 220 + 260}
            r={Math.random() < 0.3 ? 1.5 : 0.8}
            fill="rgba(255,255,255,0.4)"
          />
        ))}

        {/* エッジ */}
        {EDGES.map(([from, to]) => {
          const a = getNodeById(from)
          const b = getNodeById(to)
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x} y1={a.y}
              x2={b.x} y2={b.y}
              stroke="rgba(26,143,181,0.3)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          )
        })}

        {/* ノード */}
        {NODES.map((node) => {
          const isCurrent = currentPath === node.label || (node.id === 'root' && currentPath === '/')
          return (
            <g key={node.id}>
              {/* 外周グロー */}
              {isCurrent && (
                <circle
                  cx={node.x} cy={node.y} r={28}
                  fill="none"
                  stroke="rgba(0,229,255,0.3)"
                  strokeWidth="8"
                />
              )}
              {/* 惑星 */}
              <circle
                cx={node.x} cy={node.y}
                r={node.id === 'root' ? 22 : 16}
                fill={isCurrent ? '#0d3a50' : '#050a0e'}
                stroke={isCurrent ? '#00e5ff' : '#1a8fb5'}
                strokeWidth={isCurrent ? 2 : 1}
              />
              {/* ラベル */}
              <text
                x={node.x} y={node.y + 4}
                textAnchor="middle"
                fontSize={node.id === 'root' ? 12 : 9}
                fill={isCurrent ? '#00e5ff' : '#a0d0e0'}
                fontFamily="Share Tech Mono, monospace"
              >
                {node.label}
              </text>
              {/* 説明 */}
              <text
                x={node.x} y={node.y + (node.id === 'root' ? 36 : 30)}
                textAnchor="middle"
                fontSize={8}
                fill="rgba(160,208,224,0.5)"
                fontFamily="Share Tech Mono, monospace"
              >
                {node.description}
              </text>
            </g>
          )
        })}
      </svg>

      {/* 現在地表示 */}
      <div className="fsmap-current">
        <span className="fsmap-label">// CURRENT LOCATION</span>
        <span className="fsmap-path">{currentPath}</span>
      </div>
    </div>
  )
}