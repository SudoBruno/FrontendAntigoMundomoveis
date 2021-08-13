import { ExclamationCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Divider, Form, Input, Layout, Modal, Row, Select } from 'antd';
import { format, parseISO, compareDesc } from 'date-fns';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import BarcodeReader from 'react-barcode-reader';
import { Notification } from '../../../components/Notification';
import { SeccionadoraTable } from '../../../components/Plating/Seccionadora/SeccionadoraTable';
import { SelectMachineModal } from '../../../components/Plating/SelectMachineModal';
import api from '../../../services/api';

const Option = Select.Option;

const { TextArea } = Input;

export default function Seccionadora() {
  const [sectorId, setSectorId] = useState(0);
  const [isCreateMountModalOpen, setIsCreatMountModalOpen] = useState(false);
  const [productionPlanControlId, setProductionPlanControlId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubProducts, setSelectSubProducts] = useState([
    { subProductId: '', subProductName: '', amount: 0 },
  ]);
  const [color, setColor] = useState('');
  const [productId, setProductId] = useState(1);
  const [refreshKey, setRefreshKey] = useState(1);
  const [products, setProducts] = useState([{}]);
  const [productionPlanControlPage, setProductionPlanControlPage] = useState(1);
  const [productionsPlansControl, setProductionsPlansControl] = useState([{}]);
  const [colorName, setColorName] = useState('');
  const [subProducts, setSubProducts] = useState([
    { subProductId: '', subProductName: '', amount: 0 },
  ]);
  const [isSelectMachineModalOpen, setIsSelectMachineModalOpen] =
    useState(true);

  const [machines, setMachines] = useState([{}]);
  const [machineId, setMachineId] = useState('');
  const [machineName, setMachineName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStopMachine, setIsStopMachine] = useState(false);
  const [
    isCreateStopMachineModalOpen,
    setIsCreateStopMachineModalOpen,
  ] = useState(false);
  const [reasonStopMachineId, setReasonStopMachineId] = useState(1);
  const [description, setDescription] = useState(1);
  const [startDate, setStartDate] = useState(
    format(new Date(), 'yyyy-MM-dd HH:mm')
  );
  const [
    isFinishStopMachineModalOpen,
    setIsFinishStopMachineModalOpen,
  ] = useState(false);
  const [finishDate, setFinishDate] = useState(
    format(new Date(), 'yyyy-MM-dd HH:mm')
  );
  const [reasonStop, setReasonStop] = useState([{}]);

  const handleCreateMount = async () => {
    const data = {
      factoryEmployeeId: localStorage.getItem('userId'),
      productionPlanControl: productionPlanControlId,
      subProducts: selectedSubProducts,
      factorySectorId: sectorId,
      productId: productId,
      color: color,
    };
    await createMounts(data);
  };

  const createMounts = async (data) => {
    setIsLoading(true);
    try {
      await api.post('plating/seccionadora/mount', data);
      Notification(
        'success',
        'Monte criados com sucesso',
        'Os montes foram criados com sucesso!'
      );

      setRefreshKey(refreshKey + 1);
    } catch (error) {
      Notification(
        'error',
        'Erro ao criar o monte',
        'Erro ao criar um monte, procure o suporte'
      );
    }
    setIsCreatMountModalOpen(false);
    setIsLoading(false);
  };

  const handleProductionPlanControl = async (e) => {
    setProductionPlanControlId(e);

    const response = await api.get(`product/production-plan-controller/${e}`);

    setProducts(response.data);
  };

  useEffect(() => {
    api
      .get('product-plan-control', {
        params: {
          page: productionPlanControlPage,
        },
      })
      .then((response) => {
        if (productionPlanControlPage !== 1) {
          setProductionsPlansControl([
            ...productionsPlansControl,
            ...response.data,
          ]);
        } else {
          setProductionsPlansControl(response.data);
        }
      });
    api.get('machine', {}).then((response) => {
      setMachines(response.data);
    });
  }, [productionPlanControlPage]);


  const handleProduct = async (e) => {
    setProductId(e);

    try {
      const response = await api.get(
        `product-plan-control/sub-product?product=${e}&sector=${sectorId}&pcp=${productionPlanControlId}`
      );

      setSubProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubProduct = (value, index) => {
    var NewArray = [...selectedSubProducts];

    NewArray[index].subProductId = value;

    setSelectSubProducts(NewArray);
  };

  const HandleChange = (e, index) => {
    var NewArray = [...selectedSubProducts];
    var { name, value } = e.target;
    var totalAmount = +value;

    if (value > 0 || value == '') {
      selectedSubProducts.map((item, subProductIndex) => {
        if (
          selectedSubProducts[index].subProductId == item.subProductId &&
          subProductIndex != index
        ) {
          totalAmount += +item.amount;
        }
      });

      var subProductIndex = subProducts.findIndex(
        (item) => item.id === selectedSubProducts[index].subProductId
      );

      if (subProducts[subProductIndex].amount < totalAmount) {
        Notification(
          'error',
          'Erro na quantidade',
          'Tem mais itens no monte do que no PCP'
        );
      } else {
        NewArray[index][name] = value;

        setSelectSubProducts(NewArray);
      }
    } else {
      Notification(
        'error',
        'Erro na quantidade',
        'Valor nao pode ser negativo'
      );
    }
  };

  const handleRemoveClick = (index) => {
    const list = [...selectedSubProducts];
    list.splice(index, 1);
    setSelectSubProducts(list);
  };

  const handleAddClick = () => {
    setSelectSubProducts([
      ...selectedSubProducts,
      { subProductId: '', subProductName: '', amount: 0 },
    ]);
  };

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

  async function createStopMachine() {
    try {
      const response = await api.post('machine-stop', {
        machineId,
      });

      Notification(
        'success',
        'Parada de maquina acionada com sucesso',
        'Essa maquina esta parada para manutenção'
      );

      handleSelectMachine(machineId)
      setIsStopMachine(true);

      setIsCreateStopMachineModalOpen(false);
    } catch (error) {
      console.error(error);
      Notification(
        'error',
        'Erro ao acionar parada de maquina',
        error.response == undefined
          ? 'Ocorreu um erro ao acionar parada de maquina, tente novamente'
          : error.response.data.message
      );
    }
  }

  function closeCreateStopMachineModal() {
    setIsCreateStopMachineModalOpen(false);
  }

  async function openFinishStopMachineModal() {

    const reasonsStop = await api.get('reason-stop', {})
    setReasonStop(reasonsStop.data)
    const response = await api.get(`machine-stop/machine/${machineId}`);
    setDescription(response.data.description);
    setReasonStopMachineId(response.data.reason_stop_machine_id);

    setStartDate(format(parseISO(response.data.start), 'yyyy-MM-dd HH:mm'));
    setIsFinishStopMachineModalOpen(true);
  }

  function closeFinishStopMachineModal() {
    setIsFinishStopMachineModalOpen(false);
  }

  async function finishStopMachine() {
    if (compareDesc(new Date(startDate), new Date(finishDate)) !== 1) {
      Notification(
        'error',
        'Erro ao cadastrar parada de maquina',
        'Datas invalidas'
      );
      return
    }

    try {
      const response = await api.put(`machine-stop/${machineId}`, {
        reasonStopMachineId,
        startDate,
        finishDate,
        description,
      });
      Notification(
        'success',
        'Parada de maquina finalizada',
        'maquina funcionando normalmente'
      );

      setIsFinishStopMachineModalOpen(false);
      handleSelectMachine(machineId);
    } catch (error) {
      Notification(
        'error',
        'Erro ao finalizar parada de maquina',
        error.response.data.message === undefined
          ? 'Ocorreu um erro ao finalizar parada de maquina, tente novamente'
          : error.response.data.message
      );
    }
  }

  function alterStartDate(value) {
    setStartDate(value._d);
  }

  function alterFinishDate(value) {
    setFinishDate(value._d);
  }

  return (
    <Layout
      style={{
        margin: '24px 16px',
        padding: '21px 24px 24px 24px',
        background: '#fff',
        minHeight: 280,
      }}
    >
      {/* <BarcodeReader onScan={handleScan} onError={handleScan} /> */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={12} align="left">
          {isStopMachine ? (
            <Button
              icon={<ExclamationCircleOutlined size={'18'} />}
              className="buttonYellow"
              onClick={e => openFinishStopMachineModal()}
            >
              Finalizar Parada de maquina
            </Button>
          ) : (

            <Button
              icon={<ExclamationCircleOutlined size={'18'} />}
              className="buttonRed"
              onClick={e => setIsCreateStopMachineModalOpen(true)}
            >
              Acionar Parada de maquina
            </Button>
          )}

        </Col>
        <Col span={12} align="right">
          <Button
            className="buttonGreen"
            icon={<PlusOutlined />}
            style={{ marginRight: 5, fontSize: '14px' }}
            onClick={(e) => setIsCreatMountModalOpen(true)}
          >
            Seccionadora
          </Button>
        </Col>
      </Row>

      <SeccionadoraTable sectorId={sectorId} machineId={machineId} />

      <SelectMachineModal />
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


      <Modal
        title="Criação do Monte"
        visible={isCreateMountModalOpen}
        width={700}
        footer={[
          <Button
            key="back"
            type="default"
            onClick={(e) => setIsCreatMountModalOpen(false)}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={handleCreateMount}
          >
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={12}>
            <Form.Item labelCol={{ span: 23 }} label="PCP:" labelAlign={'left'}>
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={productionPlanControlId}
                onChange={(e) => handleProductionPlanControl(e)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
                onPopupScroll={(e) => {
                  const { target } = e;
                  if (
                    target.scrollTop + target.offsetHeight ===
                    target.scrollHeight
                  ) {
                    setProductionPlanControlPage(productionPlanControlPage + 1);
                  }
                }}
              >
                {productionsPlansControl.map((option) => {
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
            <Form.Item labelCol={{ span: 23 }} label="Cor:" labelAlign={'left'}>
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={colorName}
                onChange={(e) => {
                  setColorName(e[1]);
                  setColor(e[0]);
                }}
                style={{ color: `${color}` }}
              >
                <>
                  <Option
                    key={1}
                    value={['yellow', 'Amarelo']}
                    style={{ color: 'yellow' }}
                  >
                    Amarelo
                  </Option>
                  <Option
                    key={2}
                    value={['blue', 'Azul']}
                    style={{ color: 'blue' }}
                  >
                    Azul
                  </Option>
                  <Option
                    key={3}
                    value={['red', 'Vermelho']}
                    style={{ color: 'red' }}
                  >
                    Vermelho
                  </Option>
                  <Option
                    key={4}
                    value={['pink', 'Rosa']}
                    style={{ color: 'pink' }}
                  >
                    Rosa
                  </Option>
                  <Option
                    key={5}
                    value={['black', 'Preto']}
                    style={{ color: 'black' }}
                  >
                    Preto
                  </Option>
                  <Option
                    key={6}
                    value={['green', 'Verde']}
                    style={{ color: 'green' }}
                  >
                    Verde
                  </Option>
                </>
              </Select>
            </Form.Item>
          </Col>

          <Col span={19}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Produto:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={productId}
                onChange={(e) => handleProduct(e)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {products.map((option) => {
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
        <Divider />
        {selectedSubProducts.map((selectedSubProduct, index) => {
          return (
            <>
              <Row gutter={5}>
                <Col span={16}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="SubProduto:"
                    labelAlign={'left'}
                  >
                    <Select
                      showSearch
                      placeholder="Selecione"
                      size="large"
                      value={selectedSubProduct.subProductId}
                      onChange={(e) => handleSubProduct(e, index)}

                    // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
                    >
                      {subProducts.map((option) => {
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
                <Col span={8}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Quantidade:"
                    labelAlign={'left'}
                    style={{ width: '90%', marginRight: 16 }}
                  >
                    <Input
                      name="amount"
                      placeholder="Quantidade"
                      type={'number'}
                      min={0}
                      value={selectedSubProduct.amount}
                      onChange={(e) => HandleChange(e, index)}
                      style={{ width: '85%', marginRight: 8 }}
                    />
                    {selectedSubProducts.length !== 1 && (
                      <MinusCircleOutlined
                        onClick={() => handleRemoveClick(index)}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {selectedSubProducts.length - 1 === index && (
                <Button
                  key="primary"
                  title="Nova Linha"
                  style={{ width: '100%' }}
                  onClick={handleAddClick}
                >
                  <PlusOutlined />
                  Subproduto
                </Button>
              )}
            </>
          );
        })}
      </Modal>

      {/* Parada de maquina */}
      <Modal
        title="Parada de maquina"
        visible={isCreateStopMachineModalOpen}
        onCancel={closeCreateStopMachineModal}
        width={800}
        footer={[
          <Button key="back" type="default" onClick={closeCreateStopMachineModal}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={(e) => {
              createStopMachine();
            }}
          >
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <h1>Você realmente deseja para esta maquina?</h1>
        </Row>
      </Modal>

      <Modal
        title="Parada de maquina"
        visible={isFinishStopMachineModalOpen}
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
                onChange={(e) => setReasonStopMachineId(e)}
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
                defaultValue={moment(finishDate, 'YYYY/MM/DD HH:mm')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Modal>

      {isSelectMachineModalOpen && <BarcodeReader
        onScan={handleChangeMachine}
        onError={handleChangeMachine}
      />}


    </Layout>

  );
}
