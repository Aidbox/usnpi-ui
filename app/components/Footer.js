import React from 'react';

export default () => (
  <div style={{
    width: '100%',
    background: '#fafafa'
  }}>

    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '120px',
      paddingBottom: '10px',
    }}>
      <div style={{marginRight: '3rem'}}>
        <a className="credits" href="https://www.health-samurai.io/aidbox" >
          <div style={{
            fontFamily: "'Gotham Pro', Arial, Sans-Serif",
            fontWeight: "800",
            fontSize: "18px",
            lineHeight: "30px",
            color: "#515151",
          }}>Powered by </div>
          <img style={{
            opacity: '0.9',
            filter: 'alpha(opacity=90)',
            maxWidth: '80%',
            height: 'auto',
          }} src="https://uploads-ssl.webflow.com/57441aa5da71fdf07a0a2e19/5a627061e27c0000017f097c_new-logo-aidbox.svg" />
        </a>
      </div>
      <a className="credits" href="https://www.health-samurai.io/">
        <div>
          <img style={{
            opacity: '0.9',
            filter: 'alpha(opacity=90)',
            maxWidth: '80%',
            height: 'auto',
            paddingTop: '2rem',
            paddingBottom: '1rem'
          }} src="https://uploads-ssl.webflow.com/57441aa5da71fdf07a0a2e19/5a5530dbcf0636000108521f_new-hslogo.svg" />
        </div>
      </a>
    </div>
  </div>

)
