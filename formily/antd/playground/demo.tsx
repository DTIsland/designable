import React from 'react'
import {
  Report,
  ReportCol,
  ReportRow,
} from '../src/components/Report/component'

export const Demo: React.FC<{}> = () => {
  return (
    <div>
      <Report>
        <ReportRow>
          <ReportCol>1</ReportCol>
          <ReportCol>2</ReportCol>
          <ReportCol>3</ReportCol>
        </ReportRow>
        <ReportRow>
          <ReportCol>4</ReportCol>
          <ReportCol>5</ReportCol>
          <ReportCol>6</ReportCol>
        </ReportRow>
      </Report>
    </div>
  )
}
