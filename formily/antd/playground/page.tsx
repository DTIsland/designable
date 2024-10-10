import React, { useEffect, useRef } from 'react'

import { Button, ConfigProvider, Divider, Space } from 'antd'
import zhCN from 'antd/locale/zh_CN'

import { PageEditor, PageEngineCtx } from '../src/pageEditor'
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
  ObjectContainer,
  ArrayTable,
  FormLayout,
  FormGrid,
} from '../src/components'

;(Text as any).Resource[0].showTitle = false
;(SimpleUpload as any).Resource[0].showTitle = false
;(ArrayTable as any).Resource[0].showTitle = false

export const Page: React.FC<{}> = () => {
  const pageEditorRef = useRef<PageEngineCtx | undefined>()

  const onSave = () => {
    if (pageEditorRef.current) {
      const data = pageEditorRef.current.getData()
      // saveSchema(pageEditorRef.current?.formEngine)
      savePage(data)
    }
  }

  const pageRef = (ref: PageEngineCtx) => {
    pageEditorRef.current = ref
  }

  const changeEditorMode = () => {}

  useEffect(() => {
    if (pageEditorRef.current) {
      loadInitialPage(pageEditorRef.current)
    }
  }, [])

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        cssVar: {
          key: 'ant',
        },
      }}
    >
      <Space
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span> Page Editor</span>
        <Button onClick={onSave}>Save</Button>
      </Space>
      <Divider />
      <div
        style={{
          position: 'absolute',
          top: 65,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <PageEditor
          pageRef={pageRef}
          onPageTypeChange={changeEditorMode}
          layoutWidgets={[FormLayout, FormGrid, ObjectContainer]}
          normalWidgets={[Text, SimpleUpload, ArrayTable]}
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
      </div>
    </ConfigProvider>
  )
}

export default Page
