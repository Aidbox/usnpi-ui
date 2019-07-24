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
  const [result2, setResult2] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const highlight = () => {
    if (search != '') {
      let sel = document.querySelectorAll('.name, .qual, .info, .det, .orgname');
      let s = search.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
      s = s.trim();
      let words = s.split(/(?:,| )+/);
      console.log(words);
      words.map(w => {
        if (w != '') {
          //let regex = RegExp('((?!.*^werne$.*).)*', 'gi');
          let regex = RegExp(w, 'gi')
          console.log(regex);
          for (let i = 0; i < sel.length; i++) {
            let inner = sel[i].innerHTML.replace(regex, function (replacement) {return '<span class="marker">'+replacement+'</span>'});
            sel[i].innerHTML = inner;
          }
        }
      });
    }
  };

  useEffect(() => {
    highlight();
  });

  const getDataPr = input => {
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

  const getDataOrg = input => {
    setSearch(input);
    let query = `${site_url}/Organization`;
    if (input != '')
      query = query +
      `/$lookup?name=lk&by=name,contact.name.family,contact.name.given,identifier.value;address.city,address.state,type.text;address.line&q=${input}&sort=name`;
    fetch(query)
      .then(r => r.json())
      .then(d => {
        setResult2(d.entry);
      });
  };

  //console.log(result);
  console.log(result2);

  return (
    <div className="content">
      <Tabs defaultActiveKey='1' >
        <TabPane tab="Practitioner" key="1">
          <Search placeholder="Search..." style={{marginBottom: '6px'}} enterButton="Search" size="large" onSearch={value => getDataPr(value)} />
          <Accordion>
            <List size="large" pagination={{pageSize: 10, onChange: ((page, size) => setPage(page))}} dataSource={result} renderItem={ (item, i) => (
              <List.Item className="me">
                <Card style={{width: "100%", background: '#fff', border: 0}}>
                  <Accordion.Toggle as={Card.Header} eventKey={i} style={{padding: "0px 3px", background: '#fff', border: 0}}>
                    <List.Item.Meta
                      title={
                        <div className="row">
                          <div className="name">
                            {item.resource.name && item.resource.name[0].given.join(' ') + ' ' + item.resource.name[0].family}
                          </div>
                          <div className="qual">{item.resource.qualification && item.resource.qualification[0].code.text}</div>
                        </div>
                      }
                      description={
                        <div className="row" id="desc">
                          <div className="info">
                            {item.resource.address && item.resource.address[0].line + ', ' + item.resource.address[0].city + ', ' + item.resource.address[0].state}
                            {item.resource.telecom && ' Tel. ' + item.resource.telecom[0].value}
                          </div>
                          <div className="info">
                            {item.resource.identifier && item.resource.identifier[0].value}
                          </div>
                        </div>
                      } />
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={i}>
                    <Card.Body>
                      <Descriptions layout="vertical" >
                        <Descriptions.Item label="Full name" span={2}>
                          {item.resource.name && item.resource.name.map(name => (
                            <div>
                              {name.prefix && name.prefix.join('/') + ' '}
                              <span className="det">{name.given.join(' ') + ' ' + name.family}</span>
                              {name.suffix && ' ' + name.suffix.join('/')}
                            </div>))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Gender">
                          {item.resource.gender && item.resource.gender}
                        </Descriptions.Item>
                        <Descriptions.Item label="Qualification" span={2}>
                          {item.resource.qualification && item.resource.qualification.map((qual, i) => (
                            <><span className="det">{qual.code.text}</span>{
                              item.resource.qualification.length > 1 && i != item.resource.qualification.length - 1 && ' / '
                            }</>))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Identifier" span={2}>
                          {item.resource.identifier && item.resource.identifier.map(( id, i ) => (
                            <><span className="det">{id.value}</span>{item.resource.identifier.length > 1 && i != item.resource.identifier.length - 1 && ' / '}</>))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Address">
                          {item.resource.address && item.resource.address.map(adr => (
                            <div className="det">
                              {adr.line.join('/') + ', ' + adr.city + ', ' + adr.state + ' ' + adr.postalCode}
                            </div>))}
                          <div >Tel. {item.resource.telecom && item.resource.telecom[0].value}</div>
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
          <Search placeholder="Search..." style={{marginBottom: '6px'}} enterButton="Search" size="large" onSearch={value => getDataOrg(value)} />
          {<Accordion >
            <List size="large" pagination={{pageSize: 10, onChange: ((page, size) => setPage(page))}} dataSource={result2} renderItem={ (item, i) => (
              <List.Item className="me">
                <Card style={{width: "100%", background: '#fff', border: 0}}>
                  <Accordion.Toggle as={Card.Header} eventKey={i} style={{padding: "0px 3px", background: '#fff', border: 0}}>
                    <List.Item.Meta
                      title={
                        <div className="row">
                          <div className="orgname">
                            {item.resource.name && item.resource.name}
                          </div>
                        </div>
                      }
                      description={
                        <div className="row" id="desc">
                          <div className="info">
                            {item.resource.address && item.resource.address[0].line + ', ' + item.resource.address[0].city + ', ' + item.resource.address[0].state + ' Tel. ' + item.resource.telecom[0].value}
                          </div>
                          <div className="info">
                            {item.resource.identifier && item.resource.identifier[0].value}
                          </div>
                        </div>
                      } />
                  </Accordion.Toggle>

                  <Accordion.Collapse eventKey={i}>
                    <Card.Body>
                      <Descriptions layout="vertical" >
                        <Descriptions.Item label="Type" span={2}>
                          {item.resource.type && item.resource.type.map((type, i) => (
                            <><span className="det">{type.text}</span>{
                              item.resource.type.length > 1 && i != item.resource.type.length - 1 && ' / '
                            }</>))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Identifier" span={2}>
                          {item.resource.identifier && item.resource.identifier.map(( id, i ) => (
                            <><span className="det">{id.value}</span>{item.resource.identifier.length > 1 && i != item.resource.identifier.length - 1 && ' / '}</>))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Contacts" span={4}>
                          {item.resource.contact && item.resource.contact.map(guy => (
                            <div className="det">
                              {guy.name.given.join(' ') + ' ' + guy.name.family + ', ' + guy.purpose.coding.code + ', Tel. ' + guy.telecom.value}
                            </div>))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Address">
                          {item.resource.address && item.resource.address.map(adr => (<div className="det">{adr.line.join('/') + ', ' + adr.city + ', ' + adr.state + ' ' + adr.postalCode}</div>))}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </List.Item>
            )}/>
           </Accordion>}
        </TabPane>
      </Tabs>
    </div>
  );
};
