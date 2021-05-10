import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { MachineStopContext } from '../../../contexts/Machine/MachineStopContext';
import api from '../../../services/api';
import { Notification } from '../../Notification';

const Option = Select.Option;

const { TextArea } = Input;

export function FinishStopMachineModal() {
  const {
    closeFinishStopMachineModal,
    reasonStopMachineId,
    finishStopMachine,
    description,
    setDescription,
    setStartDate,
    setFinishDate,
    startDate,
  } = useContext(MachineStopContext);
  const [reasonStop, setReasonStop] = useState([{}]);
  const dateFormat = 'DD/MM/YYYY HH:mm';

  useEffect(() => {
    api.get('reason-stop', {}).then((response) => {
      setReasonStop(response.data);
    });
  }, []);

  function alterFinishDate(value) {
    setFinishDate(value._d);
  }
  function alterStartDate(value) {
    setStartDate(value._d);
  }
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
      <Row gutter={5}>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 23 }}
            label="Selecione a hora de inicio da parada:"
            labelAlign={'left'}
          >
            <DatePicker
              showTime
              onOk={alterStartDate}
              format={'DD/MM/YYYY HH:mm'}
              size={'small'}
              defaultValue={moment(startDate, 'YYYY/MM/DD HH:mm')}
            />
            {console.log(moment(startDate, 'YYYY/MM/DD HH:mm'))}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 23 }}
            label="Selecione a hora de fim da parada:"
            labelAlign={'left'}
          >
            <DatePicker
              showTime
              onOk={alterFinishDate}
              size="small"
              format={'DD/MM/YYYY HH:mm'}
              size={'small'}
            />
          </Form.Item>
        </Col>
      </Row>
    </Modal>
  );
}
