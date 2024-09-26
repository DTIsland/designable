import React from 'react'
import { Content } from './content'
import { renderSandboxContent } from '@didesignable/react-sandbox'
import './theme.less'

renderSandboxContent(() => {
  return <Content />
})
