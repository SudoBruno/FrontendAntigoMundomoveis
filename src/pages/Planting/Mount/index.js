import { Button, Col, Form, Layout, Row, Select, Input, Divider } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { PlatingTable } from '../../../components/Plating/PlatingTable';
import api from '../../../services/api';
import { Notification } from '../../../components/Notification';
import './style.css';

const Option = Select.Option;
const { TextArea } = Input;


export default function PlantingMount() {
  // const alterRoute = () => {
  //   Notification('success', 'caminho alterado', 'caminho alterado!');
  //   setAlterMountRoute(true);
  //   setShowAlterMountRoute(false);

  //   setShowStartOtherSector(true);
  // };

  const [isSelectMachineModalOpen, setIsSelectMachineModalOpen] =
    useState(true);
  const [showAlterMountRoute, setShowAlterMountRoute] = useState(false);
  const [sectorId, setSectorId] = useState(1);

  const [machines, setMachines] = useState([{}]);
  const [machineId, setMachineId] = useState('');
  const [machineName, setMachineName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStopMachine, setIsStopMachine] = useState(false);

  const [isNextSectorMountModalOpen, setIsNextSectorMountModalOpen] =
    useState(false);
  const [barCode, setBarCode] = useState('');

  const [isAlterPathModalOpen, setIsAlterPathModalOpen] = useState(false);
  const [color, setColor] = useState('');
  const [productName, setProductName] = useState('');
  const [productionPlanControlName, setProductionPlanControlName] =
    useState('');
  const [subProductName, setSubProductName] = useState('');
  const [amount, setAmount] = useState(0);
  const [newAmount, setNewAmount] = useState(0);
  const [isStartMountModalOpen, setIsStartMountModalOpen] = useState(false);
  const [mountId, setMountId] = useState(0);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [movement, setMovement] = useState('');
  const [reason, setReason] = useState('');


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

  const handleSelectMachine = async () => {

    const isStop = await api.get(`machine-stop/machine/${machineId}`);

    if (isStop.data) {
      Notification(
        'error',
        'Maquina parada',
        'essa maquina esta parada, para continuar finalize a manutenção'
      );
      setIsStopMachine(true);
    } else {
      const response = await api.get(`machine/${machineId}`);
      setSectorId(response.data.factory_sector_id);

      setIsStopMachine(false);
    }
    setIsSelectMachineModalOpen(false);

  };

  const handleScan = async (e) => {

    if (isStopMachine) {
      Notification(
        'error',
        'Maquina parada',
        'Essa maquina se encontra parada, finalize a manutenção para continuar utilizando'
      );
    } else {
      const response = await api.get(
        `plating/mount/tag/${e}/sector/${sectorId}`
      );

      setBarCode(e);

      if (response.data.id === undefined) {
        Notification('error', 'Setor errado', 'Sub produto nao cadastrado nesse setor');
      } else if (response.data.finish === null && response.data.showSector == 0) {

        Notification('error', 'setor errado', 'Setor errado!');

        setIsAlterPathModalOpen(true);
      } else if (response.data.start === null) {

        setIsStartMountModalOpen(true);
      } else if (response.data.start !== null && response.data.finish === null) {
        setIsNextSectorMountModalOpen(true);
      } else if (response.data.finish !== null) {
        Notification('error', 'Monte já finalizado', 'Esse monte ja foi finalizado!');
      }

      setColor(response.data.color);
      setProductName(response.data.productName);
      setProductionPlanControlName(response.data.pcp);
      setSubProductName(response.data.subProductName);
      setAmount(response.data.amount);
      setNewAmount(response.data.amount);
      setMountId(response.data.id);
    }

  };

  const startMount = async () => {
    if (amount != newAmount) {
      setIsReasonModalOpen(true);
      setMovement('input');
    } else {
      try {
        await api.put('plating/mount/alter/start', {
          amountInput: newAmount,
          barCode,
          sectorId,
          employeeId: localStorage.getItem('userId'),
          machineId,
        });
        setIsStartMountModalOpen(false);
        Notification('success', 'Monte iniciado', 'Monte iniciado com sucesso');
      } catch (error) {
        Notification(
          'error',
          'Erro ao iniciar o monte',
          'Ocorreu um erro ao iniciar o monte'
        );
      }
    }
  };

  const startMountOtherSector = async () => {
    if (amount != newAmount) {
      setIsReasonModalOpen(true);
      setMovement('input');
    } else {
      try {
        await api.put('plating/mount/alter/start', {
          amountInput: newAmount,
          barCode,
          sectorId,
          employeeId: localStorage.getItem('userId'),
          machineId,
        });

        Notification('success', 'Monte iniciado', 'Monte iniciado com sucesso');
        setShowAlterMountRoute(false);
      } catch (error) {
        Notification(
          'error',
          'Erro ao iniciar o monte',
          'Ocorreu um erro ao iniciar o monte'
        );
      }
    }
  };

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

  const nextSector = async () => {
    if (amount != newAmount) {
      setIsReasonModalOpen(true);
      setMovement('output');
    } else {
      try {
        const response = await api.put('plating/mount/finish', {
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

    <Layout
      style={{
        margin: '24px 16px',
        padding: '21px 24px 24px 24px',
        background: '#fff',
        minHeight: 280,
      }}
    >
      <Row style={{ marginBottom: 16 }}>
        <Col span={24} align="left">

        </Col>
      </Row>
      <PlatingTable sectorId={sectorId} />
      {/****Modal maquina */}
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
            onClick={handleSelectMachine}
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
      </Modal>
      {/****Alterar caminho */}
      <Modal
        title="Alteração no caminho do monte"
        visible={isAlterPathModalOpen}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            onClick={() => setIsAlterPathModalOpen(false)}
          >
            Cancelar
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              setShowAlterMountRoute(true);
              setIsAlterPathModalOpen(false);
            }}
          >
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

      {/****iniciar monte */}
      <Modal
        title="Iniciar monte"
        visible={isStartMountModalOpen}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            onClick={(e) => setIsStartMountModalOpen(false)}
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
      {/****iniciar monte em caminho diferente*/}
      <Modal
        title="Iniciar monte em setor diferente do programado"
        visible={showAlterMountRoute}
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

      {/** proximo setor **/}
      <Modal
        title="Passar para o proximo setor"
        visible={isNextSectorMountModalOpen}
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

      {/****Quantidade diferente*/}
      <Modal
        title="Percebemos que a quantidade que foi dada entrada é diferente da que chegou, descreva o motivo"
        visible={isReasonModalOpen}
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

      {isSelectMachineModalOpen && <BarcodeReader
        onScan={handleChangeMachine}
        onError={handleChangeMachine}
      />}

      {!isSelectMachineModalOpen && <BarcodeReader
        onScan={handleScan}
        onError={handleScan}
      />}
    </Layout>

  );
}
