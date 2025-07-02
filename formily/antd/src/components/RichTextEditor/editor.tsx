/**
 * 富文本编辑器组件 - 基于 CKEditor 5
 *
 * 主要功能：
 * - 完整的富文本编辑功能
 * - 支持图片上传和粘贴
 * - 表格创建和编辑，支持对齐功能
 * - 多种工具栏模式
 * - 文本和表格对齐工具
 * - 表格上下文工具栏和属性设置
 * - 字数统计和自动保存
 * - 完善的样式支持
 *
 * @example 基础表格对齐
 * ```tsx
 * <RichTextEditor
 *   value={content}
 *   onChange={setContent}
 *   enableTableAlignment={true}
 *   alignmentOptions={['left', 'center', 'right', 'justify']}
 * />
 * ```
 *
 * @example 完整表格功能
 * ```tsx
 * <RichTextEditor
 *   value={content}
 *   onChange={setContent}
 *   enableTableAlignment={true}
 *   enableTableProperties={true}
 *   enableCellProperties={true}
 *   tableContextToolbar={[
 *     'tableColumn', 'tableRow', 'mergeTableCells',
 *     '|',
 *     'alignment:left', 'alignment:center', 'alignment:right',
 *     '|',
 *     'tableProperties', 'tableCellProperties'
 *   ]}
 * />
 * ```
 *
 * @example 自定义表格工具栏
 * ```tsx
 * <RichTextEditor
 *   value={content}
 *   onChange={setContent}
 *   tableContextToolbar={[
 *     'tableColumn', 'tableRow',
 *     '|',
 *     'alignment:center', 'alignment:right'
 *   ]}
 * />
 * ```
 *
 * 表格对齐功能说明：
 * 1. 单元格内容对齐：
 *    - 选中表格单元格或文本
 *    - 使用工具栏中的对齐按钮（左对齐、居中、右对齐、两端对齐）
 *
 * 2. 表格整体对齐：
 *    - 选中整个表格
 *    - 使用对齐工具调整表格在页面中的位置
 *
 * 3. 表格上下文工具栏：
 *    - 点击表格单元格时自动显示上下文工具栏
 *    - 包含表格行列操作、合并单元格、对齐工具
 *    - 可选择启用表格属性和单元格属性工具
 *
 * 4. 表格/单元格属性：
 *    - 边框颜色和样式设置
 *    - 背景颜色设置
 *    - 单元格内边距和对齐方式
 *
 * 5. 垂直对齐：
 *    - 通过CSS样式支持顶部、中间、底部对齐
 *    - 支持Excel粘贴时保留原有对齐样式
 */

import React, { useRef } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import classNames from 'classnames'
import { connect, mapProps, mapReadPretty } from '@formily/react'
import { LoadingOutlined } from '@ant-design/icons'
import './styles.less'

interface EditorProps {
  /** 编辑器内容 */
  value?: string
  /** 内容变化回调 */
  onChange?: (value: string) => void
  /** CKEditor 配置对象 */
  config?: any
  /** 是否只读 */
  readOnly?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 编辑器高度（像素） */
  height?: number
  /** 工具栏模式 */
  toolbar?: 'basic' | 'standard' | 'full' | 'custom'
  /** 占位符文本 */
  placeholder?: string
  /** 是否开启调试模式 */
  debug?: boolean
  /** 图片上传服务器URL */
  uploadUrl?: string
  /** 后缀内容 */
  suffix?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 最大内容长度 */
  maxLength?: number
  /** 是否显示字数统计 */
  showWordCount?: boolean
  /** 自定义工具栏配置（当 toolbar 为 'custom' 时生效） */
  customToolbar?: string[]
  /** 支持的图片格式 */
  imageTypes?: string[]
  /** 最大上传文件大小（字节） */
  maxFileSize?: number
  /** 编辑器主题 */
  theme?: 'default' | 'dark'
  /** 语言设置 */
  language?: 'zh-cn' | 'en' | 'ko'
  /** 是否自动保存 */
  autoSave?: boolean
  /** 自动保存间隔（毫秒） */
  autoSaveInterval?: number
  /** 自动保存回调 */
  onAutoSave?: (content: string) => void
  /** 编辑器准备就绪回调 */
  onReady?: (editor: any) => void
  /** 获得焦点回调 */
  onFocus?: (event: any, editor: any) => void
  /** 失去焦点回调 */
  onBlur?: (event: any, editor: any) => void
  /** 错误处理回调 */
  onError?: (error: any, details: any) => void
  /** 启用表格对齐工具 */
  enableTableAlignment?: boolean
  /** 文本对齐选项 */
  alignmentOptions?: ('left' | 'center' | 'right' | 'justify')[]
  /** 表格上下文工具栏配置 */
  tableContextToolbar?: string[]
  /** 启用表格属性工具 */
  enableTableProperties?: boolean
  /** 启用单元格属性工具 */
  enableCellProperties?: boolean
}

// 自定义文件上传适配器
class SimpleUploadAdapter {
  private loader: any
  private uploadUrl?: string
  private debug?: boolean
  private imageTypes?: string[]
  private maxFileSize?: number

