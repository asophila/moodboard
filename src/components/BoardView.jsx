import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Canvas from './Canvas/Canvas'
import { useBoardStore } from '../stores/boardStore'

export default function BoardView() {
  const { boardId } = useParams()
  const { setCurrentBoard, setNodes, setEdges, addAISuggestion } = useBoardStore()

  useEffect(() => {
    // Load demo data
    setCurrentBoard({ id: boardId, title: 'Luis Hermosilla Investigation' })

    // Load demo nodes from prototype data
    const demoNodes = [
      { id: '1', name: 'Luis Hermosilla', label: 'Hermosilla', semantic_category_id: 'person', tags: ['lawyer', 'corruption'], metadata: {} },
      { id: '2', name: 'Sebastián Piñera', label: 'Piñera', semantic_category_id: 'person', tags: ['politician', 'president'], metadata: {} },
      { id: '3', name: 'Andrés Chadwick', label: 'Chadwick', semantic_category_id: 'person', tags: ['minister'], metadata: {} },
      { id: '4', name: 'Empresa Nacional del Petróleo', label: 'ENAP', semantic_category_id: 'organization', metadata: {} },
      { id: '5', name: 'Banco de Chile', label: 'Banco de Chile', semantic_category_id: 'organization', metadata: {} },
      { id: '6', name: 'SQM', label: 'SQM', semantic_category_id: 'organization', metadata: {} },
    ]

    const demoEdges = [
      { id: 'e1', source: '1', target: '4', label: 'Abogado corporativo', metadata: {} },
      { id: 'e2', source: '1', target: '6', label: 'Representante legal', metadata: {} },
      { id: 'e3', source: '2', target: '4', label: 'Influencia política', metadata: {} },
      { id: 'e4', source: '2', target: '5', label: 'Accionista mayoritario', metadata: {} },
      { id: 'e5', source: '3', target: '2', label: 'Ministro del Interior', metadata: {} },
      { id: 'e6', source: '4', target: '6', label: 'Contrato de suministro', metadata: {} },
    ]

    setNodes(demoNodes)
    setEdges(demoEdges)

    // Add demo AI suggestions
    setTimeout(() => {
      addAISuggestion({
        id: 'suggestion-1',
        suggestion_type: 'connection',
        confidence: 0.85,
        data: {
          source_name: 'Luis Hermosilla',
          target_name: 'White KIA',
          source_category: 'person',
          target_category: 'document',
          relationship: 'Vehicle ownership'
        },
        evidence: [
          {
            document_name: 'testimony_1.pdf',
            page: 30,
            line: 4,
            excerpt: '...subject used White KIA on his birthday...'
          },
          {
            document_name: 'witness_2.pdf',
            page: 5,
            excerpt: '...saw White KIA leaving scene 5 days before...'
          },
          {
            document_name: 'financial.xlsx',
            page: 47,
            excerpt: 'Wife purchased White KIA, 2022'
          }
        ]
      })

      addAISuggestion({
        id: 'suggestion-2',
        suggestion_type: 'node',
        confidence: 0.72,
        data: {
          name: 'Daniela Muñoz',
          category: 'person'
        },
        evidence: [
          {
            document_name: 'case_file.pdf',
            page: 12,
            excerpt: 'Daniela Muñoz, attorney, mentioned as associate of Hermosilla'
          }
        ]
      })
    }, 2000)
  }, [boardId])

  return <Canvas />
}
