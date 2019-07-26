import React from 'react'
import { Router } from 'react-router-dom'
import history from './history'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App'

const initApp = () => (
    <Router history={history}>
      <App/>
    </Router>
)

export default initApp
