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
  data: PageDataType
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
  data: PageDataType
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
    let data = {
      formData: {},
      flowchartData: {
        nodes: [],
        edges: [],
      },
    }
    if (engine) {
      data.formData = transformToSchema(engine.getCurrentTree())
    }
    if (flowChartEngine) {
      data.flowchartData.nodes = flowChartEngine.getNodes()
      data.flowchartData.edges = flowChartEngine.getEdges()
    }
    this.data = data
    return data
  }

  setData = (data: PageDataType) => {
    this.setFormSchema(data.formData)
    this.setFlowChartData(data.flowchartData)
    this.data = data
  }

  setFormSchema = (schema: IFormilySchema) => {
    const { engine } = this
    if (engine) {
      engine.setCurrentTree(transformToTreeNode(schema))
    }
  }

  setFlowChartData = (data: IFlowChartData) => {
    const { flowChartEngine } = this
    if (flowChartEngine) {
      flowChartEngine.clearCells()
      flowChartEngine.addNodes(data.nodes)
      flowChartEngine.addEdges(data.edges)
    }
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

  onFlowChartChange = () => {
    // this.setFlowChartData(data)
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
              data: this.data,
            }}
          >
            {children}
          </PageEditorContext.Provider>
        </Designer>
      </div>
    )
  }
}
