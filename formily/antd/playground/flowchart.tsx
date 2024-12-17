import React, { useRef } from 'react'
import { FlowChart } from '../src'
import { Graph } from '@antv/x6'

export const FlowChartDemo: React.FC<{}> = () => {
  const [data, setData] = React.useState({
    nodes: [],
    edges: [],
  })

  const graphRef = useRef<Graph>()

  const handleAddNode = () => {
    const node: any = {
      id: `${data.nodes.length}`,
      x: 100,
      y: 100,
      type: 'rect',
      size: [100, 100],
      color: '#FA8C16',
      label: 'rect',
    }
    setData({
      ...data,
      nodes: data.nodes.concat(node),
    })
  }

  const onChange = (data) => {
    setData(data)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '500px',
      }}
    >
      <FlowChart
        data={data}
        graphRef={(graph) => (graphRef.current = graph)}
        onChange={onChange}
      />
      <button onClick={handleAddNode}>Add Node</button>
    </div>
  )
}
