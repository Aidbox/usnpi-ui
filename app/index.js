import React from 'react'
import { Router } from 'react-router-dom'
import StoreContext from 'storeon/react/context'
import history from './history'

import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import App from './App'

const initApp = () => (
    <Router history={history}>
      <App/>
    </Router>
)

export default initApp
