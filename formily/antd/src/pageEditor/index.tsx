import { Engine, IResourceLike, TreeNode } from '@didesignable/core'
import {
  ComponentTreeWidget,
  Designer,
  DesignerToolsWidget,
  OutlineTreeWidget,
  SimpleResourceWidget,
  SourceBarPanel,
  StudioPanel,
  TextWidget,
  ToolbarPanel,
  ViewPanel,
  ViewportPanel,
  ViewToolsWidget,
  Workspace,
  WorkspacePanel,
} from '@didesignable/react'
import React, { useEffect, useMemo } from 'react'
import { FlowChart, IFlowChartData } from '../components/FlowChart'
import './style.less'

import { SettingsForm } from '@didesignable/react-settings-form'

import {
  IFormilySchema,
  transformToSchema,
  transformToTreeNode,
} from '@didesignable/formily-transformer'

import { createDesigner, KeyCode, Shortcut } from '@didesignable/core'

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
  Upload,
} from '../components'

import { Dropdown, Form as MyForm, Row, Tabs, Tooltip } from 'antd'
import type { Tab } from 'rc-tabs/lib/interface'

import {
  FontSizeOutlined,
  LayoutOutlined,
  PartitionOutlined,
} from '@ant-design/icons'
import { PreviewWidget } from './PreviewWidget'

import { Graph } from '@antv/x6'
import classNames from 'classnames'
import 'dayjs/locale/zh-cn'
import { GraphSettingsForm } from '../components/FlowChart/SettingsForm'

export type PageEditorType = 'form' | 'flowchart'
export type PageEditorMode = 'edit' | 'view'

export type PageDataType = {
  flowchartData: IFlowChartData
  formData: IFormilySchema
}

export interface PageEngineCtx {
  formEngine: Engine
  flowchartEngine: Graph
  getData: () => PageDataType
  setData: (data: PageDataType) => void
  mode: PageEditorMode
}

export interface IPageEditorProps extends Partial<HTMLDivElement> {
  mode?: PageEditorMode
  id?: string
  pageTitle?: string | React.ReactNode
  data?: TreeNode | IFlowChartData
  extraTabs?: Tab[]
  layoutWidgets?: IResourceLike[]
  normalWidgets?: IResourceLike[]
  formWidgets?: IResourceLike[]
  uploadAction?: string
  pageRef?: (ref: PageEngineCtx) => void
  sourceWidgetsRenderer?: () => React.ReactNode
  onPageTypeChange?: (type: PageEditorType) => void
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
  FormGrid,
  FormLayout,
  ObjectContainer,
}

