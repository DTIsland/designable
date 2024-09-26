import React from 'react'
import { usePrefix } from '../hooks'
import cls from 'classnames'
import './sourceBarPanel.less'

export type ISourceBarPanelProps = React.HTMLAttributes<HTMLDivElement>

export const SourceBarPanel: React.FC<ISourceBarPanelProps> = (
  props: React.PropsWithChildren<ISourceBarPanelProps>
) => {
  const prefix = usePrefix('sourceBar')
  const { className, ...rest } = props

  return (
    <div className={cls(prefix + '-panel', className)} {...rest}>
      {props.children}
    </div>
  )
}
