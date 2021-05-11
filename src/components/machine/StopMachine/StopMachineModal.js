import { Col, Button, Modal, Form, Input, Row, Select } from 'antd';
import React, { useState, useEffect, useContext } from 'react';

import api from '../../../services/api';
import { Notification } from '../../Notification';
import { MachineStopContext } from '../../../contexts/Machine/MachineStopContext';

const Option = Select.Option;

const { TextArea } = Input;

export function StopMachineModal() {
  const {
    closeCreateStopMachineModal,
    setReasonStopMachineId,
    reasonStopMachineId,
    createStopMachine,
    description,
    setDescription,
  } = useContext(MachineStopContext);
  const [reasonStop, setReasonStop] = useState([{}]);

  useEffect(() => {
    api.get('reason-stop', {}).then((response) => {
      setReasonStop(response.data);
    });
  }, []);
  return (
    <Modal
      title="Parada de maquina"
      visible={true}
      onCancel={closeCreateStopMachineModal}
      width={800}
      footer={[
        <Button key="back" type="default" onClick={closeCreateStopMachineModal}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={(e) => {
            createStopMachine();
          }}
        >
          Salvar
        </Button>,
      ]}
    >
      <Row gutter={5}>
        <h1>Você realmente deseja para esta maquina?</h1>
      </Row>
    </Modal>
  );
}
