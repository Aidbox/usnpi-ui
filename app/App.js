import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';

const { Content, Footer } = Layout;

import NotFound from './components/NotFound';
import { SearchResource } from './components/Search';

const App = () => (
  <Layout>
    <Content style={{ padding: '0 50px' }}>
      <div
        style={{
          background: '#fff',
          padding: 24,
          minHeight: 380,
          marginTop: '16px'
        }}
      >
        <Switch>
          <Route path="/" exact component={SearchResource} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer style={{ textAlign: 'center' }} />
    </Content>
  </Layout>
);

export default App;
