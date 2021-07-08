import { Button, Col, Input, Modal, Row } from 'antd';
import React, { useContext, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { PlatingMountContext } from '../../contexts/Plating/Mount/PlatingMountContext';
import api from '../../services/api';

const { TextArea } = Input;

export function DifferentAmountModal() {
  const {
    newAmount,
    amount,
    setAmount,
    setIsReasonModalOpen,
    mountId,
    movement,
    handleScan
  } = useContext(PlatingMountContext);

  const [reason, setReason] = useState('');

  const handleSaveReason = async () => {
    setIsReasonModalOpen(false);

    await api.post('plating/loser/mount', {
      amountInput: amount,
      amountOutput: newAmount,
      mountId,
      movement,
      reason,
    });
    setAmount(newAmount);
  };

  return (
    <>
      <BarcodeReader onScan={handleScan} minLength={4} onError={handleScan} />
      <Modal
        title="Percebemos que a quantidade que foi dada entrada é diferente da que chegou, descreva o motivo"
        visible={true}
        width={500}
        footer={[
          <Button type="primary" onClick={(e) => setIsReasonModalOpen(false)}>
            cancelar
          </Button>,
          <Button type="primary" onClick={handleSaveReason}>
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={24}>
            <TextArea rows={4} onChange={(e) => setReason(e.target.value)} />
          </Col>
        </Row>
      </Modal>
    </>
  );
}
