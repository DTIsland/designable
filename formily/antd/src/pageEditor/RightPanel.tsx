import { OutlineTreeWidget, TextWidget } from '@didesignable/react'
import React, { useEffect } from 'react'
import './styles.less'

import { SettingsForm } from '@didesignable/react-settings-form'

import { Form, Tabs } from 'antd'
import type { Tab } from 'rc-tabs/lib/interface'

import classNames from 'classnames'
import 'dayjs/locale/zh-cn'
import { GraphSettingsForm } from '../components/FlowChart/SettingsForm'
import { PageEditorContext } from './Provider'
import { Report } from '../components'

export interface IPageEditorRightPanelProps extends Partial<HTMLDivElement> {
  extraTabs?: Tab[]
  uploadAction?: string
}

export const PageEditorRightPanel: React.FC<IPageEditorRightPanelProps> = (
  props
) => {
  const { uploadAction, extraTabs, className } = props

  const pageEditorCtx = React.useContext(PageEditorContext)
  const { pageType, flowchartEngine, initFormInstance } = pageEditorCtx

  const [form] = Form.useForm()

  const isFlowChartPage = pageType === 'flowchart'

  const onFieldsChange = (changedFields) => {
    const graph = flowchartEngine
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
      children: (
        <SettingsForm
          uploadAction={uploadAction}
          components={{
            Report,
          }}
        />
      ),
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

  if (extraTabs && extraTabs.length > 0) {
    tabItems = tabItems.concat(extraTabs)
  }

  useEffect(() => {
    initFormInstance(form)
  }, [form])

  return (
    <div className={classNames('pageEditorRightPanel', className)}>
      <Tabs
        items={tabItems}
        type="card"
        style={{
          height: '100%',
        }}
      />
    </div>
  )
}