  constructor(
    loader: any,
    uploadUrl?: string,
    debug?: boolean,
    imageTypes?: string[],
    maxFileSize?: number
  ) {
    this.loader = loader
    this.uploadUrl = uploadUrl
    this.debug = debug
    this.imageTypes = imageTypes || ['jpeg', 'png', 'gif', 'webp']
    this.maxFileSize = maxFileSize || 5 * 1024 * 1024 // 默认5MB
  }

  // 安全的文件类型检查
  private isValidFile(file: any): file is Blob {
    if (
      !file ||
      !(
        file instanceof Blob ||
        file instanceof File ||
        (typeof file === 'object' &&
          file.size !== undefined &&
          file.type !== undefined)
      )
    ) {
      return false
    }

    // 检查文件大小
    if (this.maxFileSize && file.size > this.maxFileSize) {
      if (this.debug) {
        console.warn(
          `File size (${file.size}) exceeds maximum allowed size (${this.maxFileSize})`
        )
      }
      return false
    }

    // 检查文件类型
    if (this.imageTypes && file.type) {
      const fileExtension = file.type.split('/')[1]
      if (!this.imageTypes.includes(fileExtension)) {
        if (this.debug) {
          console.warn(
            `File type (${file.type}) is not allowed. Allowed types:`,
            this.imageTypes
          )
        }
        return false
      }
    }

    return true
  }

  // 处理剪贴板数据
  private processClipboardData(): Blob | null {
    if (!this.loader.dataTransfer) {
      if (this.debug) {
        console.log('No dataTransfer object found in loader')
      }
      return null
    }

    const dataTransfer = this.loader.dataTransfer

    if (this.debug) {
      console.log('Processing clipboard data:', {
        hasFiles: !!dataTransfer.files,
        filesLength: dataTransfer.files?.length || 0,
        hasItems: !!dataTransfer.items,
        itemsLength: dataTransfer.items?.length || 0,
        types: dataTransfer.types,
        effectAllowed: dataTransfer.effectAllowed,
        dropEffect: dataTransfer.dropEffect,
      })
    }

    // 1. 检查 files 数组
    if (dataTransfer.files && dataTransfer.files.length > 0) {
      for (let i = 0; i < dataTransfer.files.length; i++) {
        const file = dataTransfer.files[i]
        if (this.debug) {
          console.log(`Checking file ${i}:`, {
            name: file.name,
            type: file.type,
            size: file.size,
            isValid: this.isValidFile(file),
          })
        }

        if (this.isValidFile(file) && file.type.startsWith('image/')) {
          if (this.debug) {
            console.log('Found valid image file in dataTransfer.files:', file)
          }
          return file
        }
      }
    }

    // 2. 检查 items 数组
    if (dataTransfer.items) {
      for (let i = 0; i < dataTransfer.items.length; i++) {
        const item = dataTransfer.items[i]
        if (this.debug) {
          console.log(`Checking item ${i}:`, {
            kind: item.kind,
            type: item.type,
          })
        }

        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (this.debug) {
            console.log('Got file from item:', file)
          }

          if (this.isValidFile(file)) {
            if (this.debug) {
              console.log('Found valid image file in dataTransfer.items:', file)
            }
            return file
          }
        }

        // 检查字符串类型的数据项
        if (item.kind === 'string') {
          try {
            // 对于字符串类型，我们需要异步获取数据
            // 但由于这个方法是同步的，我们跳过这种情况
            if (this.debug) {
              console.log(
                'Found string item, but cannot process asynchronously:',
                item.type
              )
            }
          } catch (error) {
            if (this.debug) {
              console.warn('Error processing string item:', error)
            }
          }
        }
      }
    }

