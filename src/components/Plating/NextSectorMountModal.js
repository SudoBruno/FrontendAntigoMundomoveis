import { Button, Col, Divider, Form, Input, Modal, Row } from 'antd';
import React, { useContext } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { PlatingMountContext } from '../../contexts/Plating/Mount/PlatingMountContext';
import api from '../../services/api';
import { Notification } from '../Notification';

export function NextSectorMountModal() {
  const {
    amount,
    newAmount,
    setMovement,
    setIsReasonModalOpen,
    barCode,
    sectorId,
    setIsNextSectorMountModalOpen,
    productName,
    productionPlanControlName,
    color,
    subProductName,
    setNewAmount,
    handleScan
  } = useContext(PlatingMountContext);

  const nextSector = async () => {
    if (amount != newAmount) {
      setIsReasonModalOpen(true);
      setMovement('output');
    } else {
      try {
        await api.put('plating/mount/finish', {
          amountOutput: newAmount,
          barCode,
          sectorId,
        });
        setIsNextSectorMountModalOpen(false);
        Notification(
          'success',
          'Monte finalizado',
          'Monte finalizado com sucesso'
        );
      } catch (error) {
        Notification(
          'error',
          'Erro ao finalizar o monte',
          'Ocorreu um erro ao finalizar o monte'
        );
      }
    }
  };

  return (
    <>
      <BarcodeReader onScan={handleScan} minLength={4} onError={handleScan} />
      <Modal
        title="Passar para o proximo setor"
        visible={true}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            onClick={(e) => {
              setIsNextSectorMountModalOpen(false);
            }}
          >
            Cancelar
          </Button>,
          <Button type="primary" onClick={nextSector}>
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="PCP:" labelAlign={'left'}>
              <Input name="pcp" value={productionPlanControlName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Produto:"
              labelAlign={'left'}
            >
              <Input name="product" value={productName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="Cor:" labelAlign={'left'}>
              <Input name="color" value={color} disabled />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={5}>
          <Col span={16}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="SubProduto:"
              labelAlign={'left'}
            >
              <Input name="subProduct" value={subProductName} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Quantidade:"
              labelAlign={'left'}
            >
              <Input
                name="amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
