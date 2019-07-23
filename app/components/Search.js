import React, { useState, useEffect } from 'react';
import { Input, List, Tabs, Descriptions, Table, Collapse } from 'antd';
import { site_url } from '../config';
import useStoreon from 'storeon/react';

const { Search } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

export const SearchResource = () => {
  const [result, setResult] = useState([]);
  const getData = input => {
      let query = `${site_url}/Practitioner`;
      if (input != '')
        query = query +
        `/$lookup?name=lk&by=name.family,name.given,identifier.value;address.city,address.state,qualification.code.text;address.line&q=${input}&sort=name.family,name.given`;
      fetch(query)
        .then(r => r.json())
        .then(d => {
          setResult(d.entry);
        });
  };

  console.log(result);

  return (
    <div className="content">
      <Tabs defaultActiveKey='1' >
        <TabPane tab="Practitioner" key="1">
          <Search placeholder="Search..." style={{marginBottom: '6px'}} enterButton="Search" size="large" onSearch={value => getData(value)} />
          <List size="large" pagination={{pageSize: 10}} dataSource={result} renderItem={ (item, i) => (
            <Collapse bordered={false}>
              <Panel showArrow={false} key={i} header={
                <List.Item >
                  <List.Item.Meta
                    title={
                      <div className="container">
                        <div className="name">
                          {item.resource.name[0].given.join(' ') + ' ' + item.resource.name[0].family}
                        </div>
                        <div className="qual">{item.resource.qualification[0].code.text}</div>
                      </div>
                    }
                    description={
                      <div className="container" id="desc">
                        <div className="info">
                          {item.resource.address[0].line + ', ' + item.resource.address[0].city + ', ' + item.resource.address[0].state}&nbsp;&nbsp;{item.resource.telecom[0].value}
                        </div>
                        <div className="info">
                          {item.resource.identifier[0].value}
                        </div>
                      </div>
                    } />
                </List.Item>}>
                {i}
              </Panel>
            </Collapse>
          )}/>
        </TabPane>
        <TabPane tab="Organization" key="2">
        </TabPane>
      </Tabs>
    </div>
  );
};
