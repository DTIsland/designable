import React, { useEffect, useRef } from 'react'
import './styles.less'
import Quill from 'quill'
import type { InputProps as AntdInputProps } from 'antd'
import classNames from 'classnames'
import { QuillOptions } from 'quill'
import { connect, mapProps } from '@formily/react'
import { LoadingOutlined } from '@ant-design/icons'

interface EditorProps extends AntdInputProps {
  options?: QuillOptions
}

export const Editor: React.FC<EditorProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill>(null)
  const clas = classNames('rich-text-editor', props.className)

  useEffect(() => {
    if (containerRef.current) {
      quillRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
          ],
        },
        ...props.options,
      })

      quillRef.current.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') {
          const text = quillRef.current?.getText()
          props.onChange?.({
            target: {
              name: props.name,
              value: text,
            },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      })
    }
  }, [])

  return <div className={clas} ref={containerRef}></div>
}

export const InternalEditor: React.FC<EditorProps> = connect(
  Editor,
  mapProps((props, field) => {
    return {
      ...props,
      suffix: (
        <span>
          {field?.['loading'] || field?.['validating'] ? (
            <LoadingOutlined />
          ) : (
            props.suffix
          )}
        </span>
      ),
    }
  })
  // mapReadPretty((props, field) => {
  //     return <span>{field.value}</span>
  // })
)

export default Editor
