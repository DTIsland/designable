import React, { useContext, useEffect } from 'react'

import { Button, Space, ConfigProvider, Divider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

import {
  PageEditorContext,
  PageEditorProvider,
  PageEditorRightPanel,
  PageEditorToolbar,
  PageEditorWorkbench,
} from '../src'
import { loadInitialPage, savePage } from './service'

import {
  Input,
  Select,
  Radio,
  Checkbox,
  NumberPicker,
  Password,
  DatePicker,
  TimePicker,
  SimpleUpload,
  Text,
  Space as SpaceLayout,
  ObjectContainer,
  ArrayTable,
  FormLayout,
  FormGrid,
  Report,
} from '../src/components'
;(Text as any).Resource[0].showTitle = false
;(SimpleUpload as any).Resource[0].showTitle = false
;(ArrayTable as any).Resource[0].showTitle = false
;(Report as any).Resource[0].showTitle = false

const PageEditor = () => {
  const pageEditorCtx = useContext(PageEditorContext)

  const onSave = () => {
    const data = pageEditorCtx.getData()
    if (data) {
      savePage(data)
    }
  }

  const switchPage = () => {
    if (pageEditorCtx) {
      pageEditorCtx.setPageType?.(
        pageEditorCtx.pageType === 'form' ? 'flowchart' : 'form'
      )
    }
  }

  useEffect(() => {
    if (pageEditorCtx) {
      loadInitialPage(pageEditorCtx)
    }
  }, [])

  return (
    <>
      <Space
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span> Page Editor</span>
        <Button onClick={onSave}>Save</Button>
        <Button onClick={switchPage}>切换</Button>
      </Space>
      <Divider />
      <div
        style={{
          position: 'absolute',
          top: 65,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PageEditorToolbar
          layoutWidgets={[FormLayout, SpaceLayout, FormGrid, ObjectContainer]}
          normalWidgets={[Text, SimpleUpload, ArrayTable, Report]}
          formWidgets={[
            Input,
            Password,
            NumberPicker,
            Select,
            Checkbox,
            Radio,
            DatePicker,
            TimePicker,
          ]}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flex: '1',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            gridTemplateColumns: 'auto 300px',
          }}
        >
          <PageEditorWorkbench />
          <PageEditorRightPanel />
        </div>
      </div>
    </>
  )
}

export const Page: React.FC<{}> = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        cssVar: {
          key: 'ant',
        },
      }}
    >
      <PageEditorProvider>
        <PageEditor />
      </PageEditorProvider>
    </ConfigProvider>
  )
}

export default Page
