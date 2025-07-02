# 富文本编辑器 - 内置对齐工具

## 概述

我们为基于 CKEditor 5 Classic build 的富文本编辑器添加了自定义的内置对齐工具，无需依赖额外的 CKEditor 插件，通过 DOM 操作和自定义命令实现完整的文本对齐功能。

## 功能特性

### ✅ 已实现的功能

1. **文本段落对齐**

   - 左对齐（默认）
   - 居中对齐
   - 右对齐
   - 两端对齐

2. **表格对齐支持**

   - 表格整体对齐
   - 表格单元格内容对齐
   - 支持选中多个单元格批量对齐

3. **命令系统集成**

   - 注册自定义对齐命令（customAlignment）
   - 支持通过编程方式调用对齐功能
   - 可与其他 UI 组件集成

4. **样式支持**
   - 编辑模式和预览模式样式一致
   - 通过 CSS 类和内联样式双重保障
   - 支持 Excel 表格粘贴时保留对齐样式

## 使用方法

### 基础用法

```tsx
import { RichTextEditor } from '@didesignable/formily-antd'

function MyComponent() {
  const [content, setContent] = useState('')

  return (
    <RichTextEditor
      value={content}
      onChange={setContent}
      enableTableAlignment={true}
      alignmentOptions={['left', 'center', 'right', 'justify']}
    />
  )
}
```

### 属性配置

| 属性                   | 类型                                                | 默认值                                   | 说明           |
| ---------------------- | --------------------------------------------------- | ---------------------------------------- | -------------- |
| `enableTableAlignment` | `boolean`                                           | `false`                                  | 启用对齐工具   |
| `alignmentOptions`     | `Array<'left' \| 'center' \| 'right' \| 'justify'>` | `['left', 'center', 'right', 'justify']` | 可用的对齐选项 |

### 使用步骤

1. **启用对齐功能**

   ```tsx
   <RichTextEditor enableTableAlignment={true} />
   ```

2. **自定义对齐选项**

   ```tsx
   <RichTextEditor
     enableTableAlignment={true}
     alignmentOptions={['left', 'center', 'right']} // 不包含两端对齐
   />
   ```

3. **使用对齐功能**
   - 选中文本或段落
   - 点击工具栏中的对齐按钮
   - 对于表格，选中表格或单元格后使用对齐功能

## 技术实现

### 实现原理

1. **命令系统**

   - 注册自定义的 `customAlignment` 命令
   - 为每种对齐方式创建独立命令（如 `customAlignment:left`）

2. **DOM 操作**

   - 通过 DOM 直接向工具栏添加对齐按钮组
   - 避免了 CKEditor 组件工厂的复杂性

3. **样式应用**
   - 为元素添加 CSS 类（如 `custom-align-center`）
   - 备用方案：添加内联 `style` 属性
   - 确保在各种场景下都能正确显示

### 核心代码结构

```
src/components/RichTextEditor/
├── editor.tsx                 # 主组件，包含对齐功能
├── styles.less               # 样式文件，定义对齐样式
└── preview.tsx               # 预览组件，支持对齐样式
```

### 关键函数

- `setupCustomAlignmentTools()`: 设置对齐命令和样式
- `addAlignmentButtons()`: 向工具栏添加对齐按钮
- `customAlignment`: 自定义对齐命令的执行逻辑

## 样式支持

### CSS 类

```css
/* 文本对齐 */
.custom-align-left {
  text-align: left !important;
}
.custom-align-center {
  text-align: center !important;
}
.custom-align-right {
  text-align: right !important;
}
.custom-align-justify {
  text-align: justify !important;
}

/* 表格对齐 */
table.custom-align-center {
  margin: 0 auto;
}
td.custom-align-center {
  text-align: center !important;
}
```

### 内联样式备用

当 CSS 类不可用时，系统会自动添加内联样式：

```html
<p style="text-align: center">居中的段落</p>
```

## 兼容性

- ✅ 支持 CKEditor 5 Classic build
- ✅ 支持现代浏览器（Chrome, Firefox, Safari, Edge）
- ✅ 支持从 Excel 粘贴表格并保留对齐样式
- ✅ 支持编辑和预览模式切换
- ✅ 支持多种工具栏模式

## 调试支持

启用调试模式可以查看详细的执行日志：

```tsx
<RichTextEditor
  enableTableAlignment={true}
  debug={true} // 启用调试模式
/>
```

调试信息包括：

- 对齐工具的初始化过程
- 对齐命令的执行情况
- 按钮点击事件的响应

## 注意事项

1. **性能优化**

   - 对齐按钮通过延时添加，避免影响编辑器初始化速度
   - CSS 样式只在启用对齐功能时加载

2. **样式优先级**

   - 使用 `!important` 确保对齐样式优先级最高
   - 提供 CSS 类和内联样式双重保障

3. **用户体验**
   - 对齐按钮组采用紧凑设计，与原生工具栏风格一致
   - 提供清晰的视觉反馈和悬停效果

## 未来扩展

可以考虑添加的功能：

- [ ] 垂直对齐支持（顶部、中间、底部）
- [ ] 表格整体对齐的可视化指示器
- [ ] 快捷键支持（Ctrl+L, Ctrl+E, Ctrl+R 等）
- [ ] 右键菜单中的对齐选项
- [ ] 更多的对齐选项（如分散对齐）

## 总结

内置对齐工具成功解决了 CKEditor 5 Classic build 缺少对齐插件的问题，通过自定义实现提供了完整的文本和表格对齐功能，同时保持了良好的用户体验和代码可维护性。
