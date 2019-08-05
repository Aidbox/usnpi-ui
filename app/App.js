import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

import NotFound from './components/NotFound';
import Search from './components/Search';
import Footer from './components/Footer';

const App = () => (
  <div style={{
    background: '#eee',
    minHeight: '100vh',
    paddingBottom: '4rem',
  }}>
    <div
      style={{
        background: '#fff',
        marginLeft: '20%',
        marginRight: '20%',
        paddingTop: '6px',
      }}
    >
      <Search />
      <Footer />
    </div>
  </div>
);

export default App;
