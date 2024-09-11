import { GlobalRegistry, IDesignerRegistry } from '@didesignable/core'
import { globalThisPolyfill } from '@didesignable/shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
