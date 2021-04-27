import { Col, Button, Modal, Form, Input, Row, Select } from 'antd';
import React, { useState, useEffect, useContext } from 'react';

import api from '../../../services/api';
import { Notification } from '../../Notification';
import { MachineStopContext } from '../../../contexts/Machine/MachineStopContext';

const Option = Select.Option;

const { TextArea } = Input;

export function FinishStopMachineModal() {
  const {
    closeFinishStopMachineModal,

    reasonStopMachineId,
    finishStopMachine,
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
      onCancel={closeFinishStopMachineModal}
      width={800}
      footer={[
        <Button key="back" type="default" onClick={closeFinishStopMachineModal}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={(e) => {
            if (
              reasonStopMachineId === '' ||
              reasonStopMachineId === null ||
              reasonStopMachineId === undefined
            ) {
              Notification(
                'error',
                'Erro ao cadastrar parada de maquina',
                'Nome não é valido'
              );
            } else {
              finishStopMachine();
            }
          }}
        >
          Salvar
        </Button>,
      ]}
    >
      <Row gutter={5}>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 23 }}
            label="Motivo da parada"
            labelAlign={'left'}
          >
            <Select
              showSearch
              placeholder="Selecione"
              size="large"
              value={reasonStopMachineId}
              disabled
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {reasonStop.map((option) => {
                return (
                  <>
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  </>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 23 }}
            label="Descreva o motivo:"
            labelAlign={'left'}
          >
            <TextArea
              name="description"
              placeholder="Descreva o motivo da parada"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Modal>
  );
}
