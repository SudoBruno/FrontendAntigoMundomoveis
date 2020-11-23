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
  Divider,
  Form,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ConsoleSqlOutlined,
} from '@ant-design/icons';

import { Tooltip } from '@material-ui/core/';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../../../services/api';

// import './style.css'
const { Option } = Select;

export default function Position() {
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
          title: 'Posição',
          dataIndex: 'position_name',
          key: 'position_name',

          sorter: (a, b) =>
            this.compareByAlph(a.position_name, b.position_name),
          ...this.getColumnSearchProps('position_name'),
        },
        {
          title: 'Almoxarifado',
          dataIndex: 'warehouse',
          key: 'warehouse',

          sorter: (a, b) => this.compareByAlph(a.warehouse, b.warehouse),
          ...this.getColumnSearchProps('warehouse'),
        },
        {
          title: 'Ativo',
          dataIndex: 'ativo',
          key: 'ativo',

          sorter: (a, b) => this.compareByAlph(a.ativo, b.ativo),
          ...this.getColumnSearchProps('ativo'),
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

      return <Table columns={columns} dataSource={position} />;
    }
  }

  const [position, setPosition] = useState([]);

  const [refreshKey, setRefreshKey] = useState(0);

  const [id, setId] = useState(0);
  const [position_name, setPosition_name] = useState('');
  const [warehouseId, setWarehouseId] = useState();
  const [active, setActive] = useState(1);

  const [show, setShow] = useState(false);

  //Validations
  const [errorPosition, setErrorPosition] = useState('');
  const [errorWarehouse, setErrorWarehouse] = useState('');

  const handleClose = () => {
    setId(0);
    setPosition_name('');
    setWarehouseId();
    setActive(1);

    setShow(false);
  };

  const handleShow = () => setShow(true);

  //Preenche o menu com todos os almoxarifados
  const [warehousesDrop, setWarehousesDrop] = useState([]);

  useEffect(() => {
    api.get('/wmsrm/register/warehouse', {}).then((response) => {
      setWarehousesDrop(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('/wmsrm/register/position', {}).then((response) => {
      setPosition(response.data);
    });
  }, [refreshKey]);

  async function handleEdit(e) {
    setId(e.id);
    setPosition_name(e.position_name);
    setWarehouseId(e.id_warehouse);

    const status = e.ativo === 'Sim' ? 1 : 0;
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
      position_name,
      id_warehouse: warehouseId,
      active,
    };

    data.position_name = data.position_name.toUpperCase();

    if (position_name === '') {
      setErrorPosition('Este campo deve ser preenchido');
      return;
    }

    if (warehouseId === '' || warehouseId.length === 0) {
      setErrorWarehouse('Este campo deve ser preenchido');
      return;
    }

    try {
      if (id === 0) {
        try {
          await api.post('/wmsrm/register/position', data);
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Criado com sucesso',
            'a posição foi criada com sucesso'
          );

          handleClose();
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'a posição não foi adicionada'
          );
        }
      } else {
        try {
          await api.put(`/wmsrm/register/position/${id}`, data);

          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Alterado com sucesso',
            'A posição foi alterada com sucesso'
          );

          setId(0);
          setPosition_name('');
          setWarehouseId();

          handleClose();
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao editar',
            'A posição não foi editada'
          );
        }
      }
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao editar',
        'A posição não foi editada'
      );
    }
  }

  async function handleDeleteFunction(id) {
    try {
      await api.delete(`/wmsrm/register/position/${id}`);
      setPosition(position.filter((position) => position.id !== id));
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'A posição foi deletado com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao deletar',
        'A posição não foi deletado'
      );
    }
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
          <Tooltip title="Nova Posição" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
              onClick={handleShow}
            >
              Nova Posição
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Modal
        title="Cadastro de Posição do Armazém"
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
              Nome da posição:{' '}
              <span style={{ color: 'red', marginBottom: 10 }}> * </span>
              <Input
                name="name"
                placeholder="Digite o nome da posição"
                onChange={(e) => {
                  setPosition_name(e.target.value);
                  setErrorPosition('');
                }}
                value={position_name}
              />
              <span style={{ color: 'red', marginBottom: 10 }}>
                {errorPosition}
              </span>
            </label>
          </li>

          <li>
            <label>
              {' '}
              Almoxarifado:{' '}
              <span style={{ color: 'red', marginBottom: 10 }}> * </span>
              <Select
                showSearch
                placeholder="Selecione um almoxarifado"
                size="large"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={warehouseId}
                onChange={(e) => {
                  setWarehouseId(e);
                  setErrorPosition('');
                }}
                style={{ width: '100%', marginTop: 12, marginBottom: 12 }}
              >
                {warehousesDrop.map((option) => {
                  return (
                    <>
                      <Option key={option.id} value={option.id}>
                        {option.description}
                      </Option>
                    </>
                  );
                })}
              </Select>
              <span style={{ color: 'red', marginBottom: 10 }}>
                {errorWarehouse}
              </span>
            </label>
          </li>
          <li>
            <label>
              {' '}
              Ativo:<span style={{ color: 'red', marginBottom: 10 }}> * </span>
              <Select
                style={{ width: '100%', marginTop: 12 }}
                name="active"
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
