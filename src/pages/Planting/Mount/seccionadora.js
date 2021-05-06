import { PlusOutlined } from '@ant-design/icons';
import { Tooltip } from '@material-ui/core';
import { Button, Col, Layout, Row, Select } from 'antd';
import React from 'react';
import { SeccionadoraTable } from '../../../components/Plating/Seccionadora/SeccionadoraTable';
import { SelectMachineModal } from '../../../components/Plating/SelectMachineModal';
import { MachineStopProvider } from '../../../contexts/Machine/MachineStopContext';
import { PlatingMountProvider } from '../../../contexts/Plating/Mount/PlatingMountContext';
import { SeccionadoraMountProvider } from '../../../contexts/Plating/Mount/SeccionadoraMountContext';

const Option = Select.Option;

export default function Seccionadora() {
  return (
    <PlatingMountProvider>
      <SeccionadoraMountProvider>
        <Layout
          style={{
            margin: '24px 16px',
            padding: '21px 24px 24px 24px',
            background: '#fff',
            minHeight: 280,
          }}
        >
          {/* <BarcodeReader onScan={handleScan} onError={handleScan} /> */}
          <Row style={{ marginBottom: 16 }}>
            <Col span={12} align="left">
              <MachineStopProvider />
            </Col>
            <Col span={12} align="right">
              <Tooltip title="Seccionadora" placement="right">
                <Button
                  className="buttonGreen"
                  icon={<PlusOutlined />}
                  style={{ marginRight: 5, fontSize: '14px' }}
                >
                  Seccionadora
                </Button>
              </Tooltip>
            </Col>
          </Row>
          <SeccionadoraTable />

          <SelectMachineModal />
        </Layout>
      </SeccionadoraMountProvider>
    </PlatingMountProvider>
  );
}
