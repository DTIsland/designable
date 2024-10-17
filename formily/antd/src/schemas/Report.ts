import { ISchema } from '@formily/react'

export const Report: ISchema & { ReportRow?: ISchema; ReportCol?: ISchema } = {
  type: 'object',
  properties: {},
}

const ReportRow: ISchema = {
  type: 'object',
  properties: {},
}

const ReportCol: ISchema = {
  type: 'object',
  properties: {
    align: {
      type: 'string',
      enum: ['left', 'center', 'right'],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        defaultValue: 'left',
      },
    },
  },
}

Report.ReportRow = ReportRow
Report.ReportCol = ReportCol
