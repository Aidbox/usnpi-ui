import React, { useState, useEffect } from 'react';
import { Input, List, Tabs, Descriptions, Table, Collapse } from 'antd';
import { site_url } from '../config';
import useStoreon from 'storeon/react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

const { Search } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

export const SearchResource = () => {
  const [result, setResult] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const highlight = () => {
    let sel = document.querySelectorAll('.name, .qual, .info, .det');
    let words = search;
    let regex = RegExp(words, 'gi');
    let replacement = '<span class="marker">'+words.toUpperCase()+'</span>';
    for (let i = 0; i < sel.length; i++) {
      let inner = sel[i].textContent.replace(regex, replacement);
      sel[i].innerHTML = inner;
    }
  };

  useEffect(() => {
    highlight();
  });

  const getData = input => {
    setSearch(input);
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
          <Accordion>
            <List size="large" pagination={{pageSize: 10, onChange: ((page, size) => setPage(page))}} dataSource={result} renderItem={ (item, i) => (
              <List.Item className="me">
                <Card style={{width: "100%", background: '#fff', border: 0}}>
                  <Accordion.Toggle as={Card.Header} eventKey={i} style={{padding: "0px 3px", background: '#fff', border: 0}}>
                    <List.Item.Meta
                      title={
                        <div className="row">
                          <div className="name">
                            {item.resource.name[0].given.join(' ') + ' ' + item.resource.name[0].family}
                          </div>
                          <div className="qual">{item.resource.qualification[0].code.text.toUpperCase()}</div>
                        </div>
                      }
                      description={
                        <div className="row" id="desc">
                          <div className="info">
                            {item.resource.address[0].line + ', ' + item.resource.address[0].city + ', ' + item.resource.address[0].state + ' Tel. ' + item.resource.telecom[0].value}
                          </div>
                          <div className="info">
                            {item.resource.identifier[0].value}
                          </div>
                        </div>
                      } />
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={i}>
                    <Card.Body>
                      <Descriptions >
                        <Descriptions.Item label="Full name" >
                          {item.resource.name.map(name => (
                            <div>
                              {name.prefix && name.prefix.join('/') + ' '}
                              <span className="det">{name.given.join(' ') + ' ' + name.family}</span>
                              {name.suffix && ' ' + name.suffix.join('/')}
                            </div>))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Gender">
                          {item.resource.gender}
                        </Descriptions.Item>
                        <Descriptions.Item label="Address">
                          {item.resource.address.map(adr => (<div className="det">{adr.line.join('/') + ', ' + adr.city + ', ' + adr.state + ' ' + adr.postalCode}</div>))}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </List.Item>
            )}/>
          </Accordion>
        </TabPane>
        <TabPane tab="Organization" key="2">
        </TabPane>
      </Tabs>
    </div>
  );
};
