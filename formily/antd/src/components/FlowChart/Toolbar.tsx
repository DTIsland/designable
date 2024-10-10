import React from 'react'
import './styles.less'

export const FlowChartToolbar: React.FC<{}> = () => {
  return (
    <div className="flowchart-toolbar">
      <div className="shape rect">长方形</div>
      <div className="shape circle">圆形</div>
      <div className="shape polygon">多边形</div>
    </div>
  )
}
