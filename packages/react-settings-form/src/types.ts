import React from 'react'
import { Form } from '@formily/core'
export interface ISettingFormProps {
  className?: string
  style?: React.CSSProperties
  uploadAction?: string
  uploadHeaders?: Record<string, any>
  components?: Record<string, React.FC<any>>
  effects?: (form: Form) => void
  scope?: any
}
