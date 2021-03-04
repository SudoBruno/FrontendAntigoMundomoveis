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
} from 'antd';

import api from '../../../services/api';

import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

export default function PlantingWarehouse() {
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
          title: 'Nome',
          dataIndex: 'name',
          key: 'name',

          sorter: (a, b) => this.compareByAlph(a.name, b.name),
          ...this.getColumnSearchProps('name'),
        },
        {
          title: 'Criado em:',
          dataIndex: 'created_at',
          key: 'created_at',
          sorter: (a, b) => this.compareByAlph(a.created_at, b.created_at),
          ...this.getColumnSearchProps('created_at'),
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

      return <Table columns={columns} dataSource={warehouses} />;
    }
  }
  const [show, setShow] = useState(false);

  const [name, setName] = useState('');
  const [id, setId] = useState(0);

  const [warehouses, setWarehouses] = useState([{}]);

  useEffect(() => {
    api.get('plating/warehouse', {}).then((response) => {
      setWarehouses(response.data);
    });
  }, []);
  async function Register() {
    try {
      const response = await api.post('plating/warehouse', { name });
      openNotificationWithIcon(
        'success',
        'Sucesso em criar',
        'criado com sucesso'
      );
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
    console.log(e);
    setName(e.name);
    setId(e.id);
    setShow(true);
  }

  async function Edit() {
    try {
      const response = await api.put('plating/warehouse', { name, id });
      openNotificationWithIcon(
        'success',
        'Sucesso em editar',
        'Editado com sucesso'
      );
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
      const response = await api.delete(`plating/warehouse/${e}`);
      openNotificationWithIcon(
        'success',
        'Sucesso em editar',
        'Editado com sucesso'
      );
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
            Novo Armazém
          </Button>
        </Col>
      </Row>

      <Modal
        title="Cadastro de Armazém"
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
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Nome do defeito:"
                labelAlign={'left'}
              >
                <Input
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      </Modal>
      <SearchTable />
    </Layout>
  );
}
