import {
  DoubleRightOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Tooltip } from '@material-ui/core';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { SeccionadoraTable } from '../../../components/Plating/Seccionadora/SeccionadoraTable';
import { SelectMachineModal } from '../../../components/Plating/SelectMachineModal';
import api from '../../../services/api';

const Option = Select.Option;

export default function Seccionadora() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [show, setShow] = useState(false);

  const [productionPlanControlName, setProductionPlanControlName] = useState(
    ''
  );
  const [productionsPlansControl, setProductionsPlansControl] = useState([]);

  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);

  const [colorName, setColorName] = useState('');

  const [machines, setMachines] = useState([]);

  const [machineId, setMachineId] = useState(1);

  const [showMachine, setShowMachine] = useState(true);

  const [loading, setLoading] = useState(false);

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  useEffect(() => {
    api.get('product-plan-control ', {}).then((response) => {
      setProductionsPlansControl(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('machine', {}).then((response) => {
      setMachines(response.data);
    });
  }, []);

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  const data = {
    factoryEmployeeId: localStorage.getItem('userId'),
    productionPlanControl: productionPlanControlId,
    subProducts: selectedSubProducts,
    factorySectorId: sectorId,
    productId: productId,
    color: color,
    machineId,
  };
  const handleCreateMount = async () => {
    setLoading(true);
    try {
      await api.post('plating/seccionadora/mount', data);
      openNotificationWithIcon(
        'success',
        'Monte criados com sucesso',
        'Os montes foram criados com sucesso!'
      );
      setRefreshKey((refreshKey) => refreshKey + 1);
      setShow(false);
      setLoading(false);
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao criar o monte',
        'Erro ao criar um monte, procure o suporte'
      );
      setLoading(false);
    }
  };
  const handleProductionPlanControl = async (e) => {
    setProductionPlanControlId(e[0]);
    setProductionPlanControlName(e[1]);
    const response = await api.get(
      `product/production-plan-controller/${e[0]}`
    );
    setProducts(response.data);
  };
  const handleProduct = async (e) => {
    setProductId(e[0]);
    setProductName(e[1]);

    try {
      const response = await api.get(
        `product-plan-control/sub-product?product=${e[0]}&sector=${sectorId}&pcp=${productionPlanControlId}`
      );
      console.log(response.data);

      setSubProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubProduct = (value, index) => {
    var NewArray = [...selectedSubProducts];

    NewArray[index].subProductId = value[0];
    NewArray[index].subProductName = value[1];

    setSelectSubProducts(NewArray);
  };

  const HandleChange = (e, index) => {
    var NewArray = [...selectedSubProducts];
    var { name, value } = e.target;
    var totalAmount = +value;
    console.log(value);
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
        openNotificationWithIcon(
          'error',
          'Erro na quantidade',
          'Tem mais itens no monte do que no PCP'
        );
      } else {
        NewArray[index][name] = value;

        setSelectSubProducts(NewArray);
      }
    } else {
      openNotificationWithIcon(
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

  const handleSelectMachine = async (e) => {
    setRefreshKey((refreshKey) => refreshKey + 1);
    setMachineId(e);
    const response = await api.get(`machine/${e}`);
    setSectorId(response.data.factory_sector_id);

    const mounts = await api.get(
      `plating/mount/seccionadora/${response.data.factory_sector_id}`
    );

    setMounts(mounts.data);

    setShowMachine(false);
  };

  const dataNextSector = {
    factorySectorId: sectorId,
    factoryEmployeeId: localStorage.getItem('userId'),
    productId,
    subProducts: selectedSubProducts,
    color,
    productionPlanControlId,
    previousPlatingMountId,
  };

  const nextSector = async () => {
    setLoading(true);
    try {
      const response = await api.post('plating/mount/tags', dataNextSector);
      openNotificationWithIcon(
        'success',
        'Sucesso ao gerar etiquetas',
        'As etiquetas foram geradas com sucesso'
      );
      setRefreshKey((refreshKey) => refreshKey + 1);
      setProductId(0);
      setProductName('');
      setProductionPlanControlId(0);
      setProductionPlanControlName('');
      setColor('');
      setSelectSubProducts([
        {
          subProductId: 0,
          subProductName: '',
          amount: 0,
        },
      ]);
      setSubProducts([
        {
          id: 0,
          name: '',
          amount: 0,
        },
      ]);
      setPreviousPlatingMountId(0);
      setShowNextSector(false);
      setLoading(false);
      var win = window.open(`/mount/tag/${previousPlatingMountId}`, '_blank');
      win.focus();
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao gerar etiqueta',
        'Erro ao passar para o proximo setor, tente novamente'
      );
      setLoading(false);
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
      {/* <BarcodeReader onScan={handleScan} onError={handleScan} /> */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={12} align="left">
          {/* <Tooltip title="Seccionadora" placement="right">
            <PlatingMountProvider />  
          </Tooltip> */}
        </Col>
        <Col span={12} align="right">
          <Tooltip title="Seccionadora" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginRight: 5, fontSize: '14px' }}
              onClick={handleShow}
            >
              Seccionadora
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <SeccionadoraTable />
      <Modal
        title="Alteração no caminho do monte"
        visible={show}
        width={700}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
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
                value={productionPlanControlName}
                onChange={(e) => handleProductionPlanControl(e)}

                // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
              >
                {productionsPlansControl.map((option) => {
                  return (
                    <>
                      <Option key={option.id} value={[option.id, option.name]}>
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

                // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
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
                value={productName}
                onChange={(e) => handleProduct(e)}

                // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
              >
                {products.map((option) => {
                  return (
                    <>
                      <Option key={option.id} value={[option.id, option.name]}>
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
                      value={selectedSubProduct.subProductName}
                      onChange={(e) => handleSubProduct(e, index)}

                      // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
                    >
                      {subProducts.map((option) => {
                        return (
                          <>
                            <Option
                              key={option.id}
                              value={[option.id, option.name]}
                            >
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

      <SelectMachineModal />

      <Modal
        title="Passar para o proximo setor"
        visible={showNextSector}
        width={700}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={nextSector}
          >
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="PCP:" labelAlign={'left'}>
              <Select size="large" value={productionPlanControlName} disabled>
                {productionsPlansControl.map((option) => {
                  return (
                    <>
                      <Option key={option.id} value={[option.id, option.name]}>
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
              label="Produto:"
              labelAlign={'left'}
            >
              <Select size="large" value={productName} disabled>
                {products.map((option) => {
                  return (
                    <>
                      <Option key={option.id} value={[option.id, option.name]}>
                        {option.name}
                      </Option>
                    </>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item labelCol={{ span: 23 }} label="Cor:" labelAlign={'left'}>
              <Select
                size="large"
                value={color}
                style={{ color: `${color}` }}
                disabled
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
                      value={selectedSubProduct.subProductName}
                      onChange={(e) => handleSubProduct(e, index)}

                      // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
                    >
                      {subProducts.map((option) => {
                        return (
                          <>
                            <Option
                              key={option.id}
                              value={[option.id, option.name]}
                            >
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
            </>
          );
        })}
      </Modal>
    </Layout>
  );
}
