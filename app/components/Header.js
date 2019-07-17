import React from 'react'
import { withRouter, Link, matchPath } from 'react-router-dom'
import useStoreon from 'storeon/react'
import { Layout, Menu } from 'antd'

const { Header } = Layout

const hasMatchRoute = (path, url) => {
  const m = matchPath(path, {
    path: url,
    exact: true,
    strict: false
  });
  return m && 'path' in m;
};

export default withRouter(({ history: { location: { pathname: path } } }) => {
  const { user } = useStoreon('user')
  return (
    <Header>
      <Menu
        theme="dark"
        mode="horizontal"
        selectable={false}
        style={{ lineHeight: '64px', display: 'flex' }}
      >
        <Menu.Item
          className={hasMatchRoute(path, '/') ? 'ant-menu-item-selected' : ''}
          key="1">
          <Link to="/" >Home</Link>
        </Menu.Item>
        {user && [
          <Menu.Item
            key="98"
            className={hasMatchRoute(path, '/login') ? 'ant-menu-item-selected' : ''}
            style={{ marginLeft: 'auto' }}
          >
            <Link to="/login">{user.name ? user.name.formatted : user.email}</Link>
          </Menu.Item>,
          <Menu.Item
            key="99"
            className={hasMatchRoute(path, '/logout') ? 'ant-menu-item-selected' : ''}
          >
            <Link to="/logout">Logout</Link>
          </Menu.Item>
        ]}
      </Menu>
    </Header>)
})
