import React, { useMemo } from 'react'
import {
  Designer,
  DesignerToolsWidget,
  ViewToolsWidget,
  Workspace,
  OutlineTreeWidget,
  ResourceWidget,
  SimpleResourceWidget,
  HistoryWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  SourceBarPanel,
  ComponentTreeWidget,
} from '@didesignable/react'
import {
  SettingsForm,
  setNpmCDNRegistry,
} from '@didesignable/react-settings-form'
import {
  createDesigner,
  GlobalRegistry,
  Shortcut,
  KeyCode,
} from '@didesignable/core'
import {
  LogoWidget,
  ActionsWidget,
  PreviewWidget,
  SchemaEditorWidget,
  MarkupSchemaWidget,
} from './widgets'
import { saveSchema } from './service'
import {
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
  NumberPicker,
  Transfer,
  Password,
  DatePicker,
  TimePicker,
  Upload,
  Switch,
  Text,
  Card,
  ArrayCards,
  ObjectContainer,
  ArrayTable,
  Space,
  FormTab,
  FormCollapse,
  FormLayout,
  FormGrid,
} from '../src'

import dayjs from 'dayjs'
import {
  Button,
  Col,
  ConfigProvider,
  Dropdown,
  MenuProps,
  Row,
  Tabs,
} from 'antd'

setNpmCDNRegistry('//unpkg.com')

import '../src/theme.css'
import 'dayjs/locale/zh-cn'
import './styles.css'
import zhCN from 'antd/locale/zh_CN'
import { DownOutlined, ItalicOutlined } from '@ant-design/icons'

dayjs.locale('zh-cn')

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Layouts: '布局组件',
      Arrays: '自增组件',
      Displays: '展示组件',
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Layouts: 'Layouts',
      Arrays: 'Arrays',
      Displays: 'Displays',
    },
  },
  'ko-KR': {
    sources: {
      Inputs: '입력',
      Layouts: '레이아웃',
      Arrays: '배열',
      Displays: '디스플레이',
    },
  },
})

const App = () => {
  const engine = useMemo(
    () =>
      createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              saveSchema(ctx.engine)
            },
          }),
        ],
        rootComponentName: 'Form',
      }),
    []
  )

  const tabItems = [
    {
      label: '属性',
      key: '1',
      children: (
        <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
      ),
    },
    {
      key: '2',
      label: '事件',
      children: 'Content of Tab Pane 2',
    },
  ]

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        cssVar: {
          key: 'ant',
        },
      }}
    >
      <Designer engine={engine}>
        <StudioPanel
          logo={null}
          actions={null}
          style={{
            flexDirection: 'column',
          }}
        >
          <Row
            style={{
              height: '58px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SourceBarPanel
              style={{
                display: 'flex',
              }}
            >
              <SimpleResourceWidget
                sources={[
                  Rate,
                  Slider,
                  Select,
                  TreeSelect,
                  Cascader,
                  Transfer,
                  Checkbox,
                  Radio,
                  DatePicker,
                  TimePicker,
                  Upload,
                  Switch,
                  ObjectContainer,
                ]}
              />
            </SourceBarPanel>
            <Dropdown
              dropdownRender={() => {
                return (
                  <div
                    style={{
                      background: '#fff',
                      padding: '8px 32px',
                      border: '1px solid #f0f0f0',
                    }}
                  >
                    <SimpleResourceWidget
                      className="dropdownResource"
                      sources={[Input, Password]}
                    />
                  </div>
                )
              }}
              placement="bottom"
            >
              <ItalicOutlined />
            </Dropdown>
          </Row>
          <Row
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
            <Workspace id="form">
              <WorkspacePanel>
                <ToolbarPanel>
                  <DesignerToolsWidget />
                  <ViewToolsWidget use={['DESIGNABLE', 'PREVIEW']} />
                </ToolbarPanel>
                <ViewportPanel style={{ height: '100%' }}>
                  <ViewPanel type="DESIGNABLE">
                    {() => (
                      <ComponentTreeWidget
                        components={{
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
                          NumberPicker,
                          Transfer,
                          Password,
                          DatePicker,
                          TimePicker,
                          Upload,
                          Switch,
                          Text,
                          Card,
                          ArrayCards,
                          ArrayTable,
                          Space,
                          FormTab,
                          FormCollapse,
                          FormGrid,
                          FormLayout,
                          ObjectContainer,
                        }}
                      />
                    )}
                  </ViewPanel>
                  <ViewPanel type="JSONTREE" scrollable={false}>
                    {(tree, onChange) => (
                      <SchemaEditorWidget tree={tree} onChange={onChange} />
                    )}
                  </ViewPanel>
                  <ViewPanel type="MARKUP" scrollable={false}>
                    {(tree) => <MarkupSchemaWidget tree={tree} />}
                  </ViewPanel>
                  <ViewPanel type="PREVIEW">
                    {(tree) => <PreviewWidget tree={tree} />}
                  </ViewPanel>
                </ViewportPanel>
              </WorkspacePanel>
            </Workspace>
            <div
              style={{
                // flex-grow: 0;
                // flex-shrink: 0;
                // position: relative;
                // display: flex;
                // flex-direction: column;
                // z-index: 2;
                // width: 300px;
                // background: var(--dn-composite-panel-tabs-content-bg-color);
                // border-left: 1px solid var(--dn-panel-border-color);
                // height: 100%;
                // box-sizing: content-box;
                // -webkit-user-select: none;
                // -moz-user-select: none;
                // user-select: none;
                // transform to react style
                width: '300px',
                background: 'var(--dn-composite-panel-tabs-content-bg-color)',
                borderLeft: '1px solid var(--dn-panel-border-color)',
                height: '100%',
                boxSizing: 'content-box',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                userSelect: 'none',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 0,
                flexShrink: 0,
                position: 'relative',
              }}
            >
              <Tabs items={tabItems} />
            </div>
            {/* <SettingsPanel title="panels.PropertySettings">
            </SettingsPanel> */}
          </Row>
        </StudioPanel>
      </Designer>
    </ConfigProvider>
  )
}

export default App
