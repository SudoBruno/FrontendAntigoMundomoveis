import React, { useState, useEffect } from 'react';

import api from '../../../services/api';

import { Link } from 'react-router-dom';
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
import { Tooltip } from '@material-ui/core';
import {
  DoubleRightOutlined,
  BarcodeOutlined,
  SearchOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

import Highlighter from 'react-highlight-words';
import { post } from 'jquery';

const Option = Select.Option;

export default function Seccionadora() {
  class SearchTable extends React.Component {
    state = {
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: false,
      searchText: '',
      searchedColumn: '',
    };

    getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                this.handleSearch(selectedKeys, confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Buscar
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Limpar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
      render: (text) =>
        this.state.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        ),
    });

    compareByAlph = (a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    };

    handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      this.setState({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
      });
    };

    handleReset = (clearFilters) => {
      clearFilters();
      this.setState({ searchText: '' });
    };

    handleTableChange = (pagination, filters, sorter) => {
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        pagination,
        ...filters,
      });
    };

    render() {
      const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',

          sorter: (a, b) => this.compareByAlph(a.id, b.id),
          ...this.getColumnSearchProps('id'),
        },
        {
          title: 'Produto',
          dataIndex: 'productName',
          key: 'productName',

          sorter: (a, b) => this.compareByAlph(a.productName, b.productName),
          ...this.getColumnSearchProps('productName'),
        },
        {
          title: 'SubProduto',
          dataIndex: 'subProductName',
          key: 'subProductName',

          sorter: (a, b) =>
            this.compareByAlph(a.subProductName, b.subProductName),
          ...this.getColumnSearchProps('subProductName'),
        },
        {
          title: 'Quantidade',
          dataIndex: 'amountInput',
          key: 'amountInput',

          sorter: (a, b) => this.compareByAlph(a.amountInput, b.amountInput),
          ...this.getColumnSearchProps('amountInput'),
        },
        {
          title: 'PCP',
          dataIndex: 'pcpName',
          key: 'pcpName',

          sorter: (a, b) => this.compareByAlph(a.pcpName, b.pcpName),
          ...this.getColumnSearchProps('pcpName'),
        },
        {
          title: 'Começou',
          dataIndex: 'start',
          key: 'start',

          sorter: (a, b) => this.compareByAlph(a.start, b.start),
          ...this.getColumnSearchProps('start'),
        },

        {
          title: 'Operação',
          colSpan: 2,
          dataIndex: 'operacao',
          align: 'center',

          render: (text, record) => {
            return (
              <React.Fragment>
                <Link
                  to={`/mount/${record.barCode}`}
                  style={{ color: 'rgb(0,0,0,0.65' }}
                  target="_blank"
                >
                  <BarcodeOutlined style={{ marginLeft: 20, fontSize: 24 }} />
                </Link>
                <DoubleRightOutlined
                  style={{ marginLeft: 20, fontSize: 24 }}
                  size={50}
                  onClick={(e) => finishMount(e, record)}
                />
              </React.Fragment>
            );
          },
        },
      ];
      return (
        <Table
          columns={columns}
          dataSource={mounts}
          rowClassName={(record, index) => record.color}
        />
      );
    }
  }

  const [mounts, setMounts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [show, setShow] = useState(false);
  const [productionPlanControlId, setProductionPlanControlId] = useState(0);
  const [productionPlanControlName, setProductionPlanControlName] = useState(
    ''
  );
  const [productionsPlansControl, setProductionsPlansControl] = useState([]);
  const [productId, setProductId] = useState(0);
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedSubProducts, setSelectSubProducts] = useState([
    { subProductId: '', subProductName: '', amount: 0 },
  ]);
  const [subProducts, setSubProducts] = useState([
    { subProductId: '', subProductName: '', amount: 0 },
  ]);
  const [colorName, setColorName] = useState('');
  const [color, setColor] = useState('');
  const [sectors, setSectors] = useState([]);
  const [sectorName, setSectorName] = useState('');
  const [sectorId, setSectorId] = useState(0);

  const [showNextSector, setShowNextSector] = useState(false);

  const [showSector, setShowSector] = useState(true);

  const [previousPlatingMountId, setPreviousPlatingMountId] = useState(0);

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  useEffect(() => {
    api.get(`plating/mount/seccionadora/${sectorId}`, {}).then((response) => {
      setMounts(response.data);
    });
  }, [refreshKey]);

  useEffect(() => {
    api.get('product-plan-control ', {}).then((response) => {
      setProductionsPlansControl(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('sector', {}).then((response) => {
      setSectors(response.data);
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
  };
  const handleCreateMount = async () => {
    try {
      await api.post('plating/seccionadora/mount', data);
      openNotificationWithIcon(
        'success',
        'Monte criados com sucesso',
        'Os montes foram criados com sucesso!'
      );
      setRefreshKey((refreshKey) => refreshKey + 1);
      setShow(false);
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao criar o monte',
        'Erro ao criar um monte, procure o suporte'
      );
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

  const handleSelectSector = (e) => {
    setRefreshKey((refreshKey) => refreshKey + 1);
    setSectorId(e[0]);
    setSectorName(e[1]);
    setShowSector(false);
  };

  const finishMount = async (e, data) => {
    e.preventDefault();

    setProductId(data.productId);
    setProductName(data.productName);
    setProductionPlanControlId(data.pcpId);
    setProductionPlanControlName(data.pcpName);
    setColor(data.color);
    setSelectSubProducts([
      {
        subProductId: data.subProductId,
        subProductName: data.subProductName,
        amount: data.amountInput,
      },
    ]);
    setSubProducts([
      {
        id: data.subProductId,
        name: data.subProductName,
        amount: data.amountInput,
      },
    ]);
    setPreviousPlatingMountId(data.id);

    setShowNextSector(true);
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
      var win = window.open(`/mount/tag/${previousPlatingMountId}`, '_blank');
      win.focus();
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao gerar etiqueta',
        'Erro ao passar para o proximo setor, tente novamente'
      );
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
        <Col span={24} align="right">
          <Tooltip title="Seccionadora" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
              onClick={handleShow}
            >
              Seccionadora
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <SearchTable />
      <Modal
        title="Alteração no caminho do monte"
        visible={show}
        width={700}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleCreateMount}>
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={8}>
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
          <Col span={8}>
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
          <Col span={8}>
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

      <Modal title="Selecione o setor" visible={showSector} width={500}>
        <Row gutter={5}>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Selecione seu setor:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={sectorName}
                onChange={(e) => handleSelectSector(e)}

                // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
              >
                {sectors.map((option) => {
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
      </Modal>

      <Modal
        title="Passar para o proximo setor"
        visible={showNextSector}
        width={700}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={nextSector}>
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
