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
  Select,
  Popconfirm,
  notification,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import { Tooltip } from '@material-ui/core/';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../../../services/api';

// import './style.css'
const { Option } = Select;

export default function Warehouse() {
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

          ...this.getColumnSearchProps('id'),
        },
        {
          title: 'Descrição',
          dataIndex: 'description',
          key: 'description',

          sorter: (a, b) => this.compareByAlph(a.description, b.description),
          ...this.getColumnSearchProps('description'),
        },
        {
          title: 'Local',
          dataIndex: 'local',
          key: 'local',

          sorter: (a, b) => this.compareByAlph(a.local, b.local),
          ...this.getColumnSearchProps('local'),
        },
        {
          title: 'Ativo',
          dataIndex: 'active',
          key: 'active',
          sorter: (a, b) => this.compareByAlph(a.active, b.active),
          ...this.getColumnSearchProps('active'),
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

      return <Table columns={columns} dataSource={warehouse} />;
    }
  }

  const [warehouse, setWarehouse] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  //Validations
  const [errorWarehouse, setErrorWarehouse] = useState('');
  const [errorLocal, setErrorLocal] = useState('');

  useEffect(() => {
    api.get('/wmsrm/register/warehouse', {}).then((response) => {
      setWarehouse(response.data);
    });
  }, [refreshKey]);

  async function handleEdit(e) {
    setId(e.id);
    setDescription(e.description);
    setLocal(e.local);

    const status = (e.active === 'Sim' ? 1 : 0);
    setActive(status);

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
      description,
      local,
      active,
    };
    if (description === '') {
      setErrorWarehouse('Este campo deve ser preenchido');
      return;
    }
    if (local === '') {
      setErrorLocal('Este campo deve ser preenchido');
      return;
    }

    try {
      if (id === 0) {
        try {
          await api.post('/wmsrm/register/warehouse', data);
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Criado com sucesso',
            'O almoxarifado foi criado com sucesso'
          );
          handleClose();
        }
        catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'O almoxarifado não foi adicionado'
          );
        }
      }
      else {
        try {
          await api.put(`/wmsrm/register/warehouse/${id}`, data);

          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Alterado com sucesso',
            'O almoxarifado foi alterado com sucesso'
          );

          setId(0);
          setDescription('');
          handleClose();
        }
        catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao editar',
            'O almoxarifado não foi editado'
          );
        }
      }
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao editar',
        'O almoxarifado não foi editado'
      );
    }
  }

  async function handleDeleteFunction(id) {
    try {
      await api.delete(`/wmsrm/register/warehouse/${id}`);
      setWarehouse(warehouse.filter((warehouse) => warehouse.id !== id));
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'O almoxarifado foi deletado com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao deletar',
        'O almoxarifado não foi deletado'
      );
    }
  }

  const [id, setId] = useState(0);
  const [description, setDescription] = useState('');
  const [local, setLocal] = useState('');
  const [active, setActive] = useState(1);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setId(0);
    setDescription('');
    setLocal('');
    setActive(1);

    setShow(false);

  };
  const handleShow = () => {
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
      <Row style={{ marginBottom: 16 }}>
        <Col span={24} align="right">
          <Tooltip title="Criar novo Almoxarifado" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
              onClick={handleShow}
            >
              Novo Almoxarifado
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Modal
        title="Cadastro de Almoxarifado"
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
          <li style={{ marginBottom: 20 }}>
            <label>
              {' '}
              Nome do almoxarifado: <span style={{ color: 'red', marginBottom: 10 }}> * </span>
              <input
                placeholder="Digite o nome do almoxarifado "
                style={{ marginBottom: 0 }}
                name="description"
                value={description}
                onChange=
                {(e) => { setDescription(e.target.value); setErrorWarehouse(''); }}
              />
              <span style={{ color: 'red', marginBottom: 10 }}>{errorWarehouse}</span>
            </label>
          </li>
          <li style={{ marginBottom: 20 }}>
            <label>
              {' '}
              Nome do Local: <span style={{ color: 'red', marginBottom: 10 }}> * </span>
              <input
                placeholder="Digite o nome do local "
                style={{ marginBottom: 0 }}
                name="local"
                value={local}
                onChange={(e) => { setLocal(e.target.value); setErrorLocal(''); }}
              />
              <span style={{ color: 'red', marginBottom: 10 }}>{errorLocal}</span>
            </label>
          </li>
          <li>
            <label>
              {' '}
              Ativo: <span style={{ color: 'red', marginBottom: 10 }}> * </span>
              <Select
                name='active'
                style={{ width: '100%', marginTop: 12 }}
                value={active}
                onChange={(e) => setActive(e)}
              >
                <Option value={1}>Sim</Option>
                <Option value={0}>Não</Option>
              </Select>
            </label>
          </li>
        </ul>
      </Modal>

      <SearchTable />
    </Layout>
  );
}
