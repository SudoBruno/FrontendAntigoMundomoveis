import { Layout, Row, Col } from 'antd';
import React from 'react';

import { MachineProvider } from '../../contexts/Machine/MachineContext';
import { ButtonMachine } from '../../components/machine/ButtonMachine';
import { MachineTable } from '../../components/machine/TableMachine';

export default function Machine() {
  return (
    <MachineProvider>
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
            <ButtonMachine />
          </Col>
        </Row>

        <MachineTable />
      </Layout>
    </MachineProvider>
  );
}
