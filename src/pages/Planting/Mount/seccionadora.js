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
          rowClassName={
            (record, index) => record.color
            // index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
        />
      );
    }
  }

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

  const [reason, setReason] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [barCode, setBarCode] = useState('');
  const [sectors, setSectors] = useState([]);
  const [sectorId, setSectorId] = useState(0);
  const [sectorName, setSectorName] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [colorName, setColorName] = useState('');
  const [color, setColor] = useState('');

  const handleSubProduct = (value, index) => {
    var NewArray = [...selectedSubProducts];

    NewArray[index].subProductId = value[0];
    NewArray[index].subProductName = value[1];

    setSelectSubProducts(NewArray);
  };

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  const handleProduct = async (e) => {
    setProductId(e[0]);
    setProductName(e[1]);
    console.log(productionPlanControlId);
    try {
      const response = await api.get(
        `product-plan-control/sub-product?product=${
          e[0]
        }&sector=${2}&pcp=${productionPlanControlId}`
      );

      setSubProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    api.get(`plating/mount/sector/${2}`, {}).then((response) => {
      setMounts(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('product-plan-control ', {}).then((response) => {
      setProductionsPlansControl(response.data);
    });
  }, []);

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

  const handleClose = () => {
    setShow(false);
    setProductionPlanControlId(0);
    setProductionPlanControlName('');
    setProductId(0);
    setProductName('');
    setMountId(0);
    setSelectSubProducts([{ subProductId: '', subProductName: '', amount: 0 }]);
    setBarCode('');
  };

  async function handleCreateMount() {}

  const handleProductionPlanControl = async (e) => {
    setProductionPlanControlId(e[0]);
    setProductionPlanControlName(e[1]);
    const response = await api.get(
      `product/production-plan-controller/${e[0]}`
    );
    setProducts(response.data);
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

  const finishMount = async (e, data) => {
    // e.preventDefault();
    // setBarCode(data.barCode != undefined ? data.barCode : '');
    // setFinishDate(data.finish);
    // setProductionPlanControlId(data.pcpId);
    // setProductionPlanControlName(data.pcp);
    // setProductId(data.productId);
    // setProductName(data.productName);
    // setColor(data.color);
    // if (data.finish == null) {
    //   setMountId(data.id);
    //   setPreviousMountId(data.previousMountId);
    // } else {
    //   setMountId(0);
    //   setPreviousMountId(data.id);
    // }
    // setSelectSubProducts([
    //   {
    //     subProductId: data.subProductId,
    //     subProductName: data.subProductName,
    //     amount: data.amount,
    //   },
    // ]);
    // const response = await api.get(
    //   `product-plan-control/sub-product?product=${data.productId}&sector=${sectorId}&pcp=${data.pcpId}`
    // );
    // setSubProducts(response.data);
    // setShow(true);
  };
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
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
    </Layout>
  );
}
