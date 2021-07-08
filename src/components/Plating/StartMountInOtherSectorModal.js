import { Button, Col, Divider, Form, Input, Modal, Row } from 'antd';
import React, { useContext } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { PlatingMountContext } from '../../contexts/Plating/Mount/PlatingMountContext';

export function StartMountInOtherSectorModal() {
  const {
    startMountOtherSector,
    productionPlanControlName,
    productName,
    color,
    subProductName,
    newAmount,
    setNewAmount,
    setShowAlterMountRoute,
    handleScan
  } = useContext(PlatingMountContext);

  return (
    <>
      <BarcodeReader onScan={handleScan} minLength={4} onError={handleScan} />
      <Modal
        title="Iniciar monte em setor diferente do programado"
        visible={true}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            onClick={(e) => setShowAlterMountRoute(false)}
          >
            Cancelar
          </Button>,
          <Button type="primary" onClick={startMountOtherSector}>
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
