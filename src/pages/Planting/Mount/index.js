import { Col, Layout, Row, Select } from 'antd';
import React from 'react';
import { Notification } from '../../../components/Notification';
import { PlatingTable } from '../../../components/Plating/PlatingTable';
import { SelectMachineModal } from '../../../components/Plating/SelectMachineModal';
import { MachineStopProvider } from '../../../contexts/Machine/MachineStopContext';
import { PlatingMountProvider } from '../../../contexts/Plating/Mount/PlatingMountContext';
import './style.css';

const Option = Select.Option;

export default function PlantingMount() {
  // const alterRoute = () => {
  //   Notification('success', 'caminho alterado', 'caminho alterado!');
  //   setAlterMountRoute(true);
  //   setShowAlterMountRoute(false);

  //   setShowStartOtherSector(true);
  // };

  return (
    <PlatingMountProvider>
      <Layout
        style={{
          margin: '24px 16px',
          padding: '21px 24px 24px 24px',
          background: '#fff',
          minHeight: 280,
        }}
      >
        <Row style={{ marginBottom: 16 }}>
          <Col span={24} align="left">
            <MachineStopProvider></MachineStopProvider>
          </Col>
        </Row>
        <PlatingTable />
        {/* <SearchTable /> */}
        {/* selecionar setor */}
        <SelectMachineModal />
      </Layout>
    </PlatingMountProvider>
  );
}
