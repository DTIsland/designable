import { ISchema } from '@formily/react'

export const RichTextEditor: ISchema = {
  type: 'object',
  properties: {
    height: {
      type: 'number',
      title: '编辑器高度',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        defaultValue: 200,
        min: 100,
        max: 800,
        step: 10,
        addonAfter: 'px',
      },
    },
    toolbar: {
      type: 'string',
      title: '工具栏模式',
      enum: ['basic', 'standard', 'full', 'custom'],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        defaultValue: 'standard',
        optionType: 'button',
      },
    },
    placeholder: {
      type: 'string',
      title: '占位符文本',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入占位符文本',
      },
    },
    readOnly: {
      type: 'boolean',
      title: '只读模式',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    disabled: {
      type: 'boolean',
      title: '禁用状态',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    showWordCount: {
      type: 'boolean',
      title: '显示字数统计',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    maxLength: {
      type: 'number',
      title: '最大字符数',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        min: 0,
        step: 100,
        placeholder: '不限制',
      },
      'x-reactions': {
        dependencies: ['showWordCount'],
        fulfill: {
          state: {
            visible: '{{$deps[0]}}',
          },
        },
      },
    },
    language: {
      type: 'string',
      title: '语言设置',
      enum: [
        { label: '中文', value: 'zh-cn' },
        { label: 'English', value: 'en' },
        { label: '한국어', value: 'ko' },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'zh-cn',
      },
    },
    theme: {
      type: 'string',
      title: '编辑器主题',
      enum: [
        { label: '默认主题', value: 'default' },
        { label: '暗色主题', value: 'dark' },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {
        defaultValue: 'default',
        optionType: 'button',
      },
    },
    uploadUrl: {
      type: 'string',
      title: '图片上传地址',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入图片上传API地址',
      },
    },
    imageTypes: {
      type: 'array',
      title: '支持的图片格式',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox.Group',
      'x-component-props': {
        options: [
          { label: 'JPEG', value: 'image/jpeg' },
          { label: 'PNG', value: 'image/png' },
          { label: 'GIF', value: 'image/gif' },
          { label: 'WebP', value: 'image/webp' },
          { label: 'SVG', value: 'image/svg+xml' },
        ],
      },
      default: ['image/jpeg', 'image/png', 'image/gif'],
    },
    maxFileSize: {
      type: 'number',
      title: '最大文件大小',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        min: 0,
        step: 1024 * 1024, // 1MB 步长
        formatter: (value: number) => {
          if (!value) return ''
          const mb = value / (1024 * 1024)
          return `${mb.toFixed(1)} MB`
        },
        parser: (value: string) => {
          const match = value.match(/[\d.]+/)
          return match ? parseFloat(match[0]) * 1024 * 1024 : 0
        },
        placeholder: '不限制',
      },
    },
    autoSave: {
      type: 'boolean',
      title: '自动保存',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    autoSaveInterval: {
      type: 'number',
      title: '自动保存间隔',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      'x-component-props': {
        defaultValue: 5000,
        min: 1000,
        max: 60000,
        step: 1000,
        addonAfter: 'ms',
      },
      'x-reactions': {
        dependencies: ['autoSave'],
        fulfill: {
          state: {
            visible: '{{$deps[0]}}',
          },
        },
      },
    },
    debug: {
      type: 'boolean',
      title: '调试模式',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    enableTableAlignment: {
      type: 'boolean',
      title: '启用表格对齐',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    alignmentOptions: {
      type: 'array',
      title: '对齐选项',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox.Group',
      'x-component-props': {
        options: [
          { label: '左对齐', value: 'left' },
          { label: '居中', value: 'center' },
          { label: '右对齐', value: 'right' },
          { label: '两端对齐', value: 'justify' },
        ],
      },
      default: ['left', 'center', 'right'],
      'x-reactions': {
        dependencies: ['enableTableAlignment'],
        fulfill: {
          state: {
            visible: '{{$deps[0]}}',
          },
        },
      },
    },
    enableTableProperties: {
      type: 'boolean',
      title: '启用表格属性工具',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    enableCellProperties: {
      type: 'boolean',
      title: '启用单元格属性工具',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
    customToolbar: {
      type: 'array',
      title: '自定义工具栏',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox.Group',
      'x-component-props': {
        options: [
          { label: '撤销', value: 'undo' },
          { label: '重做', value: 'redo' },
          { label: '标题', value: 'heading' },
          { label: '加粗', value: 'bold' },
          { label: '斜体', value: 'italic' },
          { label: '下划线', value: 'underline' },
          { label: '删除线', value: 'strikethrough' },
          { label: '链接', value: 'link' },
          { label: '插入表格', value: 'insertTable' },
          { label: '图片上传', value: 'imageUpload' },
          { label: '无序列表', value: 'bulletedList' },
          { label: '有序列表', value: 'numberedList' },
          { label: '增加缩进', value: 'indent' },
          { label: '减少缩进', value: 'outdent' },
          { label: '引用', value: 'blockQuote' },
          { label: '清除格式', value: 'removeFormat' },
        ],
      },
      'x-reactions': {
        dependencies: ['toolbar'],
        fulfill: {
          state: {
            visible: '{{$deps[0] === "custom"}}',
          },
        },
      },
    },
  },
}
