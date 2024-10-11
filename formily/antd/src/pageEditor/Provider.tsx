import { Designer } from '@didesignable/react'
import React, { createContext } from 'react'
import { createDesigner, Engine, KeyCode, Shortcut } from '@didesignable/core'
import classNames from 'classnames'
import 'dayjs/locale/zh-cn'
import './styles.less'
import { IFlowChartData } from '../components/FlowChart'
import {
  IFormilySchema,
  transformToSchema,
  transformToTreeNode,
} from '@didesignable/formily-transformer'
import { Graph } from '@antv/x6'
import { FormInstance } from 'antd'

export type PageEditorType = 'form' | 'flowchart'
export type PageEditorMode = 'edit' | 'view'

export type PageDataType = {
  flowchartData: IFlowChartData
  formData: IFormilySchema
}

export interface PageEngineCtx {
  pageType: PageEditorType
  formEngine: Engine
  formInstance: FormInstance<any>
  flowchartEngine: Graph
  getData: () => PageDataType
  setData: (data: PageDataType) => void
  initGraphRef: (graph: Graph) => void
  initFormInstance: (form: FormInstance<any>) => void
  onSwitchPageType?: () => void
}

export interface IPageEditorProps {
  children?: React.ReactNode | Element
  className?: string
}

export const PageEditorContext = createContext({} as PageEngineCtx)

export class PageEditorProvider extends React.Component<IPageEditorProps> {
  engine: Engine
  flowChartEngine: Graph
  formInstance: FormInstance<any>
  state: Readonly<{
    mode: PageEditorMode
    pageType: PageEditorType
  }>

  constructor(props) {
    super(props)
    this.state = {
      mode: 'edit',
      pageType: 'form',
    }
    this.init()
  }

  init = () => {
    this.engine = createDesigner({
      shortcuts: [
        new Shortcut({
          codes: [
            [KeyCode.Meta, KeyCode.S],
            [KeyCode.Control, KeyCode.S],
          ],
        }),
      ],
      rootComponentName: 'Form',
    })
  }

  getData = (): PageDataType => {
    const { engine, flowChartEngine } = this
    return {
      flowchartData: {
        nodes: flowChartEngine.getNodes(),
        edges: flowChartEngine.getEdges(),
      },
      formData: transformToSchema(engine.getCurrentTree()),
    }
  }

  setData = (data: PageDataType) => {
    const { engine, flowChartEngine } = this
    engine.setCurrentTree(transformToTreeNode(data.formData))
    flowChartEngine.clearCells()
    flowChartEngine.addNodes(data.flowchartData.nodes)
    flowChartEngine.addEdges(data.flowchartData.edges)
  }

  onSwitchPageType = () => {
    const value = this.state.pageType === 'flowchart' ? 'form' : 'flowchart'
    this.setState({
      pageType: value,
    })
  }

  initGraphRef = (graph: Graph) => {
    this.flowChartEngine = graph
  }

  initFormInstance = (form: FormInstance<any>) => {
    this.formInstance = form
  }

  render() {
    const { className, children } = this.props
    const { engine } = this
    const { pageType } = this.state

    return (
      <div className={classNames('pageEditor', className)}>
        <Designer engine={engine}>
          <PageEditorContext.Provider
            value={{
              pageType: pageType,
              formInstance: this.formInstance,
              formEngine: this.engine,
              flowchartEngine: this.flowChartEngine,
              getData: this.getData,
              setData: this.setData,
              initGraphRef: this.initGraphRef,
              initFormInstance: this.initFormInstance,
              onSwitchPageType: this.onSwitchPageType,
            }}
          >
            {children}
          </PageEditorContext.Provider>
        </Designer>
      </div>
    )
  }
}
