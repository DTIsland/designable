import { ICustomEvent } from '@didesignable/shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class UpdateChildrenEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'update:children'
}
