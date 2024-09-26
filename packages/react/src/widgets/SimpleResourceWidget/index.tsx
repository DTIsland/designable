import React from 'react'
import {
  isResourceHost,
  isResourceList,
  IResourceLike,
  IResource,
} from '@didesignable/core'
import { isFn } from '@didesignable/shared'
import { observer } from '@formily/reactive-react'
import { usePrefix } from '../../hooks'
import { IconWidget } from '../IconWidget'
import cls from 'classnames'
import './styles.less'

export type SimpleSourceMapper = (resource: IResource) => React.ReactChild

export interface ISimpleResourceWidgetProps {
  sources?: IResourceLike[]
  className?: string
  children?: SimpleSourceMapper | React.ReactElement
}

export const SimpleResourceWidget: React.FC<ISimpleResourceWidgetProps> =
  observer((props) => {
    const prefix = usePrefix('simple-resource')
    const renderNode = (source: IResource) => {
      const { node, icon, title, thumb, span } = source
      return (
        <div
          className={prefix + '-item'}
          style={{ gridColumnStart: `span ${span || 1}` }}
          key={node.id}
          data-designer-source-id={node.id}
        >
          {thumb && <img className={prefix + '-item-thumb'} src={thumb} />}
          {icon && React.isValidElement(icon) ? (
            <>{icon}</>
          ) : (
            <IconWidget
              title={title || node.children[0]?.getMessage('title')}
              className={prefix + '-item-icon'}
              infer={icon}
              style={{ width: 24, height: 24, color: 'red' }}
            />
          )}
        </div>
      )
    }
    const sources = props.sources.reduce<IResource[]>((buf, source) => {
      if (isResourceList(source)) {
        return buf.concat(source)
      } else if (isResourceHost(source)) {
        return buf.concat(source.Resource)
      }
      return buf
    }, [])
    const remainItems =
      sources.reduce((length, source) => {
        return length + (source.span ?? 1)
      }, 0) % 3
    return (
      <div className={cls(prefix, props.className)}>
        <div className={prefix + '-content-wrapper'}>
          <div className={prefix + '-content'}>
            {sources.map(isFn(props.children) ? props.children : renderNode)}
            {remainItems ? (
              <div
                className={prefix + '-item-remain'}
                style={{ gridColumnStart: `span ${3 - remainItems}` }}
              ></div>
            ) : null}
          </div>
        </div>
      </div>
    )
  })

SimpleResourceWidget.defaultProps = {}
