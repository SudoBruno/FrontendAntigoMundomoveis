import { Col, Button, Modal, Form, Input, Row, Select } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { MachineContext } from '../../contexts/Machine/MachineContext';
import api from '../../services/api';
import { Notification } from '../Notification';

const Option = Select.Option;

export function EditMachineModal() {
  const {
    closeEditMachineModal,
    editMachine,
    sector,
    setSector,
    name,
    setName,
  } = useContext(MachineContext);
  const [sectors, setSectors] = useState([{}]);

  useEffect(() => {
    api.get('sector', {}).then((response) => {
      setSectors(response.data);
    });
  }, []);
  return (
    <Modal
      title="Cadastro de máquina"
      visible={true}
      onCancel={closeEditMachineModal}
      width={800}
      footer={[
        <Button key="back" type="default" onClick={closeEditMachineModal}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={(e) => {
            if (name === '' || name === null || name === undefined) {
              Notification(
                'error',
                'Erro ao cadastrar maquina',
                'Nome não é valido'
              );
            } else {
              editMachine(name, sector);
            }
          }}
        >
          Salvar
        </Button>,
      ]}
    >
      <Row gutter={5}>
        <Col span={12}>
          <Form.Item labelCol={{ span: 23 }} label="Nome:" labelAlign={'left'}>
            <Input
              name="amount"
              placeholder="Nome da maquina"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item labelCol={{ span: 23 }} label="Setor" labelAlign={'left'}>
            <Select
              showSearch
              placeholder="Selecione"
              size="large"
              value={sector}
              onChange={(e) => {
                setSector(e);
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {sectors.map((option) => {
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
      </Row>
    </Modal>
  );
}
