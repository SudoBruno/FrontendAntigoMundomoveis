import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { Layout,  Button, Row,   Col } from 'antd';


import { DownloadOutlined } from '@ant-design/icons';

import api from '../../../../services/api';

export default function ExitResume() {
  const [exit, setExit] = useState([]);

  useEffect(() => {
    api.get('/wmsrm/exit/resume').then((response) => {
      setExit(response.data);
      
    });
  }, []);

  return (
    <Layout
      style={{
        margin: '24px 16px',
        padding: '21px 24px 24px 24px',
        background: '#fff',
        minHeight: 280,
      }}
    >
      <Row style={{ marginBottom: 16 }}>
        
        <Col span={24} align="end">
          <Button type="submit" className="buttonGreen">
           
          
              <DownloadOutlined style={{ marginRight: 8 }} />
              <CSVLink data={exit} filename='saida Almoxarifado.csv' 
              style={{ color: '#fff' }} separator={';'}>
                Download
              </CSVLink>
            
             
          </Button>
        </Col>
      </Row>
    </Layout>
  );
}
