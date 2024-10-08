import React from 'react'
import dayjs from 'dayjs'
import { ConfigProvider } from 'antd'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import Home from './home'
import Custom from './custom'

import '../src/theme.css'
import 'dayjs/locale/zh-cn'

import zhCN from 'antd/locale/zh_CN'
import PageEditor from './page'

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

const root = createRoot(document.getElementById('root'))

root.render(<App />)
