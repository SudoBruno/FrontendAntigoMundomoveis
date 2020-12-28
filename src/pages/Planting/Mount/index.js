import React, { useEffect, useState } from 'react';
import {
  Layout,
  Table,
  Button,
  Row,
  Col,
  Input,
  Space,
  Modal,
  Popconfirm,
  Form,
  Select,
  notification,
} from 'antd';
import { Tooltip } from '@material-ui/core';
import {
  DeleteOutlined,
  DoubleRightOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

import api from '../../../services/api';

import './style.css';

const Option = Select.Option;

const { TextArea } = Input;

export default function PlantingMount() {
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
          dataIndex: 'amount',
          key: 'amount',

          sorter: (a, b) => this.compareByAlph(a.amount, b.amount),
          ...this.getColumnSearchProps('amount'),
        },
        {
          title: 'PCP',
          dataIndex: 'pcp',
          key: 'pcp',

          sorter: (a, b) => this.compareByAlph(a.pcp, b.pcp),
          ...this.getColumnSearchProps('pcp'),
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
                {/* <EditOutlined
                  style={{ cursor: 'pointer' }}
                  // onClick={() => handleEdit(record)}
                />
                <Popconfirm
                  // onConfirm={() => handleDeleteFunction(record.id)}
                  title="Confirmar remoção?"
                >
                  <a href="#" style={{ marginLeft: 20 }}>
                    {' '}
                    <DeleteOutlined style={{ color: '#000' }} />
                  </a>
                </Popconfirm> */}
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
          rowClassName={
            (record, index) => record.color
            // index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
        />
      );
    }
  }
  const [show, setShow] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const handleClose = () => {
    setShow(false);
    setProductionPlanControlId(0);
    setProductionPlanControlName('');
    setProductId(0);
    setProductName('');
    setMountId(0);
    setSelectSubProducts([{ subProductId: '', subProductName: '', amount: 0 }]);
    setTimeout(() => {
      setRefreshKey((refreshKey) => refreshKey + 1);
    }, 500);
  };
  const handleShow = () => setShow(true);

  const [showSector, setShowSector] = useState(true);

  const [sectors, setSectors] = useState([]);
  const [sectorId, setSectorId] = useState(0);
  const [sectorName, setSectorName] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [colorName, setColorName] = useState('');
  const [color, setColor] = useState('');

  const handleSelectSector = (e) => {
    setRefreshKey((refreshKey) => refreshKey + 1);
    setSectorId(e[0]);
    setSectorName(e[1]);
    setShowSector(false);
  };

  const [mounts, setMounts] = useState([]);
  const [productionsPlansControl, setProductionsPlansControl] = useState([]);
  const [productionPlanControlId, setProductionPlanControlId] = useState([]);
  const [productionPlanControlName, setProductionPlanControlName] = useState(
    []
  );

  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState([]);
  const [productName, setProductName] = useState([]);

  const [selectedSubProducts, setSelectSubProducts] = useState([
    { subProductId: '', subProductName: '', amount: 0 },
  ]);
  const [subProducts, setSubProducts] = useState([]);
  const [mountId, setMountId] = useState(0);
  const [previousMountId, setPreviousMountId] = useState(null);
  const [oldAmount, setOldAmount] = useState(0);
  const [reason, setReason] = useState('');

  // useEffect(() => {
  //   api.get('plating/mount ', {}).then((response) => {
  //     setMounts(response.data);
  //   });
  // }, []);

  useEffect(() => {
    api.get('product-plan-control ', {}).then((response) => {
      setProductionsPlansControl(response.data);
    });
  }, []);

  useEffect(() => {
    api.get(`plating/mount/sector/${sectorId}`, {}).then((response) => {
      setMounts(response.data);
    });
  }, [refreshKey]);

  useEffect(() => {
    api.get('sector', {}).then((response) => {
      setSectors(response.data);
    });
  }, []);

  const handleProduct = async (e) => {
    setProductId(e[0]);
    setProductName(e[1]);
    try {
      const response = await api.get(
        `product-plan-control/sub-product?product=${e[0]}&sector=${sectorId}`
      );

      setSubProducts(response.data);
    } catch (error) {
      console.error(error);
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

  const handleSubProduct = (value, index) => {
    var NewArray = [...selectedSubProducts];

    NewArray[index].subProductId = value[0];
    NewArray[index].subProductName = value[1];

    setSelectSubProducts(NewArray);
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

  const HandleChange = (e, index) => {
    var NewArray = [...selectedSubProducts];
    var { name, value } = e.target;

    if (subProducts[index].amount < value) {
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
  const data = {
    factoryEmployeeId: localStorage.getItem('userId'),
    productionPlanControl: productionPlanControlId,
    subProducts: selectedSubProducts,
    factorySectorId: sectorId,
    productId: productId,
    mountId: mountId,
    previousMountId: previousMountId,
    color: color,
  };
  async function handleCreateMount() {
    console.log('old', oldAmount, 'sub', selectedSubProducts);
    if (oldAmount != selectedSubProducts[0].amount) {
      setShowReason(true);
      return;
    }

    if (mountId == 0) {
      try {
        api.post('plating/mount', data);
        handleClose();
        openNotificationWithIcon(
          'success',
          'Monte criado com sucesso ',
          'O(s) Monte(s) foram criados com sucesso'
        );
      } catch (error) {
        openNotificationWithIcon(
          'error',
          'Erro ao Criar',
          'Ocorreu um erro, por favor tentar novamente'
        );
      }
    } else {
      try {
        api.put('plating/mount', data);
        handleClose();
        openNotificationWithIcon(
          'success',
          'Monte editado com sucesso ',
          'O(s) Monte(s) foram editado com sucesso'
        );
      } catch (error) {
        openNotificationWithIcon(
          'error',
          'Erro ao Criar',
          'Ocorreu um erro, por favor tentar novamente'
        );
      }
    }
  }
  const finishMount = async (e, data) => {
    e.preventDefault();

    setProductionPlanControlId(data.pcpId);
    setProductionPlanControlName(data.pcp);
    setProductId(data.productId);
    setProductName(data.productName);
    setColor(data.color);
    if (data.finish == null) {
      setMountId(data.id);
      setPreviousMountId(data.previousMountId);
    } else {
      setMountId(0);
      setPreviousMountId(data.id);
    }

    setOldAmount(data.amount);
    setSelectSubProducts([
      {
        subProductId: data.subProductId,
        subProductName: data.subProductName,
        amount: data.amount,
      },
    ]);

    const response = await api.get(
      `product-plan-control/sub-product?product=${data.productId}&sector=${sectorId}`
    );

    setSubProducts(response.data);
    setShow(true);
  };

  const handleSaveReason = () => {
    console.log(reason);
  };
  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
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
      <Modal
        title="Criação de monte"
        visible={show}
        width={500}
        onCancel={handleClose}
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
        <Row>
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
                </>
              </Select>
            </Form.Item>
          </Col>
        </Row>
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
                      style={{ width: '80%', marginRight: 8 }}
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
      <SearchTable />

      {/* Setor */}

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
        title="Percebemos que a quantidade dada entrada é diferente da que chegou, descreva o motivo"
        visible={showReason}
        width={500}
        footer={[
          <Button key="submit" type="primary" onClick={handleSaveReason}>
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
  );
}
