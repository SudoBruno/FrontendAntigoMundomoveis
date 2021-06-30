import { Col, Form, Input, Modal, Row, Select, Button } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { PlatingMountContext } from '../../contexts/Plating/Mount/PlatingMountContext';
import api from '../../services/api';

const Option = Select.Option;

const { TextArea } = Input;

export function SelectMachineModal() {
  const {
    machineId,
    handleSelectMachine,
    isSelectMachineModalOpen,
    setMachineId,
  } = useContext(PlatingMountContext);

  const [machines, setMachines] = useState([{}]);

  useEffect(() => {
    api.get('machine', {}).then((response) => {
      setMachines(response.data);
    });
  }, []);

  const handleChangeMachine = async (e) => {
    setLoading(true);
    setMachineId(e);
    const filterMachine = machines.find(
      (machine) => machine.id === parseInt(e)
    );
    setMachineName(filterMachine.name);
    setLoading(false);
  };

  const [machineName, setMachineName] = useState();

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      title="Selecione a maquina"
      visible={isSelectMachineModalOpen}
      width={500}
      footer={[
        <Button key="back">Cancelar</Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={(e) => handleSelectMachine(machineId)}
        >
          Ok
        </Button>,
      ]}
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
              value={machineName}
              onChange={(e) => {
                handleChangeMachine(e);
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
      <BarcodeReader
        onScan={handleChangeMachine}
        onError={handleChangeMachine}
      />
    </Modal>
  );
}
