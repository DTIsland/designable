import {
  ComponentTreeWidget,
  DesignerToolsWidget,
  IDesignerComponents,
  ToolbarPanel,
  ViewPanel,
  ViewportPanel,
  ViewToolsWidget,
  Workspace,
  WorkspacePanel,
} from '@didesignable/react'
import React, { useContext, useEffect } from 'react'
import { FlowChart } from '../components/FlowChart'
import './styles.less'

import {
  ArrayCards,
  ArrayTable,
  Cascader,
  Checkbox,
  DatePicker,
  Field,
  Form,
  FormCollapse,
  FormGrid,
  FormLayout,
  FormTab,
  Input,
  NumberPicker,
  ObjectContainer,
  Password,
  Radio,
  Rate,
  Select,
  SimpleUpload,
  Slider,
  Space,
  Switch,
  Text,
  TimePicker,
  Transfer,
  TreeSelect,
  Report,
  Upload,
} from '../components'

import { PreviewWidget } from './PreviewWidget'

import { Graph } from '@antv/x6'
import classNames from 'classnames'
import 'dayjs/locale/zh-cn'
import { PageEditorContext } from './Provider'
import { SchemaEditorWidget } from './SchemaEditorWidget'
import { IUploadProps } from '@formily/antd-v5'

export interface IPageEditorWorkbenchProps extends Partial<HTMLDivElement> {
  className?: string
  componentSources?: IDesignerComponents
  previewUploadProps?: IUploadProps
}

const componentTree = {
  Form,
  Field,
  Input,
  Select,
  TreeSelect,
  Cascader,
  Radio,
  Checkbox,
  Slider,
  Rate,
  Text,
  NumberPicker,
  Transfer,
  Password,
  DatePicker,
  TimePicker,
  Upload,
  SimpleUpload,
  Switch,
  ArrayCards,
  ArrayTable,
  Space,
  FormTab,
  FormCollapse,
  Report,
  FormGrid,
  FormLayout,
  ObjectContainer,
}

export const PageEditorWorkbench: React.FC<IPageEditorWorkbenchProps> = (
  props
) => {
  const { className, componentSources, previewUploadProps } = props

  const pageEditorCtx = useContext(PageEditorContext)
  const { flowchartEngine, formInstance, pageType, initGraphRef } =
    pageEditorCtx

  const isFlowChartPage = pageType === 'flowchart'

  const graphRef = (graph: Graph) => {
    initGraphRef(graph)
  }

  const onFlowchartSelection = () => {
    if (flowchartEngine) {
      flowchartEngine.on('selection:changed', () => {
        const selectedNodes = flowchartEngine
          .getSelectedCells()
          .filter((cell) => cell.isNode())
        if (selectedNodes.length === 1) {
          const node = selectedNodes[0]
          const fill = node.attr('body/fill')
          const fontSize = node.attr('text/fontSize')
          const fontColor = node.attr('text/fill')
          const borderColor = node.attr('body/stroke')
          formInstance.setFieldsValue({
            backgroundColor: fill,
            fontSize: fontSize,
            fontColor: fontColor,
            borderColor: borderColor,
          })
        }
      })
    }
  }

  useEffect(() => {
    onFlowchartSelection()
  }, [])

  componentSources && Object.assign(componentTree, componentSources)

  return (
    <div className={classNames('pageEditorContainer', className)}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            display: !isFlowChartPage ? 'flex' : 'none',
            width: '100%',
            height: '100%',
          }}
        >
          <Workspace id="form">
            <WorkspacePanel>
              <ToolbarPanel>
                <DesignerToolsWidget />
                <ViewToolsWidget use={['DESIGNABLE', 'JSONTREE', 'PREVIEW']} />
              </ToolbarPanel>
              <ViewportPanel style={{ height: '100%' }}>
                <ViewPanel type="DESIGNABLE">
                  {() => <ComponentTreeWidget components={componentTree} />}
                </ViewPanel>
                <ViewPanel type="JSONTREE" scrollable={false}>
                  {(tree, onChange) => (
                    <SchemaEditorWidget tree={tree} onChange={onChange} />
                  )}
                </ViewPanel>
                <ViewPanel type="PREVIEW">
                  {(tree) => (
                    <PreviewWidget
                      tree={tree}
                      uploadProps={previewUploadProps}
                    />
                  )}
                </ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
          </Workspace>
        </div>
        <div
          style={{
            visibility: isFlowChartPage ? 'visible' : 'hidden', // use visibility instead of display to keep the graph state
            width: '100%',
            height: '100%',
          }}
        >
          <FlowChart graphRef={graphRef} />
        </div>
      </div>
    </div>
  )
}
