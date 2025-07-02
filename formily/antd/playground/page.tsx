import React, { useContext, useEffect, useRef } from 'react'

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
  RichTextEditor,
} from '../src/components'
import { Engine, IEngineProps, KeyCode, Shortcut } from '@didesignable/core'
;(Text as any).Resource[0].showTitle = false
;(SimpleUpload as any).Resource[0].showTitle = false
;(ArrayTable as any).Resource[0].showTitle = false
;(Report as any).Resource[0].showTitle = false

// 为富文本编辑器启用调试模式
;(RichTextEditor as any).Resource[0].props = {
  ...(RichTextEditor as any).Resource[0].props,
  'x-component-props': {
    ...((RichTextEditor as any).Resource[0].props?.['x-component-props'] || {}),
    debug: true,
    placeholder: '请输入富文本内容...',
    height: 200,
  },
}

const PageEditor = () => {
  const pageEditorCtx = useContext(PageEditorContext)
  const richTextListeners = useRef(new Map()) // 存储富文本编辑器的监听器

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

  // 监听富文本编辑器内容变化的自定义处理器
  const handleRichTextContentChange = (nodeId: string, content: string) => {
    if (!pageEditorCtx?.formEngine) return

    const engine = pageEditorCtx.formEngine
    const node = engine.findNodeById(nodeId)

    if (node && node.props?.['x-component'] === 'RichTextEditor') {
      // 更新节点的 default 属性
      const newProps = {
        ...node.props,
        default: content,
      }

      // 设置节点属性
      node.setProps(newProps)

      console.log('富文本内容已同步到 default 属性:', {
        nodeId,
        content:
          content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        contentLength: content.length,
        nodeProps: newProps,
      })
    }
  }

  // 设置富文本编辑器的内容变化监听
  const setupRichTextContentListener = () => {
    // 监听所有富文本编辑器的变化
    const handleEditorChange = (event: any) => {
      const target = event.target
      const detail = event.detail

      console.log('接收到富文本编辑器变化事件:', {
        target,
        detail,
        nodeId: detail?.nodeId,
        contentLength: detail?.content?.length,
      })

      // 使用事件详情中的 nodeId 和 content
      if (detail?.nodeId && detail?.content !== undefined) {
        handleRichTextContentChange(detail.nodeId, detail.content)
      }
    }

    // 添加全局监听器
    document.addEventListener('richtexteditor:change', handleEditorChange)

    console.log('富文本编辑器全局事件监听器已设置')

    return () => {
      document.removeEventListener('richtexteditor:change', handleEditorChange)
      console.log('富文本编辑器全局事件监听器已清理')
    }
  }

  // 增强富文本编辑器组件以发送变化事件
  const enhanceRichTextEditor = () => {
    if (!pageEditorCtx?.formEngine) return

    const engine = pageEditorCtx.formEngine
    const nodeIdAttrName =
      engine.props.nodeIdAttrName || 'data-designer-node-id'

    console.log('设计器节点 ID 属性名:', nodeIdAttrName)

    // 监听 DOM 变化来检测新的富文本编辑器
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element

            // 查找富文本编辑器
            const ckEditors = element.querySelectorAll('.ck.ck-editor')
            ckEditors.forEach((editorElement) => {
              const nodeElement = editorElement.closest(`[${nodeIdAttrName}]`)
              if (nodeElement) {
                const nodeId = nodeElement.getAttribute(nodeIdAttrName)
                if (nodeId && !richTextListeners.current.has(nodeId)) {
                  console.log('发现新的富文本编辑器:', {
                    nodeId,
                    editorElement,
                  })
                  setupEditorListener(editorElement, nodeId)
                }
              }
            })
          }
        })
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    console.log('富文本编辑器 DOM 观察器已启动')

    return () => {
      observer.disconnect()
      console.log('富文本编辑器 DOM 观察器已断开')
    }
  }

  // 为特定编辑器设置监听器
  const setupEditorListener = (editorElement: Element, nodeId: string) => {
    const editableElement = editorElement.querySelector('.ck-editor__editable')
    if (!editableElement) {
      console.warn('未找到可编辑元素:', { nodeId, editorElement })
      return
    }

    console.log('为富文本编辑器设置监听器:', { nodeId, editableElement })

    const handleInput = () => {
      // 获取编辑器内容
      const content = (editableElement as HTMLElement).innerHTML

      console.log('富文本编辑器输入事件:', {
        nodeId,
        contentLength: content.length,
        content:
          content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      })

      // 触发自定义事件
      const event = new CustomEvent('richtexteditor:change', {
        detail: { nodeId, content },
        bubbles: true,
      })
      editableElement.dispatchEvent(event)
    }

    // 监听输入事件
    editableElement.addEventListener('input', handleInput)
    editableElement.addEventListener('paste', handleInput)
    editableElement.addEventListener('keyup', handleInput)

    // 存储监听器以便清理
    const cleanup = () => {
      editableElement.removeEventListener('input', handleInput)
      editableElement.removeEventListener('paste', handleInput)
      editableElement.removeEventListener('keyup', handleInput)
      console.log('富文本编辑器监听器已清理:', nodeId)
    }

    richTextListeners.current.set(nodeId, cleanup)
  }

  useEffect(() => {
    if (pageEditorCtx) {
      loadInitialPage(pageEditorCtx)

      // 设置富文本监听器
      const unsubscribeContentChange = setupRichTextContentListener()
      const unsubscribeDOMObserver = enhanceRichTextEditor()

      return () => {
        // 清理所有监听器
        unsubscribeContentChange?.()
        unsubscribeDOMObserver?.()

        // 清理富文本编辑器监听器
        richTextListeners.current.forEach((cleanup) => cleanup())
        richTextListeners.current.clear()
      }
    }
  }, [pageEditorCtx])

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
            RichTextEditor,
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
  const engineProps: IEngineProps<Engine> = {
    shortcuts: [
      new Shortcut({
        codes: [
          [KeyCode.Meta, KeyCode.S],
          [KeyCode.Control, KeyCode.S],
        ],
        // handler(ctx) {
        // },
      }),
    ],
    // effects: [(a) => {
    //   console.log('effects', a)
    // }],
  }

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        cssVar: {
          key: 'ant',
        },
      }}
    >
      <PageEditorProvider engineProps={engineProps}>
        <PageEditor />
      </PageEditorProvider>
    </ConfigProvider>
  )
}

export default Page