export const PageEditor: React.FC<IPageEditorProps> = (props) => {
  const {
    mode,
    uploadAction,
    sourceWidgetsRenderer,
    layoutWidgets,
    normalWidgets,
    formWidgets,
  } = props
  const [form] = MyForm.useForm()
  const graphInstance = React.useRef<Graph>()
  const [pageType, setPageType] = React.useState<PageEditorType>('form')

  const isFlowChartPage = pageType === 'flowchart'

  const onFlowChart = () => {
    const value = isFlowChartPage ? 'form' : 'flowchart'
    setPageType(value)
    props.onPageTypeChange?.(value)
  }

  const engine = useMemo(
    () =>
      createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {},
          }),
        ],
        rootComponentName: 'Form',
      }),
    []
  )

  const graphRef = (graph: Graph) => {
    if (props.pageRef) {
      const getData = (): PageDataType => {
        return {
          flowchartData: {
            nodes: graph.getNodes(),
            edges: graph.getEdges(),
          },
          formData: transformToSchema(engine.getCurrentTree()),
        }
      }

      const setData = (data: PageDataType) => {
        engine.setCurrentTree(transformToTreeNode(data.formData))
        graph.clearCells()
        graph.addNodes(data.flowchartData.nodes)
        graph.addEdges(data.flowchartData.edges)
      }

      props.pageRef({
        formEngine: engine,
        flowchartEngine: graph,
        getData,
        setData,
        mode,
      })
      graphInstance.current = graph
    }
  }

  const onFlowchartSelection = () => {
    const graph = graphInstance.current
    if (graph) {
      graph.on('selection:changed', () => {
        const selectedNodes = graph
          .getSelectedCells()
          .filter((cell) => cell.isNode())
        if (selectedNodes.length === 1) {
          const node = selectedNodes[0]
          const fill = node.attr('body/fill')
          const fontSize = node.attr('text/fontSize')
          const fontColor = node.attr('text/fill')
          const borderColor = node.attr('body/stroke')
          form.setFieldsValue({
            backgroundColor: fill,
            fontSize: fontSize,
            fontColor: fontColor,
            borderColor: borderColor,
          })
        }
      })
    }
  }

  const onFieldsChange = (changedFields) => {
    const graph = graphInstance.current
    const selectedNodes = graph
      .getSelectedCells()
      .filter((cell) => cell.isNode())
    const filedName = changedFields[0].name[0]
    let attr = ''
    if (filedName === 'backgroundColor') {
      attr = 'body/fill'
    }
    if (filedName === 'fontSize') {
      attr = 'text/fontSize'
    }
    if (filedName === 'fontColor') {
      attr = 'text/fill'
    }
    if (filedName === 'borderColor') {
      attr = 'body/stroke'
    }

    selectedNodes.forEach((node) => {
      node.attr(`${attr}`, changedFields[0].value)
    })
  }

  let tabItems: Tab[] = [
    {
      label: '属性',
      key: '1',
      children: <SettingsForm uploadAction={uploadAction} />,
    },
    {
      key: '2',
      label: <TextWidget token="panels.OutlinedTree"></TextWidget>,
      children: (
        <>
          <OutlineTreeWidget />
        </>
      ),
    },
  ]

  if (isFlowChartPage) {
    tabItems = [
      {
        label: '属性',
        key: '1',
        children: (
          <GraphSettingsForm form={form} onFieldsChange={onFieldsChange} />
        ),
      },
    ]
  }

  if (props.extraTabs && props.extraTabs.length > 0) {
    tabItems = tabItems.concat(props.extraTabs)
  }

  useEffect(() => {
    onFlowchartSelection()
  }, [])

  const renderToolbar = () => {
    return (
      <>
        <Dropdown
          dropdownRender={() => {
            return (
              <div className="pageEditor-dropdown-wrapper">
                <SimpleResourceWidget
                  className="dropdownResource"
                  sources={layoutWidgets}
                />
              </div>
            )
          }}
          placement="bottom"
        >
          <Tooltip title={'布局组件'}>
            <LayoutOutlined className="form-resource-item form-resource-dropdown-item" />
          </Tooltip>
        </Dropdown>
        <SimpleResourceWidget sources={normalWidgets} />
        <Dropdown
          dropdownRender={() => {
            return (
              <div className="pageEditor-dropdown-wrapper">
                <SimpleResourceWidget
                  className="dropdownResource"
                  sources={formWidgets}
                />
              </div>
            )
          }}
          placement="bottom"
        >
          <Tooltip title={'表单组件'}>
            <FontSizeOutlined className="form-resource-item form-resource-dropdown-item" />
          </Tooltip>
        </Dropdown>
      </>
    )
  }

  return (
    <div className={'pageEditor'}>
      <Designer engine={engine}>
        <StudioPanel
          logo={null}
          actions={null}
          style={{
            flexDirection: 'column',
            position: 'absolute',
          }}
        >
          <Row
            className="pageEditorHeader"
            style={{
              height: '58px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {sourceWidgetsRenderer ? (
              sourceWidgetsRenderer()
            ) : (
              <SourceBarPanel
                style={{
                  display: 'flex',
                  gap: '20px',
                  fontSize: '18px',
                }}
              >
                {renderToolbar()}
                <Tooltip title={'流程图'}>
                  <PartitionOutlined
                    onClick={onFlowChart}
                    className={classNames('form-resource-item', {
                      active: isFlowChartPage,
                    })}
                  />
                </Tooltip>
              </SourceBarPanel>
            )}
          </Row>
          <Row
            className="pageEditorContent"
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              flex: '1',
              minHeight: '0',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div className="pageEditorContainer">
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
                      <ViewToolsWidget use={['DESIGNABLE', 'PREVIEW']} />
                    </ToolbarPanel>
                    <ViewportPanel style={{ height: '100%' }}>
                      <ViewPanel type="DESIGNABLE">
                        {() => (
                          <ComponentTreeWidget components={componentTree} />
                        )}
                      </ViewPanel>
                      <ViewPanel type="PREVIEW">
                        {(tree) => <PreviewWidget tree={tree} />}
                      </ViewPanel>
                    </ViewportPanel>
                  </WorkspacePanel>
                </Workspace>
              </div>
              <div
                style={{
                  display: isFlowChartPage ? 'flex' : 'none',
                  width: '100%',
                  height: '100%',
                }}
              >
                <FlowChart mode={mode} graphRef={graphRef} />
              </div>
            </div>
            <div className="pageEditorRightPanel">
              <Tabs
                items={tabItems}
                type="card"
                style={{
                  height: '100%',
                }}
              />
            </div>
          </Row>
        </StudioPanel>
      </Designer>
    </div>
  )
}
