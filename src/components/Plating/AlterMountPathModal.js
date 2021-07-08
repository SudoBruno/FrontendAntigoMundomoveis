import { Button, Col, Input, Modal, Row, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { PlatingMountContext } from '../../contexts/Plating/Mount/PlatingMountContext';
import api from '../../services/api';

const Option = Select.Option;

const { TextArea } = Input;

export function AlterMountPathModal() {
  const { setIsAlterPathModalOpen, setShowAlterMountRoute, handleScan } = useContext(
    PlatingMountContext
  );

  const [machines, setMachines] = useState([{}]);
  useEffect(() => {
    api.get('machine', {}).then((response) => {
      setMachines(response.data);
    });
  }, []);

  return (
    <>
      <BarcodeReader onScan={handleScan} minLength={4} onError={handleScan} />
      <Modal
        title="Alteração no caminho do monte"
        visible={true}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            onClick={() => setIsAlterPathModalOpen(false)}
          >
            Cancelar
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              setShowAlterMountRoute(true);
              setIsAlterPathModalOpen(false);
            }}
          >
            Sim
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={24}>
            <h3>
              Você está tentando iniciar um monte em um setor diferente do
              programado, deseja continuar?
            </h3>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
