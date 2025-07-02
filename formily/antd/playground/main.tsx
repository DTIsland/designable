import React from 'react'
import ReactDOM from 'react-dom'
import dayjs from 'dayjs'
import { ConfigProvider } from 'antd'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './home'
import Custom from './custom'

import 'dayjs/locale/zh-cn'

import zhCN from 'antd/locale/zh_CN'
import PageEditor from './page'
import './styles.css'
import Demo from './demo'
import { FlowChartDemo } from './flowchart'

dayjs.locale('zh-cn')

const App = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        cssVar: {
          key: 'ant',
        },
      }}
    >
      <Router>
        <Switch>
          <Route path="/flowchart">
            <FlowChartDemo />
          </Route>
          <Route path="/demo">
            <Demo />
          </Route>
          <Route path="/custom">
            <Custom />
          </Route>
          <Route path="/page">
            <PageEditor />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </ConfigProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
