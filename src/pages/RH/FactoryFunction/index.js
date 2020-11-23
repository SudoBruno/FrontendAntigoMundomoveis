import React, { useState, useEffect } from 'react';
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
  notification,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Tooltip } from '@material-ui/core/';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../../services/api';

import './style.css';

export default function FactoryFunction() {
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
          width: '10%',
          ...this.getColumnSearchProps('id'),
        },
        {
          title: 'Nome',
          dataIndex: 'name',
          key: 'name',
          width: '20%',
          sorter: (a, b) => this.compareByAlph(a.name, b.name),
          ...this.getColumnSearchProps('name'),
        },
        {
          title: 'Salario Base',
          dataIndex: 'base_salary',
          key: 'base_salary',
          sorter: (a, b) => this.compareByAlph(a.base_salary, b.base_salary),
          ...this.getColumnSearchProps('base_salary'),
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
          width: 150,
          render: (text, record) => {
            return (
              <React.Fragment>
                <EditOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleEdit(record)}
                />
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

      return <Table columns={columns} dataSource={factoryFunction} />;
    }
  }

  const [factoryFunction, setFactoryFunction] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api.get('function', {}).then((response) => {
      setFactoryFunction(response.data);
    });
  }, [refreshKey]);

  async function handleEdit(e) {
    setId(e.id);
    setName(e.name);
    setSalary(e.base_salary);
    handleShow();
  }
  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  async function handleRegister(e) {
    e.preventDefault();

    const data = {
      id,
      name,
      base_salary,
    };
    try {
      if (id === 0) {
        const response = await api.post('function', data);
        setRefreshKey((refreshKey) => refreshKey + 1);
        openNotificationWithIcon(
          'success',
          'Criado com sucesso',
          'O setor foi criado com sucesso'
        );
        handleClose();
      } else {
        const response = await api.put('function', data);
        setRefreshKey((refreshKey) => refreshKey + 1);
        openNotificationWithIcon(
          'success',
          'Editado com sucesso',
          'O setor foi Editado com sucesso'
        );
        handleClose();
      }
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao editar/criar ',
        'O setor não foi criado ou editado'
      );
    }
  }

  async function handleDeleteFunction(id) {
    try {
      await api.delete(`function/${id}`);
      setFactoryFunction(
        factoryFunction.filter((functio) => functio.id !== id)
      );
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'O setor foi deletado com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao deletar ',
        'O setor não foi deletado'
      );
    }
  }

  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [base_salary, setSalary] = useState(0);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
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
      <Row style={{ marginBottom: 16 }}>
        <Col span={24} align="right">
          <Tooltip title="Criar nova Função" placement="right">
            <Button
              className="buttonGreen"
              style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
              onClick={handleShow}
            >
              Nova Função
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Modal
        title="Cadastro de Função"
        visible={show}
        onCancel={handleClose}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            {' '}
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleRegister}>
            {' '}
            Salvar
          </Button>,
        ]}
      >
        <ul>
          <li>
            <label>
              {' '}
              Nome da função:
              <input
                placeholder="Exemplo: Marceneiro 2... "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </li>
          <li>
            <label>
              {' '}
              Salario Base:
              <input
                placeholder="Solicitante"
                type="number"
                value={base_salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </label>
          </li>
        </ul>
      </Modal>

      <SearchTable />
    </Layout>
  );
}
