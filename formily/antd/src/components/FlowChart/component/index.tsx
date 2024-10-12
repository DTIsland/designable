import React from 'react'
import './styles.less'
import classNames from 'classnames'
import { uid } from '@formily/shared'
import { Edge, Node, Graph, Shape } from '@antv/x6'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'

export type FlowChartModeType = 'edit' | 'view'
export interface IFlowChartData {
  nodes: Node[]
  edges: Edge[]
}

export interface IFlowChartProps extends Partial<HTMLDivElement> {
  mode: 'edit' | 'view'
  options?: Graph.Options
  data?: IFlowChartData
  graphRef?: (graph: Graph) => void
}

function getRandomPosition(x, y) {
  return {
    x: x + getRandomArbitrary(10, 100),
    y: y + getRandomArbitrary(10, 100),
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

// #region 初始化图形
const PORTS = {
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
  },
  items: [
    {
      group: 'top',
    },
    {
      group: 'right',
    },
    {
      group: 'bottom',
    },
    {
      group: 'left',
    },
  ],
}

const getNode = (
  id: string,
  options?: Node.Metadata,
  graphMode: FlowChartModeType = 'edit'
): any => {
  const tools = []
  if (graphMode === 'edit') {
    tools.push({
      name: 'node-editor',
      args: {
        attrs: {
          backgroundColor: '#EFF4FF',
        },
      },
    })
  }

  return {
    id,
    x: 100,
    y: 100,
    inherits: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'image',
        selector: 'img',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
    width: 108,
    height: 48,
    label: 'New Node',
    attrs: {
      body: {
        stroke: '#333333',
        strokeWidth: 1,
        fill: '#ebf4ff',
        rx: 4,
        ry: 4,
      },
      img: {
        ref: 'body',
        refX: '100%',
        refY: '50%',
        refY2: -8,
        width: 16,
        height: 16,
        'xlink:href':
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAADo0lEQVR4nN2YS08TURTHm8hO/RiCUSMfgY3QmekUV0arRtiISxBRF5i4se28SqILZkzABJZsIBHCQl4acO7MdGFgAeILNbBgI3SmVUOba/7F8GgLtAOloyc5yWTa3Pnl3HPv/5zj8/2v1hAltayo3+MVa5RXjCVGIkm/oKfheOYV8wt+8wt6O/57LFCN4vRpViAPArLxvTEWt1v6P/x8NLxKxckEfab/pt1WOut4xrvO4VXa0v8x1dhl2ZxMvjES6ah7PHnqyMHqHk9WMQLpYCXDbn6xkAyPr1Etnina1XiGhsfWaHPvgoM1EHmseSRwDeGZs7xsLt54Pmcrb5ySwLQCLr92aEidswOy+d4vTtccCo6TyGVOMpyHQyuZw4JpOf5gcDmDteujb4Ou4BjBaAooRjI6kThSMG2HRyfWaUA2kmyU3Co5coDDdpQLTtux5YBsEGf4onMOoS9n5LQcj4yvU04iDhsxqveFw8nCgShHzmkH5eTQSpqTjYV9T3eDqN+7rs0l3Hwg19ysEVJnHVYw2ve+hCXD9VWSa67yccqhrGQkCl7mUAhcwm63KNfcrtPcs+BAcfIAIV+RsdIUQisDIBSHU4yvu3MvSmqhrZCkSgOq8QwNdllOfXjmwhYgdBbCr3kAUItn6O2+DylGIG1bgHyXNYqqxCuAncOrNKiYI9v5p5hLwlTCM4DCRIIGFevTFiAnEgc1XCkAhzVtn289ffuLshKxtwBRBXebac8AdpsblBHJxr8DyHl9iwNePyS8Yo3iaHsFsPNlzjWDJuaOhy7qlr7FFCvqrdtKIukX0Rp6RupiluMXjPO79JiPmUsQ6koDPnn1I79Y2Iwi6UDfWmnApp55B4VzHiCKRBSsbhulXHOzhjRlZwvWevndyTzA7IUt6e0htTIlvxrP0Kvds86uKqZAFKvQ8aOpdrtFmku/P7iMpmn+ysDAiT0Bs1EUp2s22871Y4OLjK1RViTOJVE/4yvGMI7g5ONp3KVs426m/AIJ+EoxjCMAiaa6nJELKEaSkfSbPjeGcQQ6/vtHnJPq35zDtpYcubxIRoxqdPwhddZG33roLZ2y6TV11saBKDrnihpgiuQu7qjm3nkHiqO6GGA29cxjgJnwi3rrgafVJegpKE5AJl8bY5aN7gtVEMqj7AjYTGcdz3iHquR232IqGDMdXjGXoBBlGQEXMog5I5A2XjFHeMX8vJlPm0N0FMB4h5IJ/2HC5NyxQFXC/gCFZ0lQ8d0FjAAAAABJRU5ErkJggg==',
        class: 'graph-add-btn',
        event: 'add:node',
      },
    },
    ports: { ...PORTS },
    tools: tools,
    ...options,
  }
}

const initialNodes = getNode('0')

export class FlowChart extends React.Component<IFlowChartProps> {
  private graph: Graph
  private container: HTMLDivElement

  static defaultProps: IFlowChartProps = {
    mode: 'edit',
    data: {
      nodes: [initialNodes],
      edges: [],
    },
  }

  constructor(props: IFlowChartProps) {
    super(props)
  }

  componentDidMount() {
    this.initGraph()
    this.initPlugins()
    this.initEvents()
    this.initData()
  }

  // componentDidUpdate(prevProps: Readonly<IFlowChartProps>) {
  //   if (prevProps.data !== this.props.data) {
  //     this.graph.clearCells()
  //     this.initData()
  //   }
  // }

  private initGraph = () => {
    this.graph = new Graph({
      container: this.container,
      grid: false,
      autoResize: true,
      background: {
        color: '#f9f9f9',
      },
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: {
          radius: 20,
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#000000',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
          })
        },
        validateConnection({ targetMagnet }) {
          return !!targetMagnet
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#5F95FF',
              stroke: '#5F95FF',
            },
          },
        },
      },
    })
    this.props.graphRef && this.props.graphRef(this.graph)
  }

  private initData = () => {
    this.graph.addNodes(this.props.data.nodes)
    this.graph.addEdges(this.props.data.edges)
  }

  private initEvents = () => {
    const graph = this.graph
    this.graph.on('cell:mouseenter', (args: any) => {
      const { cell } = args
      if (cell.isNode()) {
        const ports = this.container.querySelectorAll(
          '.x6-port-body'
        ) as NodeListOf<SVGElement>
        this.showPorts(ports, true)
      }
    })

    this.graph.on('cell:mouseleave', ({ cell }) => {
      if (cell.isNode()) {
        const ports = this.container.querySelectorAll(
          '.x6-port-body'
        ) as NodeListOf<SVGElement>
        this.showPorts(ports, false)
      }
    })

    if (this.props.mode === 'edit') {
      // Delete
      graph.bindKey('backspace', () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
          const filtered = cells.filter((cell) => cell.id !== '0') // 不能删除根节点
          this.graph.removeCells(filtered)
        }
      })

      // Create Node
      graph.on('add:node', ({ cell }: any) => {
        const pos = cell.position()
        this.createNode(pos.x, pos.y)
      })
    }
  }

  private createNode = (x, y) => {
    const randomPos = getRandomPosition(x, y)
    this.graph.addNode(
      getNode(uid(6), {
        x: randomPos.x,
        y: randomPos.y,
      })
    )
  }

  private initPlugins = () => {
    this.graph
      .use(
        new Selection({
          rubberband: true,
          showNodeSelectionBox: true,
        })
      )
      .use(new Snapline())
      .use(new Keyboard())
      .use(new Clipboard())
      .use(new History())
  }

  showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i += 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    const { className } = this.props
    return (
      <div className={classNames('xgraph', className)}>
        <div className="graph-content" ref={this.refContainer} />
      </div>
    )
  }
}
