import { EventDriver } from '@didesignable/shared'
import { Engine } from '../models/Engine'
import { ViewportResizeEvent } from '../events'
import { ResizeObserver } from '@juggle/resize-observer'
import { globalThisPolyfill } from '@didesignable/shared'
import { debounce } from 'lodash'

export class ViewportResizeDriver extends EventDriver<Engine> {
  request = null

  resizeObserver: ResizeObserver = null

  onResize = debounce((e: any) => {
    if (e.preventDefault) e.preventDefault()
    this.request = requestAnimationFrame(() => {
      cancelAnimationFrame(this.request)
      this.dispatch(
        new ViewportResizeEvent({
          scrollX: this.contentWindow.scrollX,
          scrollY: this.contentWindow.scrollY,
          width: this.contentWindow.innerWidth,
          height: this.contentWindow.innerHeight,
          innerHeight: this.contentWindow.innerHeight,
          innerWidth: this.contentWindow.innerWidth,
          view: this.contentWindow,
          target: e.target || this.container,
        })
      )
    })
  }, 500)

  attach() {
    if (this.contentWindow && this.contentWindow !== globalThisPolyfill) {
      this.addEventListener('resize', this.onResize)
    } else {
      if (this.container && this.container !== document) {
        this.resizeObserver = new ResizeObserver(this.onResize)
        this.resizeObserver.observe(this.container as HTMLElement)
      }
    }
  }

  detach() {
    if (this.contentWindow && this.contentWindow !== globalThisPolyfill) {
      this.removeEventListener('resize', this.onResize)
    } else if (this.resizeObserver) {
      if (this.container && this.container !== document) {
        this.resizeObserver.unobserve(this.container as HTMLElement)
        this.resizeObserver.disconnect()
      }
    }
  }
}
