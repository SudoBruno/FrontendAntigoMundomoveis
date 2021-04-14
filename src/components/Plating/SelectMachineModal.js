import { Col, Button, Modal, Form, Input, Row, Select } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { PlatingMountContext } from '../../contexts/Plating/Mount/PlatingMountContext';
import api from '../../services/api';
import { Notification } from '../Notification';

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
      title="Selecione a maquina"
      visible={isSelectMachineModalOpen}
      width={500}
    >
      <Row gutter={5}>
        <Col span={24}>
          <Form.Item
            labelCol={{ span: 23 }}
            label="Selecione sua maquina:"
            labelAlign={'left'}
          >
            <Select
              showSearch
              placeholder="Selecione"
              size="large"
              value={machineId}
              onChange={(e) => handleSelectMachine(e)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {machines.map((option) => {
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
