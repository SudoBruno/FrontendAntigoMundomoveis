import { Layout, Row, Col } from 'antd';
import React from 'react';
import { ButtonReasonStop } from '../../components/machine/ReasonStop/ButtonReasonStop';
import { ReasonStopTable } from '../../components/machine/ReasonStop/TableReasonStop';
import { ReasonStopProvider } from '../../contexts/Machine/ReasonStopContext';

export default function ReasonStopMachine() {
  return (
    <ReasonStopProvider>
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
            <ButtonReasonStop />
          </Col>
        </Row>

        <ReasonStopTable />
      </Layout>
    </ReasonStopProvider>
  );
}
