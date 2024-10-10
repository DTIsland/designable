import React from 'react'
import { ColorInput, SizeInput } from '@didesignable/react-settings-form'
import { Form, FormInstance } from 'antd'
import type { FieldData } from 'rc-field-form/es/interface'

import './styles.less'

export interface ISettingsFormProps extends Partial<HTMLDivElement> {
  form?: FormInstance
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void
}

// const shapeOptions = [
//   {
//     label: '矩形',
//     key: 'rect',
//     value: 'rect',
//   },
//   {
//     label: '圆形',
//     key: 'circle',
//     value: 'circle',
//   },
//   {
//     label: '多边形',
//     key: 'polygon',
//     value: 'polygon',
//   }
// ]

export const GraphSettingsForm: React.FC<ISettingsFormProps> = (props) => {
  return (
    <div
      className="flowchart-setting-from"
      style={{
        padding: ' 0 20px',
      }}
    >
      <Form
        className="dn-settings-form-wrapper"
        form={props.form}
        colon={false}
        onFieldsChange={props.onFieldsChange}
        labelAlign="left"
        initialValues={{
          shape: 'rect',
        }}
      >
        {/* <Form.Item
          colon={false}
          className="ant-formily-item"
          label="形状"
          name={'shape'}
        >
          <Select options={shapeOptions}/>
        </Form.Item> */}
        <Form.Item
          colon={false}
          className="ant-formily-item"
          label="背景颜色"
          name={'backgroundColor'}
        >
          <ColorInput />
        </Form.Item>
        <Form.Item
          colon={false}
          className="ant-formily-item"
          label="文本字号"
          name="fontSize"
        >
          <SizeInput value={10} onChange={() => {}} />
        </Form.Item>
        <Form.Item
          colon={false}
          className="ant-formily-item"
          label="字体颜色"
          name="fontColor"
        >
          <ColorInput />
        </Form.Item>
        <Form.Item
          colon={false}
          className="ant-formily-item"
          label="边框颜色"
          name="borderColor"
        >
          <ColorInput />
        </Form.Item>
      </Form>
    </div>
  )
}
