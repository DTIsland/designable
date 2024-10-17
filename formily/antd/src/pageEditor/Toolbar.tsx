import { IResourceLike } from '@didesignable/core'
import { SimpleResourceWidget, SourceBarPanel } from '@didesignable/react'
import React, { useContext } from 'react'
import './styles.less'

import { Dropdown, Tooltip } from 'antd'

import {
  FontSizeOutlined,
  LayoutOutlined,
  PartitionOutlined,
} from '@ant-design/icons'
import { PageEditorContext, PageEditorType } from './Provider'
import classNames from 'classnames'

export interface IPageEditorToolbarProps extends Partial<HTMLDivElement> {
  disableFlowChart?: boolean
  layoutWidgets: IResourceLike[]
  normalWidgets: IResourceLike[]
  formWidgets: IResourceLike[]
  toolbarRenderer?: () => React.ReactNode
  onPageTypeChange?: (type: PageEditorType) => void
}

export const PageEditorToolbar: React.FC<IPageEditorToolbarProps> = (props) => {
  const {
    toolbarRenderer,
    layoutWidgets,
    normalWidgets,
    formWidgets,
    disableFlowChart,
    className,
  } = props

  if (!layoutWidgets) {
    throw new Error('layoutWidgets is required')
  }
  if (!normalWidgets) {
    throw new Error('normalWidgets is required')
  }
  if (!formWidgets) {
    throw new Error('formWidgets is required')
  }

  const pageEditorCtx = useContext(PageEditorContext)
  const { pageType, onSwitchPageType } = pageEditorCtx
  const isFlowChartPage = pageType === 'flowchart'

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
            <LayoutOutlined
              className="form-resource-item form-resource-dropdown-item"
              style={{ marginRight: 20 }}
            />
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
            <FontSizeOutlined
              className="form-resource-item form-resource-dropdown-item"
              style={{ marginRight: 20 }}
            />
          </Tooltip>
        </Dropdown>
        {!disableFlowChart && (
          <Tooltip title={'流程图'}>
            <PartitionOutlined
              onClick={onSwitchPageType}
              className={classNames('form-resource-item', {
                active: isFlowChartPage,
              })}
            />
          </Tooltip>
        )}
      </>
    )
  }

  return (
    <div className={classNames('pageEditorHeader', className)}>
      {toolbarRenderer ? (
        toolbarRenderer()
      ) : (
        <SourceBarPanel
          style={{
            display: 'flex',
            fontSize: '18px',
          }}
        >
          {renderToolbar()}
        </SourceBarPanel>
      )}
    </div>
  )
}
