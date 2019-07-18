import React from 'react'
import { Route } from 'react-router-dom'
import useStoreon from 'storeon/react'

import { site_url, client_id } from '../config'

const redirectToLogin = () => {
  console.log(process.env.APP_HOST);
  setTimeout(() => {
    window.location = `${site_url}/auth/authorize?client_id=${client_id}&response_type=code`
  }, 1000)
}

export default ({ component: Component, ...rest }) => {
  const { token } = useStoreon('token')
  if (!token) {
    redirectToLogin()
    return <div>Redirecting to OAuth server</div>
  }
  return <Route {...rest} component={Component} />
}
