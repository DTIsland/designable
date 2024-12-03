import React, { useMemo } from 'react'
import { createForm, IFormProps } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { Form as FormilyForm } from '@formily/core/esm/models'
import {
  Form,
  FormItem,
  DatePicker,
  Checkbox,
  Cascader,
  Editable,
  Input,
  NumberPicker,
  Switch,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
  ArrayCards,
  IUploadProps,
} from '@formily/antd-v5'
import { Card, Slider, Row, Col, Rate } from 'antd'
import { TreeNode } from '@didesignable/core'
import { transformToSchema } from '@didesignable/formily-transformer'
import { Report, ReportRow, ReportCol } from '../components/Report/component'

const Text: React.FC<{
  value?: string
  content?: string
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode
  return React.createElement(tagName, props, value || content)
}

export interface IPreviewWidgetProps {
  tree: TreeNode
  formProps?: IFormProps
  uploadProps?: IUploadProps
  formRef?: (form: FormilyForm<any>) => void
}

export const PreviewWidget: React.FC<IPreviewWidgetProps> = (props) => {
  const form = useMemo(() => createForm(props.formProps), [])
  const { form: formProps, schema } = transformToSchema(props.tree)
  if (props.formRef) {
    props.formRef(form)
  }

  Upload.defaultProps = {
    ...props.uploadProps,
  }

  const SchemaField = createSchemaField({
    components: {
      Space,
      FormGrid,
      FormLayout,
      FormTab,
      FormCollapse,
      ArrayTable,
      ArrayCards,
      FormItem,
      DatePicker,
      Checkbox,
      Cascader,
      Editable,
      Input,
      Text,
      NumberPicker,
      Switch,
      Password,
      PreviewText,
      Radio,
      Reset,
      Select,
      Submit,
      TimePicker,
      Transfer,
      TreeSelect,
      Upload,
      Card,
      Slider,
      Row,
      Col,
      Report,
      ReportRow,
      ReportCol,
      Rate,
    },
  })

  return (
    <Form {...formProps} form={form}>
      <SchemaField schema={schema} />
    </Form>
  )
}