    // 3. 检查所有可用的数据类型
    if (dataTransfer.types) {
      for (const type of dataTransfer.types) {
        if (this.debug) {
          console.log(`Checking data type: ${type}`)
        }

        try {
          const data = dataTransfer.getData(type)
          if (data) {
            if (this.debug) {
              console.log(
                `Data for type ${type}:`,
                data.substring(0, 200) + (data.length > 200 ? '...' : '')
              )
            }

            // 检查是否是 base64 图片数据
            if (data.startsWith('data:image/')) {
              const blob = this.base64ToBlob(data)
              if (this.debug) {
                console.log(`Found base64 image in ${type} data`)
              }
              return blob
            }

            // 检查 HTML 中的图片
            if (type === 'text/html' && data.includes('<img')) {
              const imgMatch = data.match(
                /<img[^>]+src="(data:image\/[^;]+;base64,[^"]+)"/i
              )
              if (imgMatch && imgMatch[1]) {
                const base64Data = imgMatch[1]
                const blob = this.base64ToBlob(base64Data)
                if (this.debug) {
                  console.log('Found base64 image in HTML clipboard data')
                }
                return blob
              }
            }
          }
        } catch (error) {
          if (this.debug) {
            console.warn(`Error processing data type ${type}:`, error)
          }
        }
      }
    }

    if (this.debug) {
      console.log('No valid image data found in clipboard')
    }

    return null
  }

  // 将 base64 字符串转换为 Blob
  private base64ToBlob(base64Data: string): Blob {
    const parts = base64Data.split(',')
    const mimeType = parts[0].split(':')[1].split(';')[0]
    const byteString = atob(parts[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    return new Blob([ab], { type: mimeType })
  }

  // 获取文件对象，处理不同的 CKEditor 文件结构
  private getFile(): Blob | null {
    if (this.debug) {
      console.log('Getting file from loader:', {
        loader: this.loader,
        loaderKeys: Object.keys(this.loader),
        loaderProperties: this.getAllProperties(this.loader),
      })
    }

    // 1. 直接检查 loader.file
    if (this.isValidFile(this.loader.file)) {
      if (this.debug) {
        console.log('Found valid file in loader.file:', this.loader.file)
      }
      return this.loader.file
    }

    // 2. 检查其他可能的属性
    const possibleFileProperties = [
      'upload',
      'data',
      '_file',
      'filePromise',
      'image',
    ]
    for (const prop of possibleFileProperties) {
      if (this.loader[prop] && this.isValidFile(this.loader[prop])) {
        if (this.debug) {
          console.log(`Found valid file in loader.${prop}:`, this.loader[prop])
        }
        return this.loader[prop]
      }
    }

    // 3. 检查 Promise 类型的属性（异步文件加载）
    if (this.loader.file && typeof this.loader.file.then === 'function') {
      // 这是一个 Promise，我们需要等待它解析
      if (this.debug) {
        console.log('loader.file is a Promise, handling asynchronously')
      }
      return this.handlePromiseFile()
    }

    // 4. 处理剪贴板数据
    const clipboardFile = this.processClipboardData()
    if (clipboardFile) {
      return clipboardFile
    }

    // 5. 深度搜索 loader 对象中的文件
    const foundFile = this.deepSearchForFile(this.loader)
    if (foundFile) {
      if (this.debug) {
        console.log('Found file through deep search:', foundFile)
      }
      return foundFile
    }

    if (this.debug) {
      console.warn(
        'Could not find valid file in loader after exhaustive search:',
        {
          loader: this.loader,
          hasFile: !!this.loader.file,
          fileType: typeof this.loader.file,
          hasUpload: !!this.loader.upload,
          hasData: !!this.loader.data,
          hasDataTransfer: !!this.loader.dataTransfer,
          dataTransferKeys: this.loader.dataTransfer
            ? Object.keys(this.loader.dataTransfer)
            : [],
          dataTransferTypes: this.loader.dataTransfer
            ? this.loader.dataTransfer.types
            : [],
          dataTransferFiles: this.loader.dataTransfer?.files?.length || 0,
          dataTransferItems: this.loader.dataTransfer?.items?.length || 0,
          allProperties: this.getAllProperties(this.loader),
        }
      )
    }

    return null
  }

  // 获取对象的所有属性（包括嵌套的）
  private getAllProperties(obj: any, depth = 0): any {
    if (depth > 2 || !obj || typeof obj !== 'object') {
      return typeof obj
    }

    const result: any = {}
    try {
      Object.keys(obj).forEach((key) => {
        try {
          const value = obj[key]
          if (value instanceof Blob || value instanceof File) {
            result[
              key
            ] = `${value.constructor.name}(${value.size} bytes, ${value.type})`
          } else if (typeof value === 'object' && value !== null) {
            result[key] = this.getAllProperties(value, depth + 1)
          } else {
            result[key] = typeof value
          }
        } catch (e) {
          result[key] = 'error accessing property'
        }
      })
    } catch (e) {
      return 'error iterating object'
    }
    return result
  }

  // 深度搜索对象中的文件
  private deepSearchForFile(obj: any, visited = new Set()): Blob | null {
    if (!obj || typeof obj !== 'object' || visited.has(obj)) {
      return null
    }

    visited.add(obj)

    try {
      // 检查当前对象是否是文件
      if (this.isValidFile(obj)) {
        return obj
      }

      // 递归搜索对象的属性
      for (const key in obj) {
        try {
          const value = obj[key]
          if (this.isValidFile(value)) {
            return value
          }

          // 递归搜索嵌套对象
          if (
            typeof value === 'object' &&
            value !== null &&
            !visited.has(value)
          ) {
            const found = this.deepSearchForFile(value, visited)
            if (found) {
              return found
            }
          }
        } catch (e) {
          // 忽略访问错误
        }
      }
    } catch (e) {
      // 忽略迭代错误
    }

    return null
  }

  // 处理 Promise 类型的文件
  private handlePromiseFile(): Blob | null {
    // 对于 Promise 类型的文件，我们返回 null 并让 CKEditor 处理
    // 这种情况通常发生在异步文件加载时
    if (this.debug) {
      console.log('Cannot handle Promise file synchronously, returning null')
    }
    return null
  }

  upload() {
    return new Promise((resolve, reject) => {
      if (this.debug) {
        console.log('Upload adapter called with loader:', {
          loader: this.loader,
          loaderKeys: Object.keys(this.loader),
          hasFile: !!this.loader.file,
          fileType: typeof this.loader.file,
          hasDataTransfer: !!this.loader.dataTransfer,
          uploadUrl: this.uploadUrl,
        })
      }

      // 如果 loader.file 是 Promise，等待它解析
      if (this.loader.file && typeof this.loader.file.then === 'function') {
        if (this.debug) {
          console.log('loader.file is a Promise, waiting for resolution...')
        }

        this.loader.file
          .then((resolvedFile: any) => {
            if (this.debug) {
              console.log('Promise resolved with file:', resolvedFile)
            }

            if (this.isValidFile(resolvedFile)) {
              this.processFileUpload(resolvedFile, resolve, reject)
            } else {
              this.handleFileNotFound(resolve, reject)
            }
          })
          .catch((error: any) => {
            if (this.debug) {
              console.error('Promise rejected:', error)
            }
            reject('Failed to load file: ' + error.message)
          })
        return
      }

      // 尝试同步获取文件
      const file = this.getFile()

      if (this.debug) {
        console.log('Synchronous file retrieval result:', {
          file,
          fileType: typeof file,
          isBlob: file instanceof Blob,
          isFile: file instanceof File,
        })
      }

      if (file) {
        this.processFileUpload(file, resolve, reject)
      } else {
        this.handleFileNotFound(resolve, reject)
      }
    })
  }

  private processFileUpload(file: Blob, resolve: any, reject: any) {
    if (this.debug) {
      console.log('Processing file upload:', {
        file,
        size: file.size,
        type: file.type,
        uploadUrl: this.uploadUrl,
      })
    }

    if (this.uploadUrl) {
      // 如果有上传 URL，使用服务器上传
      this.uploadToServer(file, resolve, reject)
    } else {
      // 否则使用本地 base64 编码
      this.uploadAsBase64(file, resolve, reject)
    }
  }

  private handleFileNotFound(resolve: any, reject: any) {
    // 作为最后的手段，尝试创建一个占位符图片
    if (this.debug) {
      console.warn(
        'No file found, attempting to create placeholder or handle clipboard data'
      )
    }

    // 尝试创建一个1x1像素的透明PNG作为占位符
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    canvas.toBlob((blob) => {
      if (blob) {
        if (this.debug) {
          console.log('Created placeholder image blob')
        }
        this.processFileUpload(blob, resolve, reject)
      } else {
        const error =
          'No valid file found in loader and failed to create placeholder'
        if (this.debug) {
          console.error('Upload error:', error)
        }
        reject(error)
      }
    }, 'image/png')
  }

  private uploadAsBase64(file: Blob, resolve: any, reject: any) {
    const reader = new FileReader()
    reader.onload = () => {
      if (this.debug) {
        console.log('Base64 upload successful')
      }
      resolve({
        default: reader.result,
      })
    }
    reader.onerror = (error) => {
      if (this.debug) {
        console.error('FileReader error:', error)
      }
      reject('Upload failed')
    }
    reader.readAsDataURL(file)
  }

  private uploadToServer(file: Blob, resolve: any, reject: any) {
    const formData = new FormData()
    formData.append('upload', file)

    if (this.debug) {
      console.log('Uploading to server:', this.uploadUrl)
    }

    fetch(this.uploadUrl!, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((result) => {
        if (this.debug) {
          console.log('Server upload successful:', result)
        }
        resolve({
          default: result.url || result.data?.url,
        })
      })
      .catch((error) => {
        if (this.debug) {
          console.error('Server upload failed:', error)
        }
        reject('Upload failed')
      })
  }

  abort() {
    // 取消上传
    if (this.debug) {
      console.log('Upload aborted')
    }
  }
}

// 文件上传适配器工厂函数
function uploadAdapter(
  editor: any,
  uploadUrl?: string,
  debug?: boolean,
  imageTypes?: string[],
  maxFileSize?: number
) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new SimpleUploadAdapter(
      loader,
      uploadUrl,
      debug,
      imageTypes,
      maxFileSize
    )
  }
}

