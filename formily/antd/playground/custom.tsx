import React, { useMemo } from 'react'
import {
  Designer,
  DesignerToolsWidget,
  ViewToolsWidget,
  Workspace,
  OutlineTreeWidget,
  SimpleResourceWidget,
  StudioPanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  ViewPanel,
  SourceBarPanel,
  ComponentTreeWidget,
} from '@didesignable/react'
import { SettingsForm } from '@didesignable/react-settings-form'
import {
  createDesigner,
  GlobalRegistry,
  Shortcut,
  KeyCode,
} from '@didesignable/core'
import {
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
import { ConfigProvider, Dropdown, Row, Tabs } from 'antd'

import 'dayjs/locale/zh-cn'
import './styles.css'
import zhCN from 'antd/locale/zh_CN'
import { AppstoreOutlined, ItalicOutlined } from '@ant-design/icons'

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
      label: 'Outline',
      children: (
        <>
          <OutlineTreeWidget />
        </>
      ),
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
                        sources={[FormLayout, FormGrid, ObjectContainer]}
                      />
                    </div>
                  )
                }}
                placement="bottom"
              >
                <AppstoreOutlined />
              </Dropdown>
              <SimpleResourceWidget sources={[Text, Upload, ArrayTable]} />
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
                      sources={[
                        Input,
                        Password,
                        Select,
                        Checkbox,
                        Radio,
                        DatePicker,
                        TimePicker,
                      ]}
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
                          Text,
                          NumberPicker,
                          Transfer,
                          Password,
                          DatePicker,
                          TimePicker,
                          Upload,
                          Switch,
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
              <Tabs items={tabItems} type="card" />
            </div>
            {/* <SettingsPanel title="panels.PropertySettings">
              <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
            </SettingsPanel> */}
          </Row>
        </StudioPanel>
      </Designer>
    </ConfigProvider>
  )
}

export default App
