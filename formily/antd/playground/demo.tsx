import React from 'react'
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import {
  Form,
  FormItem,
  FormLayout,
  FormButtonGroup,
  Submit,
} from '@formily/antd-v5'
import { Card, Button, Alert, Typography } from 'antd'
import { RichTextEditor } from '../src'

const { Title, Paragraph, Text } = Typography

const form = createForm()

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormLayout,
    RichTextEditor,
  },
})

export default () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card title="RichTextEditor 功能演示" style={{ marginBottom: '20px' }}>
        <Alert
          message="Excel 表格粘贴功能说明"
          description={
            <div>
              <Paragraph>
                <Text strong>如何使用 Excel 表格粘贴功能：</Text>
              </Paragraph>
              <Paragraph>
                1. 在 Excel 中选择要复制的表格数据
                <br />
                2. 使用 Ctrl+C 复制
                <br />
                3. 在富文本编辑器中使用 Ctrl+V 粘贴
                <br />
                4. 表格样式（边框、背景色、对齐方式等）会被自动保留
              </Paragraph>
              <Paragraph>
                <Text type="success">支持的样式：</Text>{' '}
                单元格边框、背景颜色、文本对齐、垂直对齐、单元格合并、列宽、行高等
              </Paragraph>
              <Paragraph>
                <Text type="warning">表头增强功能：</Text>
                <br />• 自动检测并转换表头行（包含粗体文本或特殊背景色的第一行）
                <br />• 智能 td 到 th 的转换，保持所有原有属性
                <br />• 多级表头支持（colspan/rowspan）
                <br />• 表头默认居中对齐和加粗样式
                <br />• 深色背景下的对比度优化
              </Paragraph>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Form form={form} layout="vertical" onAutoSubmit={console.log}>
          <SchemaField>
            <SchemaField.String
              name="basicEditor"
              title="基础编辑器"
              x-decorator="FormItem"
              x-component="RichTextEditor"
              x-component-props={{
                toolbar: 'basic',
                placeholder: '请输入基础内容...',
                height: 200,
              }}
            />

            <SchemaField.String
              name="standardEditor"
              title="标准编辑器（带字数统计）"
              x-decorator="FormItem"
              x-component="RichTextEditor"
              x-component-props={{
                toolbar: 'standard',
                placeholder: '请输入标准内容...',
                height: 250,
                showWordCount: true,
                maxLength: 1000,
              }}
            />

            <SchemaField.String
              name="fullEditor"
              title="完整编辑器（支持Excel表格粘贴）"
              x-decorator="FormItem"
              x-component="RichTextEditor"
              description="尝试从Excel复制表格然后粘贴到编辑器中，样式会被保留"
              x-component-props={{
                toolbar: 'full',
                placeholder: '请输入完整内容... 支持粘贴Excel表格',
                height: 300,
                showWordCount: true,
                autoSave: true,
                autoSaveInterval: 5000,
                onAutoSave: (content: string) => {
                  console.log('自动保存:', content)
                },
                debug: true,
              }}
            />

            <SchemaField.String
              name="tableEditor"
              title="表格专用编辑器"
              x-decorator="FormItem"
              x-component="RichTextEditor"
              description="专门用于处理表格数据，包含完整的表格编辑功能"
              default={`
                <table style="border-collapse: collapse; width: 100%;">
                  <thead>
                    <tr>
                      <th colspan="2" style="border: 1px solid #d9d9d9; padding: 8px; background: #e6f7ff; text-align: center; font-weight: bold;">基本信息</th>
                      <th colspan="2" style="border: 1px solid #d9d9d9; padding: 8px; background: #f6ffed; text-align: center; font-weight: bold;">工作信息</th>
                    </tr>
                    <tr>
                      <th style="border: 1px solid #d9d9d9; padding: 8px; background: #f5f5f5; text-align: center; font-weight: bold;">姓名</th>
                      <th style="border: 1px solid #d9d9d9; padding: 8px; background: #f5f5f5; text-align: center; font-weight: bold;">年龄</th>
                      <th style="border: 1px solid #d9d9d9; padding: 8px; background: #f5f5f5; text-align: center; font-weight: bold;">职位</th>
                      <th style="border: 1px solid #d9d9d9; padding: 8px; background: #f5f5f5; text-align: center; font-weight: bold;">薪资</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="border: 1px solid #d9d9d9; padding: 8px;">张三</td>
                      <td style="border: 1px solid #d9d9d9; padding: 8px; text-align: center;">25</td>
                      <td style="border: 1px solid #d9d9d9; padding: 8px;">前端工程师</td>
                      <td style="border: 1px solid #d9d9d9; padding: 8px; text-align: right; color: #52c41a; font-weight: bold;">¥15,000</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #d9d9d9; padding: 8px;">李四</td>
                      <td style="border: 1px solid #d9d9d9; padding: 8px; text-align: center;">28</td>
                      <td style="border: 1px solid #d9d9d9; padding: 8px;">后端工程师</td>
                      <td style="border: 1px solid #d9d9d9; padding: 8px; text-align: right; color: #52c41a; font-weight: bold;">¥18,000</td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #d9d9d9; padding: 8px;">王五</td>
                      <td style="border: 1px solid #d9d9d9; padding: 8px; text-align: center;">30</td>
                      <td style="border: 1px solid #d9d9d9; padding: 8px;">架构师</td>
                      <td style="border: 1px solid #d9d9d9; padding: 8px; text-align: right; color: #52c41a; font-weight: bold;">¥25,000</td>
                    </tr>
                  </tbody>
                </table>
              `}
              x-component-props={{
                toolbar: 'custom',
                customToolbar: [
                  'undo',
                  'redo',
                  '|',
                  'bold',
                  'italic',
                  'underline',
                  '|',
                  'insertTable',
                  'tableColumn',
                  'tableRow',
                  'mergeTableCells',
                  '|',
                  'removeFormat',
                ],
                placeholder: '专用于表格编辑...',
                height: 350,
                debug: true,
              }}
            />

            <SchemaField.String
              name="customEditor"
              title="自定义工具栏编辑器"
              x-decorator="FormItem"
              x-component="RichTextEditor"
              x-component-props={{
                toolbar: 'custom',
                customToolbar: [
                  'bold',
                  'italic',
                  'underline',
                  '|',
                  'link',
                  'imageUpload',
                  '|',
                  'bulletedList',
                  'numberedList',
                  '|',
                  'undo',
                  'redo',
                ],
                placeholder: '自定义工具栏...',
                height: 200,
                language: 'zh-cn',
              }}
            />

            <SchemaField.String
              name="readonlyEditor"
              title="只读编辑器"
              default="<p>这是只读内容，<strong>不能编辑</strong>。</p>"
              x-decorator="FormItem"
              x-component="RichTextEditor"
              x-component-props={{
                readOnly: true,
                height: 150,
              }}
            />
          </SchemaField>

          <FormButtonGroup>
            <Submit onSubmit={console.log}>提交表单</Submit>
            <Button
              onClick={() => {
                console.log('当前表单值:', form.values)
              }}
            >
              查看表单值
            </Button>
          </FormButtonGroup>
        </Form>
      </Card>
    </div>
  )
}