export const Editor: React.FC<EditorProps> = (props) => {
  const {
    value,
    onChange,
    config,
    readOnly = false,
    className,
    height = 300,
    toolbar = 'standard',
    placeholder = '请输入内容...',
    debug = false,
    uploadUrl,
    suffix,
    disabled = false,
    maxLength,
    showWordCount = false,
    customToolbar,
    imageTypes = ['jpeg', 'png', 'gif', 'webp'],
    maxFileSize = 5 * 1024 * 1024, // 5MB
    theme = 'default',
    language = 'zh-cn',
    autoSave = false,
    autoSaveInterval = 30000, // 30秒
    onAutoSave,
    onReady,
    onFocus,
    onBlur,
    onError,
    enableTableAlignment = true,
    alignmentOptions = ['left', 'center', 'right', 'justify'],
    tableContextToolbar,
    enableTableProperties = false,
    enableCellProperties = false,
  } = props

  const cls = classNames('rich-text-editor', className, {
    readonly: readOnly,
    disabled: disabled,
    'with-word-count': showWordCount,
    [`theme-${theme}`]: theme !== 'default',
    [`toolbar-${toolbar}`]: true,
  })
  const editorInstance = useRef<any>(null)
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)
  const [wordCount, setWordCount] = React.useState({ characters: 0, words: 0 })

  const getToolbarConfig = () => {
    // 基础可用的工具列表 - 只包含CKEditor 5 Classic build中实际可用的工具
    const availableTools = [
      'undo',
      'redo',
      'heading',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'link',
      'insertTable',
      'imageUpload',
      'bulletedList',
      'numberedList',
      'indent',
      'outdent',
      'blockQuote',
      'removeFormat',
      'tableColumn',
      'tableRow',
      'mergeTableCells',
    ]

    // 对齐工具通过DOM直接添加，不需要在工具栏配置中包含

    // 过滤工具栏配置，只保留可用的工具
    const filterToolbar = (tools: string[]) => {
      return tools.filter(
        (tool) => tool === '|' || availableTools.includes(tool)
      )
    }

    switch (toolbar) {
      case 'basic':
        return filterToolbar([
          'bold',
          'italic',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'link',
          'undo',
          'redo',
        ])
      case 'full':
        return filterToolbar([
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'link',
          'insertTable',
          'imageUpload',
          '|',
          'bulletedList',
          'numberedList',
          'indent',
          'outdent',
          '|',
          'blockQuote',
          'removeFormat',
        ])
      case 'custom':
        return filterToolbar(
          customToolbar || [
            'bold',
            'italic',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'link',
            'undo',
            'redo',
          ]
        )
      default: // standard
        return filterToolbar([
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'link',
          'insertTable',
          'imageUpload',
          '|',
          'bulletedList',
          'numberedList',
          'indent',
          'outdent',
          '|',
          'blockQuote',
          'removeFormat',
        ])
    }
  }

  const toolbarConfig = getToolbarConfig()

  if (debug) {
    console.log('Toolbar configuration:', {
      mode: toolbar,
      tools: toolbarConfig,
      customToolbar,
      enableTableAlignment,
      alignmentOptions,
      tableContextToolbar,
      enableTableProperties,
      enableCellProperties,
    })
  }

  const editorConfig = {
    toolbar: toolbarConfig,
    placeholder,
    language,

    image: {
      upload: {
        types: imageTypes,
      },
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
      ],
      resizeOptions: [
        {
          name: 'resizeImage:original',
          value: null,
          label: '原始大小',
        },
        {
          name: 'resizeImage:50',
          value: '50',
          label: '50%',
        },
        {
          name: 'resizeImage:75',
          value: '75',
          label: '75%',
        },
      ],
    },
    table: {
      contentToolbar: tableContextToolbar || [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
      ],
      // 表格默认配置
      defaultHeadings: {
        rows: 1,
        columns: 1,
      },
    },

    heading: {
      options: [
        {
          model: 'paragraph',
          title:
            language === 'zh-cn'
              ? '段落'
              : language === 'ko'
              ? '단락'
              : 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title:
            language === 'zh-cn'
              ? '标题 1'
              : language === 'ko'
              ? '제목 1'
              : 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title:
            language === 'zh-cn'
              ? '标题 2'
              : language === 'ko'
              ? '제목 2'
              : 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title:
            language === 'zh-cn'
              ? '标题 3'
              : language === 'ko'
              ? '제목 3'
              : 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title:
            language === 'zh-cn'
              ? '标题 4'
              : language === 'ko'
              ? '제목 4'
              : 'Heading 4',
          class: 'ck-heading_heading4',
        },
      ],
    },
    wordCount: showWordCount
      ? {
          onUpdate: (stats: any) => {
            if (debug) {
              console.log('Word count stats:', stats)
            }
          },
        }
      : undefined,
    ...(maxLength && {
      typing: {
        transformations: {
          remove: ['symbols'],
        },
      },
    }),
    ...config,
  }

  // 处理编辑器内容变化
  const handleChange = (event: any, editor: any) => {
    const data = editor.getData()
    const text = data.replace(/<[^>]*>/g, '') // 去除HTML标签

    // 检查内容长度限制
    if (maxLength && data.length > maxLength) {
      if (debug) {
        console.warn(`Content exceeds maxLength (${maxLength}):`, data.length)
      }
      return
    }

    onChange?.(data)

    // 更新字数统计
    if (showWordCount) {
      const characters = text.length
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      setWordCount({ characters, words })
    }

    // 自动保存
    if (autoSave && onAutoSave) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }
      autoSaveTimer.current = setTimeout(() => {
        onAutoSave(data)
        if (debug) {
          console.log('Auto-saved content:', data)
        }
      }, autoSaveInterval)
    }

    // 发送自定义事件以便 page.tsx 监听用户输入变化
    try {
      // 获取编辑器的 DOM 元素
      const editorElement = editor.ui.view.editable.element
      if (editorElement) {
        // 向上查找包含 data-designer-node-id 的父元素
        const nodeElement = editorElement.closest('[data-designer-node-id]')
        if (nodeElement) {
          const nodeId = nodeElement.getAttribute('data-designer-node-id')
          if (nodeId) {
            // 触发自定义事件
            const customEvent = new CustomEvent('richtexteditor:change', {
              detail: {
                nodeId,
                content: data,
                editor,
                length: data.length,
                wordCount: showWordCount
                  ? {
                      characters: text?.length || 0,
                      words: text?.trim() ? text.trim().split(/\s+/).length : 0,
                    }
                  : undefined,
              },
              bubbles: true,
            })

            // 在编辑器元素上触发事件
            editorElement.dispatchEvent(customEvent)

            if (debug) {
              console.log('富文本编辑器内容变化事件已发送:', {
                nodeId,
                contentLength: data.length,
                eventDetail: customEvent.detail,
              })
            }
          }
        }
      }
    } catch (error) {
      if (debug) {
        console.error('发送富文本编辑器变化事件时出错:', error)
      }
    }

    if (debug) {
      console.log('CKEditor content changed:', {
        length: data.length,
        maxLength,
        wordCount: showWordCount ? wordCount : undefined,
      })
    }
  }

  // 处理编辑器准备就绪
  const handleReady = (editor: any) => {
    editorInstance.current = editor

    // 设置文件上传适配器
    uploadAdapter(editor, uploadUrl, debug, imageTypes, maxFileSize)

    // 设置编辑器高度
    if (height && editor.ui.view.editable.element) {
      editor.ui.view.editable.element.style.minHeight = `${height}px`
    }

    // 初始化字数统计
    if (showWordCount && value) {
      const text = value.replace(/<[^>]*>/g, '')
      const characters = text.length
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      setWordCount({ characters, words })
    }

    // 添加自定义剪贴板处理，更好地保留 Excel 表格样式
    setupExcelTablePasteSupport(editor, debug)

    // 如果启用了表格对齐，添加自定义对齐工具
    if (enableTableAlignment) {
      setupCustomAlignmentTools(editor, debug)
    }

    if (debug) {
      console.log('CKEditor 5 instance ready:', {
        editor,
        height,
        uploadUrl,
        imageTypes,
        maxFileSize,
        language,
        theme,
        tableConfig: {
          enableTableAlignment,
          alignmentOptions,
          contextToolbar: editorConfig.table.contentToolbar,
        },
      })
    }

    // 调用外部的 onReady 回调
    onReady?.(editor)
  }

  // 设置自定义对齐工具
  const setupCustomAlignmentTools = (editor: any, debug?: boolean) => {
    if (debug) {
      console.log('Setting up custom alignment tools')
    }

    // 添加自定义CSS样式到编辑器
    const style = document.createElement('style')
    style.textContent = `
      .ck-content .custom-align-left { text-align: left !important; }
      .ck-content .custom-align-center { text-align: center !important; }
      .ck-content .custom-align-right { text-align: right !important; }
      .ck-content .custom-align-justify { text-align: justify !important; }
      
      .ck-content table.custom-align-left { margin-left: 0; margin-right: auto; }
      .ck-content table.custom-align-center { margin-left: auto; margin-right: auto; }
      .ck-content table.custom-align-right { margin-left: auto; margin-right: 0; }
      
      .ck-content td.custom-align-left, .ck-content th.custom-align-left { text-align: left !important; }
      .ck-content td.custom-align-center, .ck-content th.custom-align-center { text-align: center !important; }
      .ck-content td.custom-align-right, .ck-content th.custom-align-right { text-align: right !important; }
      .ck-content td.custom-align-justify, .ck-content th.custom-align-justify { text-align: justify !important; }
    `
    document.head.appendChild(style)

    // 添加自定义对齐命令
    editor.commands.add('customAlignment', {
      execute(alignment = 'left') {
        if (debug) {
          console.log('Custom alignment command executed:', alignment)
        }

        // 获取当前选区
        const selection = editor.model.document.selection
        const range = selection.getFirstRange()

        if (!range) return

        editor.model.change((writer: any) => {
          const blocks = []

          // 获取选中的所有块级元素
          for (const item of range.getWalker({ shallow: true })) {
            if (item.item.is('element')) {
              blocks.push(item.item)
            }
          }

          // 如果没有选中块级元素，获取当前段落
          if (blocks.length === 0) {
            const position = selection.getFirstPosition()
            if (position) {
              const block = position.findAncestor((element: any) => {
                return editor.model.schema.isBlock(element)
              })
              if (block) {
                blocks.push(block)
              }
            }
          }

          // 对所有块级元素应用对齐
          blocks.forEach((block: any) => {
            // 移除旧的对齐类
            const oldClasses = [
              'custom-align-left',
              'custom-align-center',
              'custom-align-right',
              'custom-align-justify',
            ]
            oldClasses.forEach((cls) => {
              if (block.hasClass && block.hasClass(cls)) {
                writer.removeClass(cls, block)
              }
            })

            // 添加新的对齐类
            if (block.hasClass) {
              writer.addClass(`custom-align-${alignment}`, block)
            } else {
              // 如果元素不支持class，尝试设置style属性
              writer.setAttribute('style', `text-align: ${alignment}`, block)
            }
          })
        })
      },
    })

    // 添加特定对齐的命令
    alignmentOptions.forEach((alignment) => {
      editor.commands.add(`customAlignment:${alignment}`, {
        execute() {
          editor.execute('customAlignment', alignment)
        },
      })
    })

    if (debug) {
      console.log('Custom alignment tools setup completed')
    }
  }

  // 设置 Excel 表格粘贴支持
  const setupExcelTablePasteSupport = (editor: any, debug?: boolean) => {
    const view = editor.editing.view
    const document = view.document

    // 监听剪贴板输入事件
    view.document.on(
      'clipboardInput',
      (evt: any, data: any) => {
        if (debug) {
          console.log('Clipboard input event:', {
            dataTransfer: data.dataTransfer,
            types: data.dataTransfer.types,
            hasHtml: data.dataTransfer.types.includes('text/html'),
          })
        }

        // 检查是否包含表格数据
        if (data.dataTransfer.types.includes('text/html')) {
          const htmlData = data.dataTransfer.getData('text/html')

          if (
            htmlData.includes('<table') ||
            htmlData.includes('<td') ||
            htmlData.includes('<th')
          ) {
            if (debug) {
              console.log(
                'Detected table data in clipboard:',
                htmlData.substring(0, 500)
              )
            }

            // 预处理 Excel 表格数据
            const processedHtml = preprocessExcelTable(htmlData, debug)

            if (processedHtml !== htmlData) {
              // 如果有处理，替换剪贴板数据
              const newDataTransfer = new DataTransfer()
              newDataTransfer.setData('text/html', processedHtml)

              // 更新事件数据
              data.dataTransfer = newDataTransfer

              if (debug) {
                console.log(
                  'Processed table HTML:',
                  processedHtml.substring(0, 500)
                )
              }
            }
          }
        }
      },
      { priority: 'high' }
    )
  }

  // 预处理 Excel 表格数据
  const preprocessExcelTable = (html: string, debug?: boolean): string => {
    try {
      // 创建临时 DOM 来处理 HTML
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const tables = doc.querySelectorAll('table')

      tables.forEach((table) => {
        const tableElement = table as HTMLTableElement

        // 确保表格有边框
        if (!tableElement.style.borderCollapse) {
          tableElement.style.borderCollapse = 'collapse'
        }
        if (!tableElement.style.border) {
          tableElement.style.border = '1px solid #d9d9d9'
        }
        if (!tableElement.style.width && !tableElement.getAttribute('width')) {
          tableElement.style.width = '100%'
        }

        // 处理表格单元格
        const cells = table.querySelectorAll('td, th')
        cells.forEach((cell) => {
          const cellElement = cell as HTMLTableCellElement

          // 确保单元格有边框
          if (!cellElement.style.border) {
            cellElement.style.border = '1px solid #d9d9d9'
          }

          // 确保单元格有内边距
          if (!cellElement.style.padding) {
            cellElement.style.padding = '8px'
          }

          // 保留文本对齐方式
          const align = cellElement.getAttribute('align')
          if (align && !cellElement.style.textAlign) {
            cellElement.style.textAlign = align
          }

          // 保留垂直对齐方式
          const valign = cellElement.getAttribute('valign')
          if (valign && !cellElement.style.verticalAlign) {
            cellElement.style.verticalAlign = valign
          }

          // 处理背景颜色
          const bgcolor = cellElement.getAttribute('bgcolor')
          if (bgcolor && !cellElement.style.backgroundColor) {
            cellElement.style.backgroundColor = bgcolor
          }

          // 保留宽度和高度
          const width = cellElement.getAttribute('width')
          if (width && !cellElement.style.width) {
            cellElement.style.width =
              width.includes('%') || width.includes('px') ? width : `${width}px`
          }

          const height = cellElement.getAttribute('height')
          if (height && !cellElement.style.height) {
            cellElement.style.height =
              height.includes('%') || height.includes('px')
                ? height
                : `${height}px`
          }

          // 处理合并单元格
          const colspan = cellElement.getAttribute('colspan')
          const rowspan = cellElement.getAttribute('rowspan')
          if (colspan) {
            cellElement.setAttribute('colspan', colspan)
          }
          if (rowspan) {
            cellElement.setAttribute('rowspan', rowspan)
          }
        })

        // 处理表头 - 更智能的表头检测和样式处理
        const thead = table.querySelector('thead')
        if (!thead) {
          const firstRow = table.querySelector('tr')
          if (firstRow) {
            const cells = firstRow.querySelectorAll('td, th')
            let shouldCreateThead = false

            // 检测是否应该创建表头的多个条件
            const hasThCells = firstRow.querySelectorAll('th').length > 0
            const hasHeaderStyles = Array.from(cells).some((cell) => {
              const cellElement = cell as HTMLTableCellElement
              const style = cellElement.style
              const bgcolor = cellElement.getAttribute('bgcolor')

              // 检查是否有表头样式特征
              return (
                style.fontWeight === 'bold' ||
                style.fontWeight === '700' ||
                (style.backgroundColor &&
                  style.backgroundColor !== 'transparent' &&
                  style.backgroundColor !== '') ||
                (bgcolor && bgcolor !== '' && bgcolor !== 'transparent') ||
                cellElement.innerHTML.includes('<strong>') ||
                cellElement.innerHTML.includes('<b>') ||
                cellElement.innerHTML.includes('font-weight:bold') ||
                cellElement.innerHTML.includes('font-weight: bold') ||
                cellElement.innerHTML.includes('font-weight:700') ||
                cellElement.innerHTML.includes('font-weight: 700')
              )
            })

            shouldCreateThead = hasThCells || hasHeaderStyles

            if (shouldCreateThead) {
              const newThead = doc.createElement('thead')
              const newTbody = doc.createElement('tbody')

              // 转换第一行的 td 为 th（如果需要）
              const headerRow = firstRow.cloneNode(true) as HTMLTableRowElement
              const headerCells = headerRow.querySelectorAll('td, th')

              headerCells.forEach((cell) => {
                const cellElement = cell as HTMLTableCellElement

                if (cellElement.tagName.toLowerCase() === 'td') {
                  // 创建新的 th 元素
                  const thElement = doc.createElement('th')

                  // 复制所有属性
                  Array.from(cellElement.attributes).forEach((attr) => {
                    thElement.setAttribute(attr.name, attr.value)
                  })

                  // 复制内容
                  thElement.innerHTML = cellElement.innerHTML

                  // 确保表头有正确的样式
                  if (!thElement.style.fontWeight) {
                    thElement.style.fontWeight = 'bold'
                  }
                  if (
                    !thElement.style.backgroundColor &&
                    !thElement.getAttribute('bgcolor')
                  ) {
                    thElement.style.backgroundColor = '#f5f5f5'
                  }
                  if (
                    !thElement.style.textAlign &&
                    !thElement.getAttribute('align')
                  ) {
                    thElement.style.textAlign = 'center'
                  }

                  // 替换原来的 td
                  cellElement.parentNode?.replaceChild(thElement, cellElement)
                } else {
                  // 已经是 th，确保有正确的样式
                  if (!cellElement.style.fontWeight) {
                    cellElement.style.fontWeight = 'bold'
                  }
                  if (
                    !cellElement.style.backgroundColor &&
                    !cellElement.getAttribute('bgcolor')
                  ) {
                    cellElement.style.backgroundColor = '#f5f5f5'
                  }
                }
              })

              newThead.appendChild(headerRow)
              firstRow.remove()

              // 处理剩余的行
              const remainingRows = table.querySelectorAll('tr')
              remainingRows.forEach((row) => {
                newTbody.appendChild(row.cloneNode(true))
                row.remove()
              })

              table.appendChild(newThead)
              table.appendChild(newTbody)
            }
          }
        } else {
          // 如果已经有 thead，确保其中的 th 元素有正确的样式
          const thElements = thead.querySelectorAll('th')
          thElements.forEach((th) => {
            const thElement = th as HTMLTableCellElement

            if (!thElement.style.fontWeight) {
              thElement.style.fontWeight = 'bold'
            }
            if (
              !thElement.style.backgroundColor &&
              !thElement.getAttribute('bgcolor')
            ) {
              thElement.style.backgroundColor = '#f5f5f5'
            }
            if (!thElement.style.color) {
              thElement.style.color = '#262626'
            }
            if (
              !thElement.style.textAlign &&
              !thElement.getAttribute('align')
            ) {
              thElement.style.textAlign = 'center'
            }
          })
        }
      })

      const processedHtml = doc.body.innerHTML

      if (debug) {
        console.log('Excel table preprocessing completed')
      }

      return processedHtml
    } catch (error) {
      if (debug) {
        console.error('Error preprocessing Excel table:', error)
      }
      return html
    }
  }

  // 处理编辑器获得焦点
  const handleFocus = (event: any, editor: any) => {
    if (debug) {
      console.log('CKEditor focused:', editor)
    }
    onFocus?.(event, editor)
  }

  // 处理编辑器失去焦点
  const handleBlur = (event: any, editor: any) => {
    if (debug) {
      console.log('CKEditor blurred:', editor)
    }
    onBlur?.(event, editor)
  }

  // 处理编辑器错误
  const handleError = (error: any, { willEditorRestart }: any) => {
    if (debug) {
      console.error('CKEditor error:', error)
    }

    if (willEditorRestart && debug) {
      console.log('Editor will restart due to error')
    }

    onError?.(error, { willEditorRestart })
  }

  // 清理自动保存定时器
  React.useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }
    }
  }, [])

  return (
    <div className={cls}>
      <CKEditor
        editor={ClassicEditor}
        data={value || ''}
        config={editorConfig}
        disabled={readOnly || disabled}
        onChange={handleChange}
        onReady={handleReady}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onError={handleError}
      />
      {showWordCount && (
        <div className="word-count-display">
          <span className="characters">
            {language === 'zh-cn'
              ? '字符'
              : language === 'ko'
              ? '문자'
              : 'Characters'}
            : {wordCount.characters}
            {maxLength && ` / ${maxLength}`}
          </span>
          <span className="words">
            {language === 'zh-cn'
              ? '单词'
              : language === 'ko'
              ? '단어'
              : 'Words'}
            : {wordCount.words}
          </span>
        </div>
      )}
      {suffix}
    </div>
  )
}

export const InternalEditor: React.FC<EditorProps> = connect(
  Editor,
  mapProps((props, field) => {
    return {
      ...props,
      value: (field as any).value,
      onChange: (field as any).onInput,
      readOnly: field.readOnly,
      disabled: field.disabled,
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
  }),
  mapReadPretty((props) => {
    return (
      <div
        className={`rich-text-preview ${props.className || ''}`}
        dangerouslySetInnerHTML={{ __html: props.value || '' }}
      />
    )
  })
)

export default InternalEditor
