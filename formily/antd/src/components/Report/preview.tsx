import React from 'react'
import { ComponentProps } from 'react'
import {
  DnFC,
  DroppableWidget,
  TreeNodeWidget,
  useNodeIdProps,
  useTreeNode,
} from '@didesignable/react'
import { createBehavior, createResource, TreeNode } from '@didesignable/core'
import { AllLocales } from '../../locales'
import { PlusOutlined, ProfileOutlined } from '@ant-design/icons'

import { Report as MyReport, ReportProps } from './component'
import { observer } from '@formily/react'
import { queryNodesByComponentPath } from '../../shared'
import { LoadTemplate } from '../../common/LoadTemplate'
import { AllSchemas } from '../../schemas'
import { createVoidFieldSchema } from '../Field'
import { getCellName, getRowName } from './utils'

const ReportTable: DnFC<ComponentProps<typeof MyReport>> = MyReport
const ReportRow: DnFC<ComponentProps<typeof MyReport.Row>> = MyReport.Row
const ReportCol: DnFC<ComponentProps<typeof MyReport.Col>> = MyReport.Col

const createRow = (children?: TreeNode[], name?) => {
  return new TreeNode({
    componentName: 'Field',
    props: {
      type: 'void',
      'x-component': 'Report.Row',
      name: name,
    },
    children: children,
  })
}

const createColumn = (children?: TreeNode[], name?) => {
  return new TreeNode({
    componentName: 'Field',
    props: {
      type: 'void',
      'x-component': 'Report.Col',
      name: name,
    },
    children: children,
  })
}

export const Report: DnFC<ReportProps> = observer((props) => {
  const node = useTreeNode()
  const nodeId = useNodeIdProps()

  const renderReport = () => {
    if (node.children.length === 0) return <DroppableWidget />
    const rows = queryNodesByComponentPath(node, ['Report', 'Report.Row'])

    return (
      <ReportTable {...props}>
        {rows.map((row, i) => {
          const cols = queryNodesByComponentPath(row, [
            'Report.Row',
            'Report.Col',
          ])
          const rowProps = row.props['x-component-props']
          return (
            <ReportRow
              {...rowProps}
              className={`data-id:${row.id}`}
              dataIndex={row.id}
              key={row.id}
            >
              {cols.length > 0
                ? cols.map((col, j) => {
                    const colProps = col.props['x-component-props']
                    const children = col.children.map((child) => {
                      return <TreeNodeWidget node={child} key={child.id} />
                    })
                    return (
                      <ReportCol
                        {...colProps}
                        key={col.id}
                        className={`data-id:${col.id}`}
                      >
                        {children.length > 0 ? children : 'Droppable'}
                      </ReportCol>
                    )
                  })
                : null}
            </ReportRow>
          )
        })}
      </ReportTable>
    )
  }

  return (
    <div {...nodeId} className="dn-array-table">
      {renderReport()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addRow'),
            icon: <PlusOutlined />,
            onClick: () => {
              const rows = queryNodesByComponentPath(node, [
                'Report',
                'Report.Row',
              ])
              if (rows.length > 0) {
                const rowColumnLength = queryNodesByComponentPath(rows[0], [
                  'Report.Row',
                  'Report.Col',
                ]).length
                const cols = Array.from({ length: rowColumnLength }, (v, k) => {
                  const name = getCellName(rows.length, k)
                  return createColumn(null, name)
                })
                const rowNode = createRow(cols, getRowName(rows.length))
                node.append(rowNode)
              } else {
                const name = getCellName(0, 0)
                const rowNode = createRow(
                  [createColumn(null, name)],
                  getRowName(0)
                )
                node.append(rowNode)
              }
            },
          },
          {
            title: node.getMessage('addColumn'),
            icon: 'AddColumn',
            onClick: () => {
              const rows = queryNodesByComponentPath(node, [
                'Report',
                'Report.Row',
              ])
              if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                  const row = rows[i]
                  const cols = queryNodesByComponentPath(row, [
                    'Report.Row',
                    'Report.Col',
                  ])
                  const name = getCellName(i, cols.length)
                  row.append(createColumn(null, name))
                }
              } else {
                const name = getCellName(0, 0)
                const rowNode = createRow(
                  [createColumn(null, name)],
                  getRowName(0)
                )
                node.append(rowNode)
              }
            },
          },
        ]}
      />
    </div>
  )
})

Report.displayName = 'Report'

Report.Behavior = createBehavior(
  {
    name: 'Report',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Report',
    designerProps: {
      droppable: true,
      propsSchema: createVoidFieldSchema(AllSchemas.Report),
    },
    designerLocales: AllLocales.Report,
  },
  {
    name: 'Report.Row',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Report.Row',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node?.props?.['x-component'] === 'Report',
      propsSchema: createVoidFieldSchema(AllSchemas.Report.ReportRow),
    },
    designerLocales: AllLocales.ReportRow,
  },
  {
    name: 'Report.Col',
    extends: ['Field'],
    selector: (node) => {
      return node.props['x-component'] === 'Report.Col'
    },
    designerProps: {
      droppable: true,
      allowDrop: (node) => node?.props?.['x-component'] === 'Report.Row',
      propsSchema: createVoidFieldSchema(AllSchemas.Report.ReportCol),
    },
    designerLocales: AllLocales.ReportCol,
  }
)

Report.Resource = createResource({
  icon: <ProfileOutlined />,
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-decorator': 'FormItem',
        'x-component': 'Report',
      },
    },
  ],
})
