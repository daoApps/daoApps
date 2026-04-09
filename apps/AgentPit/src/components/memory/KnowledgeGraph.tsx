import { useState, useEffect, useRef, useCallback } from 'react'
import { knowledgeNodes, knowledgeEdges, KnowledgeNode } from '../../data/mockMemory'

interface NodePosition {
  x: number
  y: number
  vx: number
  vy: number
}

const typeColors = {
  concept: '#3b82f6',
  entity: '#10b981',
  event: '#f59e0b',
  person: '#ef4444',
  location: '#8b5cf6',
  skill: '#06b6d4',
  organization: '#ec4899'
}

const typeLabels = {
  concept: '概念',
  entity: '实体',
  event: '事件',
  person: '人物',
  location: '地点',
  skill: '技能',
  organization: '组织'
}

const KnowledgeGraph = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<(KnowledgeNode & NodePosition)[]>([])
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const width = 900
  const height = 600

  useEffect(() => {
    const initializedNodes = knowledgeNodes.map((node, i) => ({
      ...node,
      x: width / 2 + Math.cos(i * 2 * Math.PI / knowledgeNodes.length) * 200,
      y: height / 2 + Math.sin(i * 2 * Math.PI / knowledgeNodes.length) * 200,
      vx: 0,
      vy: 0
    }))
    setNodes(initializedNodes)
  }, [])

  const simulateForces = useCallback(() => {
    setNodes(prevNodes => {
      const newNodes = prevNodes.map(node => ({ ...node }))
      const centerX = width / 2
      const centerY = height / 2

      newNodes.forEach(node => {
        node.vx *= 0.9
        node.vy *= 0.9

        const dxCenter = centerX - node.x
        const dyCenter = centerY - node.y
        const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter)
        if (distCenter > 0) {
          node.vx += (dxCenter / distCenter) * 0.01
          node.vy += (dyCenter / distCenter) * 0.01
        }

        newNodes.forEach(other => {
          if (node.id === other.id) return
          let dx = other.x - node.x
          let dy = other.y - node.y
          let dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100 && dist > 0) {
            node.vx -= (dx / dist) * 0.5
            node.vy -= (dy / dist) * 0.5
          }
        })

        knowledgeEdges.forEach(edge => {
          let other = null
          if (edge.source === node.id) other = newNodes.find(n => n.id === edge.target)
          else if (edge.target === node.id) other = newNodes.find(n => n.id === edge.source)

          if (other) {
            let dx = other.x - node.x
            let dy = other.y - node.y
            let dist = Math.sqrt(dx * dx + dy * dy)
            if (dist > 80) {
              node.vx += (dx / dist) * 0.02 * edge.strength
              node.vy += (dy / dist) * 0.02 * edge.strength
            }
          }
        })
      })

      newNodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy
        node.x = Math.max(50, Math.min(width - 50, node.x))
        node.y = Math.max(50, Math.min(height - 50, node.y))
      })

      return newNodes
    })

    animationRef.current = requestAnimationFrame(simulateForces)
  }, [])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(simulateForces)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [simulateForces])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(zoom => Math.max(0.3, Math.min(3, zoom * delta)))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'rect') {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      setSelectedNode(null)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = !searchQuery || node.label.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || node.type === filterType
    return matchesSearch && matchesType
  })

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id))
  const filteredEdges = knowledgeEdges.filter(edge =>
    filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  )

  const highlightedNodeIds = searchQuery ? new Set(
    filteredNodes.filter(n =>
      n.label.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(n => n.id)
  ) : null

  const connectedIds = highlightedNodeIds ? new Set([
    ...Array.from(highlightedIds),
    ...filteredEdges
      .filter(e => highlightedNodeIds.has(e.source) || highlightedNodeIds.has(e.target))
      .map(e => highlightedNodeIds.has(e.source) ? e.target : e.source)
  ]) : null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <span>🕸️</span>
          知识图谱
        </h2>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索知识节点..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="all">全部类型</option>
            {Object.entries(typeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setZoom(z => Math.max(0.3, z - 0.2))} className="px-3 py-1 hover:bg-white rounded transition-colors">−</button>
            <span className="px-2 text-sm font-medium">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="px-3 py-1 hover:bg-white rounded transition-colors">+</button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }} className="px-3 py-1 hover:bg-white rounded transition-colors">↺</button>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-gray-700">图例：</span>
          {Object.entries(typeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-sm text-gray-600">{typeLabels[type as keyof typeof typeLabels]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden" style={{ minHeight: '600px' }}>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="cursor-grab active:cursor-grabbing w-full h-full"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center' }}
        >
          <defs>
            {Object.entries(typeColors).map(([type, color]) => (
              <radialGradient key={type} id={`glow-${type}`}>
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </radialGradient>
            ))}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x={0} y={0} width={width} height={height} fill="transparent" />

          {filteredEdges.map((edge, idx) => {
            const sourceNode = nodes.find(n => n.id === edge.source)
            const targetNode = nodes.find(n => n.id === edge.target)
            if (!sourceNode || !targetNode) return null

            const isHighlighted = !connectedIds ||
              (connectedIds.has(edge.source) && connectedIds.has(edge.target))
            const opacity = isHighlighted ? edge.strength : 0.08

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={sourceNode.x} y1={sourceNode.y}
                  x2={targetNode.x} y2={targetNode.y}
                  stroke={isHighlighted ? '#64748b' : '#334155'}
                  strokeWidth={Math.max(1, edge.strength * 3)}
                  opacity={opacity}
                />
                {isHighlighted && (
                  <line
                    x1={sourceNode.x} y1={sourceNode.y}
                    x2={targetNode.x} y2={targetNode.y}
                    stroke="#94a3b8"
                    strokeWidth={Math.max(0.5, edge.strength * 2)}
                    opacity={opacity * 0.5}
                    strokeDasharray="4,4"
                  />
                )}
              </g>
            )
          })}

          {filteredNodes.map((node) => {
            const isConnected = !connectedIds || connectedIds.has(node.id)
            const isSelected = selectedNode?.id === node.id
            const radius = 8 + (node.importance / 100) * 20
            const color = typeColors[node.type as keyof typeof typeColors] || '#64748b'

            return (
              <g
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedNode(node)
                }}
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                opacity={isConnected ? 1 : 0.15}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 8}
                  fill={`url(#glow-${node.type})`}
                  opacity={isSelected ? 0.6 : 0.3}
                />

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={color}
                  stroke={isSelected ? '#fff' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  filter={isSelected ? 'url(#glow)' : undefined}
                  style={{
                    transition: 'all 0.3s ease',
                    transformOrigin: `${node.x}px ${node.y}px`
                  }}
                />

                <text
                  x={node.x}
                  y={node.y + radius + 16}
                  textAnchor="middle"
                  fill={isConnected ? '#e2e8f0' : '#475569'}
                  fontSize={11}
                  fontWeight={isSelected ? 600 : 400}
                  style={{ pointerEvents: 'none' }}
                >
                  {node.label.length > 8 ? node.label.slice(0, 7) + '...' : node.label}
                </text>
              </g>
            )
          })}
        </svg>

        {selectedNode && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-2xl max-w-xs z-10">
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ×
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: typeColors[selectedNode.type as keyof typeof typeColors] }}
              />
              <span className="text-sm font-semibold text-gray-700">
                {typeLabels[selectedNode.type as keyof typeof typeLabels]}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedNode.label}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{selectedNode.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-gray-500 text-xs">重要程度</p>
                <p className="font-semibold text-gray-900">{selectedNode.importance}/100</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-gray-500 text-xs">关联数量</p>
                <p className="font-semibold text-gray-900">{selectedNode.connections} 个</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">创建时间：{selectedNode.createdAt}</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>共 {knowledgeNodes.length} 个节点，{knowledgeEdges.length} 条关系</span>
          <span>{searchQuery ? `找到 ${filteredNodes.length} 个匹配节点` : '拖拽平移 · 滚轮缩放 · 点击查看详情'}</span>
        </div>
      </div>
    </div>
  )
}

export default KnowledgeGraph
