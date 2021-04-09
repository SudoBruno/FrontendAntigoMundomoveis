import React, { useContext, useEffect, useState } from 'react';
import {
  Layout,
  Table,
  Button,
  Row,
  Col,
  Input,
  Space,
  Modal,
  Form,
  Select,
  notification,
  Divider,
} from 'antd';

import BarcodeReader from 'react-barcode-reader';

import api from '../../../services/api';

import './style.css';
import { PlatingMountProvider } from '../../../contexts/Plating/Mount/PlatingMountContext';
import { StopMachineButton } from '../../../components/Plating/StopMachine/StopMachineButton';
import { SelectMachineModal } from '../../../components/Plating/SelectMachineModal';
import { PlatingTable } from '../../../components/Plating/PlatingTable';

const Option = Select.Option;

const { TextArea } = Input;

export default function PlantingMount() {
  const [mounts, setMounts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sectorId, setSectorId] = useState(0);

  // const [machineId, setMachineId] = useState('');

  const [alterMountRoute, setAlterMountRoute] = useState(false);
  const [showAlterMountRoute, setShowAlterMountRoute] = useState(false);

  const [barCode, setBarCode] = useState('');

  const [showInNextSector, setShowInNextSector] = useState(false);

  const [color, setColor] = useState('');
  const [productName, setProductName] = useState('');
  const [productionPlanControlName, setProductionPlanControlName] = useState(
    ''
  );
  const [subProductName, setSubProductName] = useState('');
  const [amount, setAmount] = useState(0);
  const [newAmount, setNewAmount] = useState(0);

  const [showStart, setShowStart] = useState(false);

  const [showStartOtherSector, setShowStartOtherSector] = useState(false);

  const [isFinish, setIsFinish] = useState(false);

  const [reason, setReason] = useState('');
  const [showReason, setShowReason] = useState(false);
  const [movement, setMovement] = useState('');
  const [mountId, setMountId] = useState(0);
  useEffect(() => {
    api.get(`plating/mount/sector/${sectorId}`, {}).then((response) => {
      setMounts(response.data);
    });
  }, [refreshKey]);

  // const handleSelectMachine = async (e) => {
  //   setRefreshKey((refreshKey) => refreshKey + 1);
  //   setMachineId(e);
  //   const response = await api.get(`machine/${e}`);
  //   setSectorId(response.data.factory_sector_id);

  //   const mounts = await api.get(
  //     `plating/mount/sector/${response.data.factory_sector_id}`
  //   );

  //   setMounts(mounts.data);
  //   console.log(e);
  //   setShowMachine(false);
  // };

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  const handleScan = async (e) => {
    const response = await api.get(`plating/mount/tag/${e}/sector/${sectorId}`);
    setBarCode(e);

    if (response.data.finish == null) {
      if (response.data.showSector == 0) {
        openNotificationWithIcon('error', 'setor errado', 'Setor errado!');
        setShowAlterMountRoute(true);
      } else {
        if (response.data.start == null) {
          setShowStart(true);
        } else {
          setShowInNextSector(true);
        }
      }
    } else {
      openNotificationWithIcon(
        'error',
        'Monte ja finalizado',
        'Esse monte ja foi finalizado'
      );
    }

    setColor(response.data.color);
    setProductName(response.data.productName);
    setProductionPlanControlName(response.data.pcp);
    setSubProductName(response.data.subProductName);
    setAmount(response.data.amount);
    setNewAmount(response.data.amount);
    setMountId(response.data.id);
  };

  const alterRoute = () => {
    openNotificationWithIcon(
      'success',
      'caminho alterado',
      'caminho alterado!'
    );
    setAlterMountRoute(true);
    setShowAlterMountRoute(false);

    setShowStartOtherSector(true);
  };

  const nextSector = async () => {
    if (amount != newAmount) {
      setShowReason(true);
      setMovement('output');
    } else {
      try {
        await api.put('plating/mount/finish', {
          amountOutput: newAmount,
          barCode,
          sectorId,
        });
        setShowInNextSector(false);
        openNotificationWithIcon(
          'success',
          'Monte finalizado',
          'Monte finalizado com sucesso'
        );
        setRefreshKey((refreshKey) => refreshKey + 1);
      } catch (error) {
        openNotificationWithIcon(
          'error',
          'Erro ao finalizar o monte',
          'Ocorreu um erro ao finalizar o monte'
        );
      }
    }
  };

  const startMount = async () => {
    if (amount != newAmount) {
      setShowReason(true);
      setMovement('input');
    } else {
      try {
        await api.put('plating/mount/alter/start', {
          amountInput: newAmount,
          barCode,
          sectorId,
          employeeId: localStorage.getItem('userId'),
          // machineId,
        });
        setShowStart(false);
        openNotificationWithIcon(
          'success',
          'Monte iniciado',
          'Monte iniciado com sucesso'
        );
        setRefreshKey((refreshKey) => refreshKey + 1);
      } catch (error) {
        openNotificationWithIcon(
          'error',
          'Erro ao iniciar o monte',
          'Ocorreu um erro ao iniciar o monte'
        );
      }
    }
  };

  const startMountOtherSector = async () => {
    if (amount != newAmount) {
      setShowReason(true);
      setMovement('input');
    } else {
      try {
        await api.put('plating/mount/alter/start', {
          amountInput: newAmount,
          barCode,
          sectorId,
          employeeId: localStorage.getItem('userId'),
          // machineId,
        });
        setShowStartOtherSector(false);
        openNotificationWithIcon(
          'success',
          'Monte iniciado',
          'Monte iniciado com sucesso'
        );
        setRefreshKey((refreshKey) => refreshKey + 1);
      } catch (error) {
        openNotificationWithIcon(
          'error',
          'Erro ao iniciar o monte',
          'Ocorreu um erro ao iniciar o monte'
        );
      }
    }
  };

  const handleSaveReason = async () => {
    setShowReason(false);

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
    <PlatingMountProvider>
      <Layout
        style={{
          margin: '24px 16px',
          padding: '21px 24px 24px 24px',
          background: '#fff',
          minHeight: 280,
        }}
      >
        <BarcodeReader onScan={handleScan} onError={handleScan} />
        <Row style={{ marginBottom: 16 }}>
          <Col span={24} align="left">
            <StopMachineButton />
          </Col>
        </Row>
        <PlatingTable />
        {/* <SearchTable /> */}
        {/* selecionar setor */}
        <SelectMachineModal />
        {/* alterar caminho do monte */}
        <Modal
          title="Alteração no caminho do monte"
          visible={showAlterMountRoute}
          width={700}
          footer={[
            <Button
              key="back"
              type="default"
              onClick={() => setShowAlterMountRoute(false)}
            >
              Cancelar
            </Button>,
            <Button type="primary" onClick={alterRoute}>
              Sim
            </Button>,
          ]}
        >
          <Row gutter={5}>
            <Col span={24}>
              <h3>
                Você está tentando iniciar um monte em um setor diferente do
                programado, deseja continuar?
              </h3>
            </Col>
          </Row>
        </Modal>
        {/* modal passar mount para o proximo setor */}
        <Modal
          title="Passar para o proximo setor"
          visible={showInNextSector}
          width={700}
          footer={[
            <Button
              key="back"
              type="default"
              onClick={(e) => {
                setShowInNextSector(false);
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
              <Form.Item
                labelCol={{ span: 23 }}
                label="PCP:"
                labelAlign={'left'}
              >
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
              <Form.Item
                labelCol={{ span: 23 }}
                label="Cor:"
                labelAlign={'left'}
              >
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

        {/* modal start mount */}
        <Modal
          title="Iniciar monte"
          visible={showStart}
          width={700}
          footer={[
            <Button
              key="back"
              type="default"
              onClick={(e) => setShowStart(false)}
            >
              Cancelar
            </Button>,
            <Button type="primary" onClick={startMount}>
              Salvar
            </Button>,
          ]}
        >
          <Row gutter={5}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="PCP:"
                labelAlign={'left'}
              >
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
              <Form.Item
                labelCol={{ span: 23 }}
                label="Cor:"
                labelAlign={'left'}
              >
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

        {/* modal iniciando monte em setor diferente do programado */}

        <Modal
          title="Iniciar monte em setor diferente do programado"
          visible={showStartOtherSector}
          width={700}
          footer={[
            <Button
              key="back"
              type="default"
              onClick={(e) => setShowStartOtherSector(false)}
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
              <Form.Item
                labelCol={{ span: 23 }}
                label="PCP:"
                labelAlign={'left'}
              >
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
              <Form.Item
                labelCol={{ span: 23 }}
                label="Cor:"
                labelAlign={'left'}
              >
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

        {/* modal quantidade diferente */}
        <Modal
          title="Percebemos que a quantidade que foi dada entrada é diferente da que chegou, descreva o motivo"
          visible={showReason}
          width={500}
          footer={[
            <Button type="primary" onClick={(e) => setShowReason(false)}>
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
      </Layout>
    </PlatingMountProvider>
  );
}
