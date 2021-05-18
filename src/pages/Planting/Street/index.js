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
  Table,
  notification,
  Popconfirm,
  Select,
} from 'antd';

import api from '../../../services/api';

import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
const { Option } = Select;

export default function PlantingStreet() {
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
          dataIndex: 'streetId',
          key: 'streetId',
          sorter: (a, b) => this.compareByAlph(a.streetId, b.streetId),
          ...this.getColumnSearchProps('streetId'),
        },
        {
          title: 'Nome',
          dataIndex: 'streetName',
          key: 'streetName',

          sorter: (a, b) => this.compareByAlph(a.streetName, b.streetName),
          ...this.getColumnSearchProps('streetName'),
        },
        {
          title: 'Armazém',
          dataIndex: 'warehouseName',
          key: 'warehouseName',
          sorter: (a, b) =>
            this.compareByAlph(a.warehouseName, b.warehouseName),
          ...this.getColumnSearchProps('warehouseName'),
        },
        {
          title: 'Criado em:',
          dataIndex: 'createdAt',
          key: 'createdAt',
          sorter: (a, b) => this.compareByAlph(a.createdAt, b.createdAt),
          ...this.getColumnSearchProps('createdAt'),
        },

        {
          title: 'Operação',
          colSpan: 2,
          dataIndex: 'operacao',
          align: 'center',
          render: (text, record) => {
            return (
              <React.Fragment>
                <EditOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleEdit(record)}
                />{' '}
                {/*onClick={() => handleEdit(record)} */}
                <Popconfirm
                  onConfirm={() => handleDeleteFunction(record.id)}
                  title="Confirmar remoção?"
                >
                  <a href="#" style={{ marginLeft: 20 }}>
                    {' '}
                    <DeleteOutlined style={{ color: '#ff0000' }} />
                  </a>
                </Popconfirm>
              </React.Fragment>
            );
          },
        },
      ];

      return <Table columns={columns} dataSource={streets} />;
    }
  }
  const [show, setShow] = useState(false);

  const [name, setName] = useState('');
  const [id, setId] = useState(0);

  const [warehouses, setWarehouses] = useState([{}]);
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseId, setWarehouseId] = useState(0);
  const [streets, setStreets] = useState([{}]);

  useEffect(() => {
    api.get('plating/street', {}).then((response) => {
      setStreets(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('plating/warehouse', {}).then((response) => {
      setWarehouses(response.data);
    });
  }, []);

  async function Register() {
    try {
      const response = await api.post('plating/street', { name, warehouseId });
      openNotificationWithIcon(
        'success',
        'Sucesso em criar',
        'criado com sucesso'
      );
      setShow(false);
    } catch (error) {
      console.error(error);
      openNotificationWithIcon(
        'error',
        'ocorreu um erro na entrada',
        error.response.data.message
      );
    }
  }
  async function handleEdit(e) {
    setName(e.name);
    setId(e.id);
    setShow(true);
  }

  async function Edit() {
    try {
      const response = await api.put('plating/street', {
        name,
        id,
        warehouseId,
      });
      openNotificationWithIcon(
        'success',
        'Sucesso em editar',
        'Editado com sucesso'
      );
      setShow(false);
    } catch (error) {
      console.error(error);
      openNotificationWithIcon(
        'error',
        'ocorreu um erro na entrada',
        error.response.data.message
      );
    }
  }
  async function handleDeleteFunction(e) {
    try {
      const response = await api.delete(`plating/street/${e}`);
      openNotificationWithIcon(
        'success',
        'Sucesso em editar',
        'Editado com sucesso'
      );
      setShow(false);
    } catch (error) {
      console.error(error);
      openNotificationWithIcon(
        'error',
        'ocorreu um erro ao deletar',
        error.response.data.message
      );
    }
  }

  async function sendForm() {
    if (id == 0) {
      Register();
    } else {
      Edit();
    }
  }

  const openModal = () => {
    setShow(true);
    setId(0);
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
          <Button
            className="buttonGreen"
            icon={<PlusOutlined />}
            style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
            onClick={openModal}
          >
            Nova ruax\zxxc
          </Button>
        </Col>
      </Row>

      <Modal
        title="Cadastro de rua"
        visible={show}
        width={600}
        onCancel={(e) => setShow(false)}
        footer={[
          <Button key="back" type="default" onClick={(e) => setShow(false)}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={sendForm}>
            Salvar
          </Button>,
        ]}
      >
        <>
          <Row gutter={5}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Nome da rua:"
                labelAlign={'left'}
              >
                <Input
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Linha de produção:"
                labelAlign={'left'}
              >
                <Select
                  showSearch
                  placeholder="Selecione"
                  size="large"
                  value={warehouseName}
                  onChange={(e) => {
                    setWarehouseId(e[0]);
                    setWarehouseName(e[1]);
                  }}
                >
                  {warehouses.map((option) => {
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
          </Row>
        </>
      </Modal>
      <SearchTable />
    </Layout>
  );
}
