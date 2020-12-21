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
import api from '../../../../services/api';

// import './style.css'
const { Option } = Select;

export default function RawMaterial() {
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
          title: 'INS',
          dataIndex: 'ins',
          key: 'ins',

          sorter: (a, b) => this.compareByAlph(a.ins, b.ins),
          ...this.getColumnSearchProps('ins'),
        },
        {
          title: 'Descrição',
          dataIndex: 'description',
          key: 'description',

          sorter: (a, b) => this.compareByAlph(a.description, b.description),
          ...this.getColumnSearchProps('description'),
        },
        {
          title: 'Un. Medida',
          dataIndex: 'un_measure',
          key: 'un_measure',

          sorter: (a, b) => this.compareByAlph(a.un_measure, b.un_measure),
          ...this.getColumnSearchProps('un_measure'),
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
                    <DeleteOutlined style={{ color: '#ff0000' }} />
                  </a>
                </Popconfirm>
              </React.Fragment>
            );
          },
        },
      ];

      return <Table columns={columns} dataSource={rawMaterials} />;
    }
  }

  const [rawMaterials, setRawMaterials] = useState([]);
  const [id_unmeasure, setId_unmeasure] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [coefficient, setCoefficient] = useState(0);

  //Validações
  const [errorIns, setErrorIns] = useState('');
  const [errorDescription, setErrorDescription] = useState('');
  const [errorUnMeasure, setErrorUnMeasure] = useState('');

  useEffect(() => {
    api.get('wmsrm/register/rawmaterial', {}).then((response) => {
      setRawMaterials(response.data);
    });
  }, [refreshKey]);

  async function handleEdit(e) {
    setId(e.id);
    setIns(e.ins);
    setDescription(e.description);
    setId_unmeasure(e.id_unmeasure);
    setCoefficient(e.coefficient);

    const status = e.active === 'Sim' ? 1 : 0;
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
      ins,
      description,
      id_unmeasure,
      active,
      coefficient,
    };

    if (ins === '') {
      setErrorIns('Este campo deve ser preenchido');
      return;
    }
    if (description === '') {
      setErrorDescription('Este campo deve ser preenchido');
      return;
    }

    if (id_unmeasure === '' || id_unmeasure.length === 0) {
      setErrorUnMeasure('Este campo deve ser preenchido');
      return;
    }

    try {
      if (id === 0) {
        try {
          const response = await api.post('wmsrm/register/rawmaterial', data);
          setRefreshKey((refreshKey) => refreshKey + 1);

          openNotificationWithIcon(
            'success',
            'Criado com sucesso',
            'O insumo foi criado com sucesso'
          );
          handleClose();
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'O insumo não foi adicionado'
          );
        }
      } else {
        try {
          await api.put(`wmsrm/register/rawmaterial/${id}`, data);

          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Alterado com sucesso',
            'O insumo foi alterado com sucesso'
          );

          setId(0);
          setIns('');
          setDescription('');

          handleClose();
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao editar',
            'O insumo não foi editado'
          );
        }
      }
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao editar',
        'O insumo não foi editado'
      );
    }
  }

  async function handleDeleteFunction(id) {
    try {
      await api.delete(`wmsrm/register/rawmaterial/${id}`);
      setRawMaterials(rawMaterials.filter((option) => option.id !== id));
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'O insumo foi deletado com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao deletar',
        'O insumo não foi deletado'
      );
    }
  }

  const [id, setId] = useState(0);
  const [ins, setIns] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(1);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setId(0);
    setIns('');
    setDescription('');
    setId_unmeasure('');
    setActive(1);
    setCoefficient(1);

    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const [unMeasure, setUnMeasure] = useState([]);

  useEffect(() => {
    api.get('/wmsrm/register/unmeasure', {}).then((response) => {
      setUnMeasure(response.data);
    });
  }, []);

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
          <Tooltip title="Criar novo Insumo" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
              onClick={handleShow}
            >
              Novo Insumo
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Modal
        title="Cadastro de insumo"
        visible={show}
        onCancel={handleClose}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleRegister}>
            Salvar
          </Button>,
        ]}
      >
        <ul>
          <li style={{ marginBottom: 20 }}>
            <label>
              Código INS:
              <span style={{ color: 'red', marginBottom: 10 }}> * </span>
              <input
                placeholder="Digite o código INS"
                style={{ marginBottom: 0 }}
                name="ins"
                value={ins}
                onChange={(e) => {
                  setIns(e.target.value);
                  setErrorIns('');
                }}
              />
              <span style={{ color: 'red', marginBottom: 10 }}>{errorIns}</span>
            </label>
          </li>
          <li style={{ marginBottom: 20 }}>
            <label>
              Descrição:
              <span style={{ color: 'red', marginBottom: 10 }}> * </span>
              <input
                placeholder="Digite a descrição do insumo"
                style={{ marginBottom: 0 }}
                name="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrorDescription('');
                }}
              />
              <span style={{ color: 'red', marginBottom: 10 }}>
                {errorDescription}
              </span>
            </label>
          </li>
          <li style={{ marginBottom: 20 }}>
            <label>
              Unidade de medida:
              <span style={{ color: 'red', marginBottom: 10 }}> * </span>
              <Select
                showSearch
                placeholder="Selecione a unidade de medida"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                value={id_unmeasure}
                onChange={(e) => {
                  setId_unmeasure(e);
                  setErrorUnMeasure('');
                }}
                style={{ width: '100%', marginTop: 12 }}
              >
                {unMeasure.map((option) => {
                  return (
                    <>
                      <Option key={option.id} value={option.id}>
                        {option.unity}
                      </Option>
                    </>
                  );
                })}
              </Select>
              <span style={{ color: 'red', marginBottom: 10 }}>
                {errorUnMeasure}
              </span>
            </label>
          </li>
          <li>
            <label>
              Fator de conversão:
              <span style={{ color: 'red', marginBottom: 10 }}> * </span>
              <input
                placeholder="Digite o fator de conversão do insumo"
                style={{ marginBottom: 0 }}
                name="coefficient"
                value={coefficient}
                onChange={(e) => {
                  setCoefficient(e.target.value);
                }}
              />
            </label>
          </li>
          <li>
            <label>
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
