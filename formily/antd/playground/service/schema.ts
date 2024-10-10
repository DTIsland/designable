import { Engine } from '@didesignable/core'
import {
  transformToSchema,
  transformToTreeNode,
} from '@didesignable/formily-transformer'
import { message } from 'antd'
import { PageDataType, PageEngineCtx } from '../../src/pageEditor'

export const saveSchema = (designer: Engine) => {
  localStorage.setItem(
    'formily-schema',
    JSON.stringify(transformToSchema(designer.getCurrentTree()))
  )
  message.success('Save Success')
}

export const loadInitialSchema = (designer: Engine) => {
  try {
    designer.setCurrentTree(
      transformToTreeNode(JSON.parse(localStorage.getItem('formily-schema')))
    )
  } catch {}
}

export const savePage = (pageData: PageDataType) => {
  localStorage.setItem('page-schema', JSON.stringify(pageData))
  message.success('Save Success')
}

export const loadInitialPage = (pageContext: PageEngineCtx) => {
  try {
    const jsonStr = localStorage.getItem('page-schema')
    if (jsonStr) {
      const pageData = JSON.parse(jsonStr) as PageDataType
      pageContext.setData({
        formData: transformToTreeNode(pageData.formData),
        flowchartData: pageData.flowchartData,
      })
    }
  } catch (e) {
    throw new Error('loadInitialPage error' + e.message)
  }
  return null
}
