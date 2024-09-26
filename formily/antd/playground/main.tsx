import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import dayjs from 'dayjs'
import { ConfigProvider } from 'antd'
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom'

import Home from './home'
import Custom from './custom'

import '../src/theme.css'
import 'dayjs/locale/zh-cn'

import zhCN from 'antd/locale/zh_CN'

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
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </ConfigProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
