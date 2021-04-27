import { Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { PlatingMountContext } from '../../contexts/Plating/Mount/PlatingMountContext';
import api from '../../services/api';

const Option = Select.Option;

const { TextArea } = Input;

export function SelectMachineModal() {
  const {
    machineId,
    handleSelectMachine,
    isSelectMachineModalOpen,
  } = useContext(PlatingMountContext);

  const [machines, setMachines] = useState([{}]);
  useEffect(() => {
    api.get('machine', {}).then((response) => {
      setMachines(response.data);
    });
  }, []);

  return (
    <Modal
      title="Alteração no caminho do monte"
      visible={true}
      width={700}
      footer={[
        <Button
          key="back"
          type="default"
          onClick={() => setShowAlterMountRoute(false)}
        >
          Cancelar
        </Button>,
        <Button type="primary" onClick={alterRoute}>
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
  );
}
