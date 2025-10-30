import { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { useBoardStore } from '../../stores/boardStore'
import { useUIStore } from '../../stores/uiStore'

const CATEGORY_COLORS = {
  person: '#3B82F6',
  organization: '#8B5CF6',
  event: '#F59E0B',
  location: '#10B981',
  document: '#6366F1',
}

export default function Canvas() {
  const svgRef = useRef()
  const simulationRef = useRef()
  const { nodes, edges, selectedNode, setSelectedNode, addNode, addEdge } = useBoardStore()
  const { openNodeForm } = useUIStore()
  const [pendingConnection, setPendingConnection] = useState(null)

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const width = window.innerWidth
    const height = window.innerHeight

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // Clear previous render

    // Create zoom behavior
    const g = svg.append('g').attr('class', 'canvas-group')

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Click on canvas to deselect
    svg.on('click', (event) => {
      if (event.target === svgRef.current) {
        setSelectedNode(null)
        setPendingConnection(null)
      }
    })

    // Initialize force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges)
        .id(d => d.id)
        .distance(150)
        .strength(0.5))
      .force('charge', d3.forceManyBody()
        .strength(-300)
        .distanceMax(400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))
      .alphaDecay(0.02)

    simulationRef.current = simulation

    // Render edges
    const edgeGroup = g.append('g').attr('class', 'edges')
    const edgeSelection = edgeGroup
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('class', 'edge')
      .attr('stroke', '#4B5563')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6)
      .style('cursor', 'pointer')

    // Edge labels
    const edgeLabelGroup = g.append('g').attr('class', 'edge-labels')
    const edgeLabelSelection = edgeLabelGroup
      .selectAll('text')
      .data(edges)
      .join('text')
      .attr('class', 'edge-label')
      .attr('text-anchor', 'middle')
      .attr('fill', '#A0AEC0')
      .attr('font-size', '10px')
      .attr('opacity', 0)
      .text(d => d.label || '')

    // Render nodes
    const nodeGroup = g.append('g').attr('class', 'nodes')
    const nodeSelection = nodeGroup
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')

    // Node circles
    nodeSelection
      .append('circle')
      .attr('r', 40)
      .attr('fill', 'rgba(30, 41, 54, 0.95)')
      .attr('stroke', d => CATEGORY_COLORS[d.semantic_category_id] || '#3B82F6')
      .attr('stroke-width', 3)
      .attr('class', d => selectedNode === d.id ? 'selected-node' : '')
      .style('filter', d => selectedNode === d.id ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))' : 'none')

    // Node labels
    nodeSelection
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#E8EDF2')
      .attr('font-size', '12px')
      .attr('pointer-events', 'none')
      .text(d => {
        const name = d.label || d.name
        return name.length > 12 ? name.substring(0, 12) + '...' : name
      })

    // Node interactions
    nodeSelection
      .on('click', (event, d) => {
        event.stopPropagation()

        if (pendingConnection) {
          // Complete edge creation
          if (pendingConnection !== d.id) {
            const newEdge = {
              id: `edge-${Date.now()}`,
              source: pendingConnection,
              target: d.id,
              label: '',
              metadata: {}
            }
            addEdge(newEdge)
          }
          setPendingConnection(null)
        } else {
          setSelectedNode(d.id)
          // Start edge creation on second click
          if (selectedNode === d.id) {
            setPendingConnection(d.id)
          }
        }
      })
      .on('mouseenter', function(event, d) {
        d3.select(this).select('circle')
          .style('filter', 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))')

        // Show connected edges
        edgeSelection
          .attr('opacity', edge =>
            edge.source.id === d.id || edge.target.id === d.id ? 1 : 0.2
          )
          .attr('stroke-width', edge =>
            edge.source.id === d.id || edge.target.id === d.id ? 3 : 2
          )

        // Show edge labels for connected edges
        edgeLabelSelection
          .attr('opacity', edge =>
            edge.source.id === d.id || edge.target.id === d.id ? 1 : 0
          )
      })
      .on('mouseleave', function(event, d) {
        if (selectedNode !== d.id) {
          d3.select(this).select('circle')
            .style('filter', 'none')
        }

        edgeSelection
          .attr('opacity', 0.6)
          .attr('stroke-width', 2)

        edgeLabelSelection
          .attr('opacity', 0)
      })

    // Drag behavior
    const dragBehavior = d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        if (!d.locked_position) {
          d.fx = null
          d.fy = null
        }
      })

    nodeSelection.call(dragBehavior)

    // Handle drag from sidebar
    svg.on('drop', (event) => {
      event.preventDefault()
      const nodeTypeData = event.dataTransfer.getData('nodeType')
      if (nodeTypeData) {
        const nodeType = JSON.parse(nodeTypeData)
        const [x, y] = d3.pointer(event)

        // Create quick node
        const newNode = {
          id: `node-${Date.now()}`,
          name: `New ${nodeType.name}`,
          label: `New ${nodeType.name}`,
          semantic_category_id: nodeType.id,
          tags: [],
          metadata: {},
          x,
          y
        }

        addNode(newNode)
      }
    })

    svg.on('dragover', (event) => {
      event.preventDefault()
    })

    // Update positions on tick
    simulation.on('tick', () => {
      edgeSelection
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      edgeLabelSelection
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)

      nodeSelection
        .attr('transform', d => `translate(${d.x},${d.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, selectedNode, pendingConnection])

  return (
    <svg
      ref={svgRef}
      className="w-full h-full bg-bg-primary"
      style={{ cursor: pendingConnection ? 'crosshair' : 'grab' }}
    >
      {pendingConnection && (
        <text
          x="50%"
          y="30"
          textAnchor="middle"
          fill="#3B82F6"
          fontSize="14"
          fontWeight="500"
        >
          Click another node to create a connection
        </text>
      )}
    </svg>
  )
}
