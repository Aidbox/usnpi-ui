import React from 'react'
import { Router } from 'react-router-dom'
import history from './history'

import './index.css';

import App from './App'

const initApp = () => (
    <Router history={history}>
      <App/>
    </Router>
)

export default initApp
