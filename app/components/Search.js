import React, { useState, useEffect } from 'react';
import { Input, List, Tabs, Descriptions, Table, Collapse } from 'antd';
import { site_url } from '../config';
import Accordion from 'react-bootstrap/Accordion';
import { Card } from 'react-bootstrap';

const { Search } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

export const SearchResource = () => {
  //const [result, setResult] = useState([]);
  //const [result2, setResult2] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  //const [timePr, setTimePr] = useState(null);
  //const [timeOrg, setTimeOrg] = useState(null);
  const [state, setState] = useState({
    result: [],
    result2: [],
    timePr: null,
    timeOrg: null,
    loading: false,
  });

  const highlight = () => {
    let sel = document.querySelectorAll('.name, .qual, .info, .det, .orgname');
    for (let i = 0; i < sel.length; i++) {
      sel[i].innerHTML = sel[i].textContent;
    }
    if (search != '') {
      let s = search.replace(/[`~!@#$%^&*()_|\-=?;:'".<>\{\}\[\]\\\/]/gi, '');
      s = s.trim();
      let words = s.split(/\s*,| |[+]\s*/);
      words = words.filter(Boolean);
      words.map(w => {
        let regex = RegExp(`(${w})(?!([^<]+)?>)(?!([^&]+)?;)`, 'gi');
        for (let i = 0; i < sel.length; i++) {
          let inner = sel[i].innerHTML.replace(regex, function (replacement) {return '<span class="marker">'+replacement+'</span>'});
          sel[i].innerHTML = inner;
        }
      });
    }
  };

  useEffect(() => {
    highlight();
  }, [state.result, state.result2, page]);

  const getDataPr = input => {
    setSearch(input);
    setState({...state, loading: true});
    let query = `${site_url}/Practitioner`;
    let start = new Date();
    if (input != '')
      query = query +
      `/$lookup?name=lk&by=name.family,name.given,identifier.value;address.city,address.state,qualification.code.text;address.line&q=${input}&sort=name.family,name.given`;
    fetch(query)
      .then(r => r.json())
      .then(d => {
        setState({...state, result: d.entry, timePr: new Date() - start, loading: false});
      });
  };

  const getDataOrg = input => {
    setSearch(input);
    setState({...state, loading: true});
    let query = `${site_url}/Organization`;
    let start = new Date();
    if (input != '')
      query = query +
      `/$lookup?name=lk&by=name,contact.name.family,contact.name.given,identifier.value;address.city,address.state,type.text;address.line&q=${input}&sort=name`;
    fetch(query)
      .then(r => r.json())
      .then(d => {
        setState({...state, result2: d.entry, timeOrg: new Date() - start, loading: false});
      });
  };

  //console.log(result);
  //console.log(result2);
  const NoName = 'name unknown';
  const NoAddress = 'address unknown';
  const NoContact = 'no contacts specified';
  const NoType = 'type unknown';
  const NoId = 'no identifiers';
  const NoQual = 'qualification unknown';
  const NoGender = 'not stated';

  return (
    <div className="content">
      <Tabs defaultActiveKey='1' >
        <TabPane tab="Practitioner" key="1">
          <Search placeholder="Search..." className="searchbar" enterButton="Search" size="large" onSearch={value => getDataPr(value)} />
          <div className="timer">{state.timePr && 'Request took ' + state.timePr + ' ms'}</div>
          <Accordion style={{marginTop: "20px"}}>
            <List size="large" loading={state.loading} pagination={{pageSize: 30, onChange: ((page, size) => setPage(page))}} dataSource={state.result} renderItem={ (item, i) => (
              <List.Item >
                <Card style={{width: "100%", background: '#fff', border: 0}}>
                  <Accordion.Toggle className="clickable" as={Card.Header} eventKey={i} style={{padding: "0px 10px 0px 4px", background: '#fff', border: 0}}>
                    <List.Item.Meta
                      title={
                        <div className="row">
                          {item.resource.name ?
                           <div className="name">
                             {(item.resource.name[0].given && item.resource.name[0].given.join(' ')) +
                              (item.resource.name[0].family && ' ' + item.resource.name[0].family)}
                           </div> : NoName}
                          <div className="qual">{item.resource.qualification && item.resource.qualification[0].code.text}</div>
                        </div>
                      }
                      description={
                        <div className="row" id="desc">
                          {item.resource.address ?
                           <div className="info" >
                             {(item.resource.address[0].line && item.resource.address[0].line ) +
                              (item.resource.address[0].city && ', ' + item.resource.address[0].city ) +
                              (item.resource.address[0].state && ', ' + item.resource.address[0].state) +
                              (item.resource.telecom && item.resource.telecom[0].value && ' Tel. ' + item.resource.telecom[0].value)}
                           </div> : NoAddress }
                          {item.resource.identifier ?
                           <div className="info">
                             {item.resource.identifier[0].value && item.resource.identifier[0].value}
                           </div> : NoId}
                        </div>
                      } />
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={i}>
                    <Card.Body>
                      <Descriptions layout="vertical" >
                        <Descriptions.Item label="Full name" span={2}>
                          {item.resource.name ? item.resource.name.map(name => (
                            <div>
                              {name.prefix && name.prefix.join('/') + ' '}
                              <span className="det">{(name.given && name.given.join(' ')) + (name.family && ' ' + name.family)}</span>
                              {name.suffix && ' ' + name.suffix.join('/')}
                            </div>)) : NoName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Gender">
                          {item.resource.gender ? item.resource.gender : NoGender}
                        </Descriptions.Item>
                        <Descriptions.Item label="Qualification" span={2}>
                          {item.resource.qualification && item.resource.qualification.map((qual, i) => (
                            <>{qual.code.text ? <span className="det">{qual.code.text}</span> : NoQual}{
                              item.resource.qualification.length > 1 && i != item.resource.qualification.length - 1 && ' / '
                            }</>))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Identifier" span={2}>
                          {item.resource.identifier && item.resource.identifier.map(( id, i ) => (
                            <>{id.value ? <span className="det">{id.value}</span> : NoId}
                              {item.resource.identifier.length > 1 && i != item.resource.identifier.length - 1 && ' / '
                              }</>))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Address">
                          {item.resource.address ? item.resource.address.map(adr => (
                            <div className="det">
                              {( adr.line && adr.line.join('/') ) +
                               (adr.city && ', ' + adr.city) +
                               (adr.state && ', ' + adr.state) +
                               (adr.postalCode && ' ' + adr.postalCode)}
                            </div>)) : NoAddress}
                          <div >{item.resource.telecom && 'Tel. ' + item.resource.telecom[0].value}</div>
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
          <Search placeholder="Search..." enterButton="Search" size="large" onSearch={value => getDataOrg(value)} />
          <div className="timer">{state.timeOrg && 'Request took ' + state.timeOrg + ' ms'}</div>
          {<Accordion >
             <List size="large" loading={state.loading} pagination={{pageSize: 30, onChange: ((page, size) => setPage(page))}} dataSource={state.result2} renderItem={ (item, i) => (
              <List.Item>
                <Card style={{width: "100%", background: '#fff', border: 0}}>
                  <Accordion.Toggle className="clickable" as={Card.Header} eventKey={i} style={{padding: "0px 3px", background: '#fff', border: 0}}>
                    <List.Item.Meta
                      title={
                        <div className="row">
                          {item.resource.name ?
                           <div className="orgname">
                             { item.resource.name }
                           </div> : NoName
                          }
                        </div>
                      }
                      description={
                        <div className="row" id="desc">
                          {item.resource.address ?
                            <div className="info">
                              {( item.resource.address[0].line && item.resource.address[0].line )  +
                               ( item.resource.address[0].city && ', ' + item.resource.address[0].city ) +
                               ( item.resource.address[0].state && ', ' + item.resource.address[0].state ) +
                               ( item.resource.telecom && (' Tel. ' + item.resource.telecom[0].value)) }
                            </div> : NoAddress
                          }
                          {item.resource.identifier && item.resource.identifier[0].value ?
                           <div className="info">
                             {item.resource.identifier[0].value}
                           </div> : NoId
                          }
                        </div>
                      } />
                  </Accordion.Toggle>
                  {<Accordion.Collapse eventKey={i}>
                    <Card.Body>
                      <Descriptions layout="vertical" >
                        <Descriptions.Item label="Type" span={2}>
                          {item.resource.type ? item.resource.type.map((type, i) => (
                            <><span className="det">{type.text && type.text}</span>{
                              item.resource.type.length > 1 && i != item.resource.type.length - 1 && ' / '
                            }</>)) : NoType}
                        </Descriptions.Item>
                        <Descriptions.Item label="Identifier" span={2}>
                          {item.resource.identifier ? item.resource.identifier.map(( id, i ) => (
                            <><span className="det">{id.value}</span>
                              {item.resource.identifier.length > 1 && i != item.resource.identifier.length - 1 && ' / '}</>)) : NoId}
                        </Descriptions.Item>
                        <Descriptions.Item label="Contacts" span={4}>
                          {item.resource.contact ? item.resource.contact.map(guy => ( guy.name &&
                            <div className="det">
                              {(guy.name.given && guy.name.given.join(' ')) + (guy.name.family && ' ' + guy.name.family) + (guy.purpose && ', ' + guy.purpose.coding.code) + (guy.telecom && ', Tel. ' + guy.telecom.value )}
                            </div> )) : NoContact}
                        </Descriptions.Item>
                        <Descriptions.Item label="Address">
                          {item.resource.address ? item.resource.address.map(adr => (
                            <div className="det">
                              {(adr.line && adr.line.join('/')) + (adr.city && ', ' + adr.city ) + (adr.state && ', ' + adr.state ) + (adr.postalCode && ' ' + adr.postalCode )}
                            </div>)) : NoAddress}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card.Body>
                  </Accordion.Collapse>}
                </Card>
              </List.Item>
            )}/>
           </Accordion>}
        </TabPane>
      </Tabs>
    </div>
  );
};
