import React, { useState, useEffect } from 'react';

import { CSVLink } from 'react-csv';
import { Layout, Button, Row, Col, DatePicker } from 'antd';

import './style.css';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../../../../services/api';
const { RangePicker } = DatePicker;

export default function RawMaterial() {
  const [entry, setEntry] = useState([]);

  useEffect(() => {
    api.post('wmsrm/operation/entry/resume').then((response) => {
      setEntry(response.data);
    });
  }, []);
  const [intervalTime, setIntervalTime] = useState([]);

  async function Filter() {
    const data = {
      intervalTime: intervalTime,
    };
    const response = await api.post('wmsrm/operation/entry/resume', data);
    setEntry(response.data);
  }
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
        <Col span={12}>
          <RangePicker
            size="small"
            placeholder={['data inicial', 'data final']}
            onChange={setIntervalTime}
          />
          <SearchOutlined
            style={{
              fontSize: 18,
              color: '#3b4357',
              marginLeft: 8,
            }}
            onClick={Filter}
          />
        </Col>
        <Col span={12} align="end">
          <Button type="submit" className="buttonGreen">
            <DownloadOutlined style={{ marginRight: 8 }} />
            <CSVLink
              data={entry}
              filename="entrada Almoxarifado.csv"
              style={{ color: '#fff' }}
              separator={';'}
            >
              Download
            </CSVLink>
          </Button>
        </Col>
      </Row>
    </Layout>
  );
}
