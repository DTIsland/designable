import React, { useState } from 'react'
import { Card, Space, Typography, Divider } from 'antd'
import { RichTextEditor } from '../src'

const { Title, Text } = Typography

export const AlignmentDemo: React.FC = () => {
  const [content1, setContent1] = useState(`
    <h2>对齐工具演示</h2>
    <p class="custom-align-left">这是左对齐的段落文本。</p>
    <p class="custom-align-center">这是居中对齐的段落文本。</p>
    <p class="custom-align-right">这是右对齐的段落文本。</p>
    <p class="custom-align-justify">这是两端对齐的段落文本，当文本内容比较长时，两端对齐可以让文本在行的两端对齐，中间的空白均匀分布。</p>
  `)

  const [content2, setContent2] = useState(`
    <h3>表格对齐演示</h3>
    <table class="custom-align-center">
      <thead>
        <tr>
          <th class="custom-align-left">产品名称</th>
          <th class="custom-align-center">价格</th>
          <th class="custom-align-right">数量</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="custom-align-left">苹果</td>
          <td class="custom-align-center">￥5.00</td>
          <td class="custom-align-right">10</td>
        </tr>
        <tr>
          <td class="custom-align-left">香蕉</td>
          <td class="custom-align-center">￥3.00</td>
          <td class="custom-align-right">20</td>
        </tr>
      </tbody>
    </table>
  `)

  const [content3, setContent3] = useState('')

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={1}>富文本编辑器 - 内置对齐工具演示</Title>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 基础对齐工具演示 */}
        <Card title="基础对齐工具">
          <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
            启用 enableTableAlignment
            后，工具栏会显示对齐工具下拉菜单，可以对文本和表格进行对齐操作。
          </Text>
          <RichTextEditor
            value={content1}
            onChange={setContent1}
            height={300}
            toolbar="standard"
            enableTableAlignment={true}
            alignmentOptions={['left', 'center', 'right', 'justify']}
            debug={true}
          />
        </Card>

        {/* 表格对齐演示 */}
        <Card title="表格对齐演示">
          <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
            在表格上下文工具栏中包含对齐按钮，可以快速对表格单元格内容进行对齐。
          </Text>
          <RichTextEditor
            value={content2}
            onChange={setContent2}
            height={300}
            toolbar="full"
            enableTableAlignment={true}
            alignmentOptions={['left', 'center', 'right']}
            debug={true}
          />
        </Card>

        {/* 自由编辑演示 */}
        <Card title="自由编辑测试">
          <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
            在这里您可以自由测试对齐功能：
            <br />• 选中文本或段落，使用工具栏的对齐按钮
            <br />• 插入表格，选中表格或单元格进行对齐
            <br />• 在表格内右键查看上下文工具栏
          </Text>
          <RichTextEditor
            value={content3}
            onChange={setContent3}
            height={400}
            toolbar="full"
            enableTableAlignment={true}
            alignmentOptions={['left', 'center', 'right', 'justify']}
            placeholder="在这里开始编辑，测试对齐功能..."
            debug={true}
          />
        </Card>

        <Divider />

        {/* 使用说明 */}
        <Card title="使用说明">
          <Space direction="vertical" size="small">
            <Title level={4}>基本用法：</Title>
            <Text>
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                }}
              >
                {`<RichTextEditor
  enableTableAlignment={true}
  alignmentOptions={['left', 'center', 'right', 'justify']}
/>`}
              </pre>
            </Text>

            <Title level={4}>属性说明：</Title>
            {/* <ul>
              <li>
                <Text code>enableTableAlignment</Text>: 启用表格对齐工具
              </li>
              <li>
                <Text code>alignmentOptions</Text>: 可用的对齐选项 ['left',
                'center', 'right', 'justify']
              </li>
            </ul> */}

            <Title level={4}>功能特性：</Title>
            <ul>
              <li>支持文本段落对齐（左对齐、居中、右对齐、两端对齐）</li>
              <li>支持表格整体对齐</li>
              <li>支持表格单元格内容对齐</li>
              <li>直接在工具栏显示对齐按钮组</li>
              <li>样式在编辑模式和预览模式下都生效</li>
              <li>通过CSS类和内联样式实现，兼容性好</li>
              <li>无需依赖CKEditor的额外插件</li>
            </ul>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default AlignmentDemo
