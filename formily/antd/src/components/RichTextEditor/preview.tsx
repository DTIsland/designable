import React from 'react'
import { createBehavior, createResource } from '@didesignable/core'
import { DnFC } from '@didesignable/react'
import { createFieldSchema } from '../Field'
import { InternalEditor } from './editor'

export const RichTextEditor: DnFC<React.ComponentProps<typeof InternalEditor>> =
  InternalEditor

RichTextEditor.Behavior = createBehavior({
  name: 'RichTextEditor',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'RichTextEditor',
  designerProps: {
    propsSchema: createFieldSchema(),
  },
})

RichTextEditor.Resource = createResource({
  icon: 'TextSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'RichTextEditor',
        'x-decorator': 'FormItem',
        'x-component': 'RichTextEditor',
      },
    },
  ],
})

export default RichTextEditor
