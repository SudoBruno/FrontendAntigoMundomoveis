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
  Form,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import { Tooltip } from '@material-ui/core/';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../../services/api';

// import './style.css'
const { Option } = Select;

export default function Shift() {
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
        <SearchOutlined style={{ area: filtered ? '#1890ff' : undefined }} />
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
          title: 'Opera????o',
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
                  title="Confirmar remo????o?"
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

      return <Table columns={columns} dataSource={shift} />;
    }
  }

  const [shift, setShift] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [firstEntry, setFirstEntry] = useState('');
  const [firstExit, setFirstExit] = useState('');
  const [secondEntry, setSecondEntry] = useState('');
  const [secondExit, setSecondExit] = useState('');

  useEffect(() => {
    api.get('shift', {}).then((response) => {
      setShift(response.data);
    });
  }, [refreshKey]);

  async function handleEdit(e) {
    setId(e.id);
    setName(e.name);
    setFirstEntry(e.firstEntry);
    setFirstExit(e.firstExit);
    setSecondEntry(e.secondEntry);
    setSecondExit(e.secondExit);

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
      firstEntry,
      firstExit,
      secondEntry,
      secondExit,
    };
    if (name == '') {
      setError('Este campo deve ser preenchido');
      return;
    }

    try {
      if (id === 0) {
        try {
          const response = await api.post('shift', data);
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Criado com sucesso',
            'O turno foi criado com sucesso'
          );
          handleClose();
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'o turno n??o foi adicionado'
          );
        }
      } else {
        try {
          const response = await api.put('shift', data);

          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Alterado com sucesso',
            'O turno foi alterado com sucesso'
          );

          setId(0);
          setName('');
          handleClose();
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao editar',
            'O turno n??o foi editado'
          );
        }
      }
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao editar',
        'o turno n??o foi editado'
      );
    }
  }

  async function handleDeleteFunction(id) {
    try {
      const response = await api.delete(`shift/${id}`);
      setShift(shift.filter((shift) => shift.id !== id));
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'O Turno foi deletado com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao deletar',
        'O Turno n??o foi deletado'
      );
    }
  }

  const [id, setId] = useState(0);
  const [name, setName] = useState('');

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setName('');
    setId(0);
    setShow(false);
  };
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
          <Tooltip title="Criar novo tuno" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
              onClick={handleShow}
            >
              Novo Turno
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Modal
        title="Cadastro de Turno"
        visible={show}
        onCancel={handleClose}
        width={500}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleRegister}>
            Salvar
          </Button>,
        ]}
      >
        <Row>
          <Col span={18}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Nome do turno"
              labelAlign={'left'}
            >
              <Input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Row gutter={5}>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Primeira Entrada"
                labelAlign={'left'}
              >
                <Input
                  name="firstEntry"
                  value={firstEntry}
                  type="time"
                  onChange={(e) => setFirstEntry(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Primeira Saida"
                labelAlign={'left'}
              >
                <Input
                  name="firstExit"
                  value={firstExit}
                  type="time"
                  onChange={(e) => setFirstExit(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Segunda Entrada"
                labelAlign={'left'}
              >
                <Input
                  name="secondEntry"
                  value={secondEntry}
                  type="time"
                  onChange={(e) => setSecondEntry(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Segunda saida"
                labelAlign={'left'}
              >
                <Input
                  name="secondExit"
                  value={secondExit}
                  type="time"
                  onChange={(e) => setSecondExit(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Row>
      </Modal>

      <SearchTable />
    </Layout>
  );
}
