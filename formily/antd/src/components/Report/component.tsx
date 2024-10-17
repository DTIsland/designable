import React, { ReactComponentElement } from 'react'

import './styles.less'
import classNames from 'classnames'

export interface ReportProps extends Partial<ReactComponentElement<'table'>> {
  className?: string
  children?: any
}

export const ReportRow: React.FC<React.PropsWithChildren<any>> = (props) => {
  return (
    <tr
      {...props}
      className={classNames(`dn-report-row`, props.className)}
      data-designer-node-id={props.className?.match(/data-id\:([^\s]+)/)?.[1]}
    >
      {props.children}
    </tr>
  )
}
ReportRow.displayName = 'ReportRow'

export const ReportCol: React.FC<React.PropsWithChildren<any>> = (props) => {
  return (
    <td
      {...props}
      className={classNames(`dn-report-col`, props.className)}
      data-designer-node-id={props.className?.match(/data-id\:([^\s]+)/)?.[1]}
    >
      {props.children}
    </td>
  )
}

ReportRow.displayName = 'ReportRow'

export const Report: React.FC<React.PropsWithChildren<ReportProps>> & {
  Row: typeof ReportRow
  Col: typeof ReportCol
} = (props) => {
  return (
    <table className={classNames(`dn-report`, props.className)} {...props}>
      <tbody>{props.children}</tbody>
    </table>
  )
}

Report.displayName = 'Report'
Report.Row = ReportRow
Report.Col = ReportCol
