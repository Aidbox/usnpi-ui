import React, { useState, useEffect } from 'react';
import { Input, List, Tabs, Descriptions, Table } from 'antd';
import { site_url } from '../config';
import useStoreon from 'storeon/react';

const { Search } = Input;
const { TabPane } = Tabs;


export const SearchResource = () => {
  const { token } = useStoreon('token');
  //const [result, setResult] = useState({
  //  name: [],
  //  info: [],
  //});
  const [result, setResult] = useState([]);

  const getData = input => {
    if (token) {
      let query = `${site_url}/Practitioner`;
      if (input != '')
        query = query +
        `/$lookup?name=lk&by=name.family,name.given,identifier.value;address.city,address.state,qualification.code.text;address.line&q=${input}&sort=name.family,name.given`;
      console.log(query);
      fetch(query, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(r => r.json())
        .then(d => {
          setResult(d.entry);
        });
    }
    else console.log('Invalid token, search failed');
  };

  console.log(result);

  return (
    <div className="content">
      <Tabs defaultActiveKey='1' >
        <TabPane tab="Practitioner" key="1">
          <Search placeholder="Search..." enterButton="Search" size="large" onSearch={value => getData(value)} />
          <List size="large" pagination={{pageSize: 10}} dataSource={result} renderItem={ (item) => (
            <List.Item >
              <List.Item.Meta
                title={
                  <div className="container">
                    <div className="name ">
                      {item.resource.name[0].given.join(' ') + ' ' + item.resource.name[0].family}
                    </div>
                    <div className="qual">{item.resource.qualification[0].code.text}</div>
                    <div className="det">Details</div>
                  </div>
                }
                description={
                  <div className="container">
                    {item.resource.qualification[0].code.text}
                  </div>
                } />
            </List.Item>
          )}/>
        </TabPane>
        <TabPane tab="Organization" key="2">
        </TabPane>
      </Tabs>
    </div>
  );
};
