import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';

const { Content, Footer } = Layout;

import NotFound from './components/NotFound';
import { SearchResource } from './components/Search';

const App = () => (
  <div style={{
    background: '#eee',
    minHeight: '100vh',
  }}>
      <div
        style={{
          background: '#fff',
          marginLeft: '20%',
          marginRight: '20%',
          paddingTop: '1rem',
        }}
      >
        <Switch>
          <Route path="/" exact component={SearchResource} />
          <Route component={NotFound} />
        </Switch>
  </div>
  </div>
);

export default App;
