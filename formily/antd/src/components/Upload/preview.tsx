import React from 'react'
import { Upload as FormilyUpload } from '@formily/antd-v5'
import { createBehavior, createResource } from '@didesignable/core'
import { DnFC } from '@didesignable/react'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { FileImageOutlined } from '@ant-design/icons'

export const Upload: DnFC<React.ComponentProps<typeof FormilyUpload>> =
  FormilyUpload

export const SimpleUpload: DnFC<React.ComponentProps<typeof FormilyUpload>> =
  FormilyUpload

const UploadBehavior = {
  name: 'Upload',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Upload',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Upload),
  },
  designerLocales: AllLocales.Upload,
}

const UploadDraggerBehavior = {
  name: 'Upload.Dragger',
  extends: ['Field'],
  selector: (node) => node.props['x-component'] === 'Upload.Dragger',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Upload.Dragger),
  },
  designerLocales: AllLocales.UploadDragger,
}

const UploadResource = {
  icon: 'UploadSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'Array<object>',
        title: 'Upload',
        'x-decorator': 'FormItem',
        'x-component': 'Upload',
        'x-component-props': {
          textContent: 'Upload',
        },
      },
    },
  ],
}

const UploadDraggerSource = {
  icon: 'UploadDraggerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'Array<object>',
        title: 'Drag Upload',
        'x-decorator': 'FormItem',
        'x-component': 'Upload.Dragger',
        'x-component-props': {
          textContent: 'Click or drag file to this area to upload',
        },
      },
    },
  ],
}

Upload.Behavior = createBehavior(UploadBehavior, UploadDraggerBehavior)

Upload.Resource = createResource(UploadResource, UploadDraggerSource)

SimpleUpload.Behavior = createBehavior(UploadBehavior)

SimpleUpload.Resource = createResource({
  ...UploadResource,
  icon: <FileImageOutlined />,
})
