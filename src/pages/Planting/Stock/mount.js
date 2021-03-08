import React, { useEffect, useState } from 'react';
import {
  Layout,
  Button,
  Row,
  Col,
  Input,
  Space,
  Modal,
  Form,
  notification,
  Divider,
  Select,
  Table,
} from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

import BarcodeReader from 'react-barcode-reader';

import api from '../../../services/api';

const Option = Select.Option;

export default function PlantingStockMount() {
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
          title: 'cod barras',
          dataIndex: 'barCode',
          key: 'barCode',
          sorter: (a, b) => this.compareByAlph(a.barCode, b.barCode),
          ...this.getColumnSearchProps('barCode'),
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
          title: 'Produto',
          dataIndex: 'productName',
          key: 'productName',

          sorter: (a, b) => this.compareByAlph(a.productName, b.productName),
          ...this.getColumnSearchProps('productName'),
        },
        {
          title: 'Quantidade',
          dataIndex: 'amount',
          key: 'amount',
          sorter: (a, b) => this.compareByAlph(a.amount, b.amount),
          ...this.getColumnSearchProps('amount'),
        },
      ];

      return <Table columns={columns} dataSource={stock} />;
    }
  }
  const [stock, setStock] = useState([{}]);
  const [show, setShow] = useState(false);

  const [pcpName, setPcpName] = useState('');

  const [productName, setProductName] = useState('');

  const [colorName, setColorName] = useState('');

  const [subProductName, setSubProductName] = useState('');

  const [amount, setAmount] = useState(0);

  const [barCode, setBarCode] = useState('');

  const [loading, setLoading] = useState(false);

  const [warehouses, setWarehouses] = useState([
    {
      id: 0,
      name: '',
      created_at: '',
      active: 0,
    },
  ]);

  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseId, setWarehouseId] = useState(0);

  const [streets, setStreets] = useState([
    {
      streetId: 0,
      streetName: '',
      createdAt: '',
      active: 0,
    },
  ]);

  const [streetName, setStreetName] = useState('');
  const [streetId, setStreetId] = useState(0);

  const [defects, setDefects] = useState([
    {
      id: 0,
      name: '',
      created_at: '',
      active: 0,
    },
  ]);

  const [defectName, setDefectName] = useState('');
  const [defectId, setDefectId] = useState(0);

  async function handleWarehouse(e) {
    setWarehouseId(e[0]);
    setWarehouseName(e[1]);
    setStreetName('');
    setStreetId('');

    const response = await api.get(`plating/street/warehouse/${e[0]}`);
    setStreets(response.data);
    console.log(response.data);
  }

  useEffect(() => {
    api.get('plating/warehouse', {}).then((response) => {
      setWarehouses(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('plating/stock', {}).then((response) => {
      setStock(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('plating/defect', {}).then((response) => {
      setDefects(response.data);
    });
  }, []);

  const data = {
    barCode: barCode,
    wareHouseId: warehouseId,
    streetId: streetId,
    defectId: defectId,
    amount: amount,
  };
  async function handleStockMount() {
    setLoading(true);

    try {
      const response = await api.post('plating/mount/stock/input', data);
      openNotificationWithIcon(
        'success',
        'Sucesso ao dar a entrada',
        response.data.message
      );
      setLoading(false);
      setShow(false);
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'ocorreu um erro na entrada',
        error.response.data.message
      );
      setLoading(false);
    }
  }

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  const handleScan = async (e) => {
    setBarCode(e);

    const response = await api.get(`plating/stock/mount/tag/${e}`);
    setPcpName(response.data.pcp);

    setProductName(response.data.productName);

    setColorName(response.data.color);

    setSubProductName(response.data.subProductName);

    setAmount(response.data.amount);

    setBarCode(response.data.barCode);

    setShow(true);
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
      <BarcodeReader onScan={handleScan} />
      <Modal
        title="Armazenar monte no armazém"
        visible={show}
        width={800}
        footer={[
          <Button key="back" type="default" onClick={(e) => setShow(false)}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleStockMount}
          >
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={12}>
            <Form.Item labelCol={{ span: 23 }} label="PCP:" labelAlign={'left'}>
              <Input name="PCP" placeholder="PCP" value={pcpName} disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item labelCol={{ span: 23 }} label="Cor:" labelAlign={'left'}>
              <Input
                name="color"
                placeholder="Cor"
                value={colorName}
                disabled
                style={{
                  color: 'black',
                  fontWeight: '600',
                  background: colorName,
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Produto:"
              labelAlign={'left'}
            >
              <Input
                name="product"
                placeholder="Produto"
                value={productName}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={5}>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Selecione o armazém:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={warehouseName}
                onChange={(e) => handleWarehouse(e)}

                // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
              >
                {warehouses.map((option) => {
                  return (
                    <Option key={option.id} value={[option.id, option.name]}>
                      {option.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Selecione a rua:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={streetName}
                onChange={(e) => {
                  setStreetId(e[0]);
                  setStreetName(e[1]);
                }}
              >
                {streets.map((option) => {
                  return (
                    <Option
                      key={option.streetId}
                      value={[option.streetId, option.streetName]}
                    >
                      {option.streetName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Selecione o defeito:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={defectName}
                onChange={(e) => {
                  setDefectId(e[0]);
                  setDefectName(e[1]);
                }}
              >
                {defects.map((option) => {
                  return (
                    <Option key={option.id} value={[option.id, option.name]}>
                      {option.name}
                    </Option>
                  );
                })}
              </Select>
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
              <Input
                name="subProduct"
                placeholder="SubProduto"
                value={subProductName}
                disabled
              />
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
                placeholder="Quantidade"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Modal>

      <SearchTable />
    </Layout>
  );
}
