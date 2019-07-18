import React, { useState, useEffect } from 'react';
import { Input, List } from 'antd';
import { site_url } from '../config';
import useStoreon from 'storeon/react';

const { Search } = Input;

export const SearchResource = () => {
  const { token } = useStoreon('token');
  const [result, setResult] = useState([]);

  const getData = input => {
    if (token) {
      let query = `${site_url}/Practitioner`;
      if (input != '')
        query = query + `/$lookup?by=name.family,name.given&q=${input}&sort=name.family,name.given`;
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

  //console.log(result);

  return (
    <div className="content">
      <Search placeholder="Enter resource name" enterButton="Search" size="large" onSearch={value => getData(value)} />
      <List size="large" pagination={{pageSize: 10}} dataSource={result} renderItem={ (item) => (
        <List.Item >
          {item.resource.name.map((name, i) => (
            <div key={i}>
              {name.given.map(given => (<>{given} </>))} {name.family}
            </div>
          ))}
        </List.Item>
      )}/>
    </div>
  );
};
