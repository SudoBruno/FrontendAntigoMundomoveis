import { SettingsSystemDaydream } from '@material-ui/icons';
import { Col, Button, Modal, Form, Input, Row, Select } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { ReasonStopContext } from '../../../contexts/Machine/ReasonStopContext';
import api from '../../../services/api';
import { Notification } from '../../Notification';

const Option = Select.Option;

export function CreateReasonStopModal() {
  const {
    closeCreateReasonStopModal,
    createReasonStop,
    description,
    setDescription,
    name,
    setName,
  } = useContext(ReasonStopContext);

  return (
    <Modal
      title="Cadastro de parada máquina"
      visible={true}
      onCancel={closeCreateReasonStopModal}
      width={800}
      footer={[
        <Button key="back" type="default" onClick={closeCreateReasonStopModal}>
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
              createReasonStop(name, description);
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
          <Form.Item
            labelCol={{ span: 23 }}
            label="Descrição:"
            labelAlign={'left'}
          >
            <Input
              name="amount"
              placeholder="Descrição do problema"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Modal>
  );
}
