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
  MinusCircleOutlined,
  BarcodeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { Tooltip, colors } from '@material-ui/core/';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../../../services/api';

// import './style.css'

const Option = Select.Option;

export default function SubProduct() {
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
          title: 'Nome',
          dataIndex: 'user',
          key: 'user',

          sorter: (a, b) => this.compareByAlph(a.user, b.user),
          ...this.getColumnSearchProps('user'),
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
                {/* <Popconfirm
                  onConfirm={() => handleDeleteFunction(record.id)}
                  title="Confirmar remoção?"
                >
                  <a href="#" style={{ marginLeft: 20 }}>
                    {' '}
                    <DeleteOutlined style={{ color: '#ff0000' }} />
                  </a>
                </Popconfirm> */}
                <Link
                  to={`/wmsrm/barcode/${record.id}`}
                  target="_blank"
                  style={{ color: 'rgb(0,0,0,0.65' }}
                >
                  <BarcodeOutlined style={{ marginLeft: 20 }} />
                </Link>
              </React.Fragment>
            );
          },
        },
      ];

      return <Table columns={columns} dataSource={storage} />;
    }
  }

  const [refreshKey, setRefreshKey] = useState(0);

  const [id, setId] = useState(0);
  const [name, setName] = useState('');

  const [ins, setIns] = useState([]);
  const [storage, setStorage] = useState([]);
  const [entry, setEntry] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [position, setPosition] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    api.get('rawmaterial/entry/not-store', {}).then((response) => {
      setIns(response.data);
    });
  }, [refreshKey]);

  useEffect(() => {
    api.get('wmsrm/operation/storage', {}).then((response) => {
      setStorage(response.data);
    });
  }, [refreshKey]);

  async function handleEdit(e) {
    setId(e.id);
    setName(e.name);
    let response = await api.get('wmsrm/operation/entry');
    setEntry(response.data);
    response = await api.get('wmsrm/register/warehouse');
    setWarehouse(response.data);
    response = await api.get('wmsrm/register/position');
    setPosition(response.data);
    response = await api.get(`wmsrm/operation/storage/${e.id}`);
    setItensStorage(response.data);
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
      storages: itensStorages,
      id_user: userId,
    };

    try {
      if (id === 0) {
        try {
          const response = await api.post('wmsrm/operation/storage', data);
          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Armazenamento feito com sucesso',
            'O armazenamento foi realizado com sucesso'
          );
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'O armazenamento não foi realizado'
          );
        }
      } else {
        try {
          let response = await api.put('/wmsrm/operation/storage/edit', data);

          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Alterado com sucesso',
            'O subproduto foi alterado com sucesso'
          );
          setId(0);
          setName('');
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao editar',
            'O subproduto não foi editado'
          );
        }
      }
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao editar',
        'O subproduto não foi editado'
      );
    }
  }

  async function handleDeleteFunction(id) {
    try {
      const response = await api.delete(`sub-product/${id}`);
      setRefreshKey((refreshKey) => refreshKey + 1);
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'O subproduto deletado com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao deletar',
        'O subproduto não foi deletado'
      );
    }
  }

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setName('');
    setId(0);

    setItensStorage([{ insName: '' }]);

    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [itensStorages, setItensStorage] = useState([{}]);

  // handle input change
  const handleINSChange = async (e, index) => {
    const list = [...itensStorages];

    list[index].insId = e[0];
    list[index].insName = `${e[1]} - ${e[2]}`;

    const response = await api.get(`rawmaterial/entry/${e[0]}`);
    setEntry(response.data);

    setItensStorage(list);
  };

  const handleEntryChange = async (e, index) => {
    const list = [...itensStorages];
    list[index].entryId = e[0];
    list[index].entryItensId = e[1];
    list[index].entryName = e[2];
    list[index].remaining = e[3];

    list.map((item) => {
      if (
        item.entryitensId === list[index].entryitensId &&
        item.insId === list[index].insId &&
        item.amount !== undefined
      ) {
        list[index].remaining = list[index].remaining - item.amount;
      }
    });

    setItensStorage(list);
    let response;
    response = await api.get('wmsrm/register/warehouse');
    setWarehouse(response.data);

    try {
      const remaining = await api.get(
        `wmsrm/operation/storage/remaining/${list[index].insId}/${list[index].entryId}`
      );
      // list[index].remaining = remaining.data.quantity;
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'item nao encontrado',
        'Esse item nao foi encontrado para ser armazenado'
      );
    }
  };

  const handleWarehouseChange = async (e, index) => {
    const list = [...itensStorages];
    list[index].warehouseId = e[0];
    list[index].warehouseName = e[1];

    const response = await api.get(`wmsrm/register/position/warehouse/${e}`);
    setPosition(response.data);

    setItensStorage(list);
  };
  const handlePositionChange = async (e, index) => {
    const list = [...itensStorages];
    list[index].positionId = e[0];
    list[index].positionName = e[1];

    setItensStorage(list);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...itensStorages];
    if (name === 'amount') {
      if (parseFloat(value) < 0 || parseFloat(value) > list[index].remaining) {
        setRefreshKey((refreshKey) => refreshKey + 1);
        openNotificationWithIcon(
          'error',
          'Valor incorreto',
          'O valor a ser armazenado nao esta correto'
        );
        list[index][name] = 0;
        setItensStorage(list);
        return;
      }
    }

    list[index][name] = value;
    setItensStorage(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...itensStorages];
    list.splice(index, 1);
    setItensStorage(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setItensStorage([...itensStorages, {}]);
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
          <Tooltip title="Armazenagem" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
              onClick={handleShow}
            >
              Armazenagem
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Modal
        title="Armazenagem"
        visible={show}
        width={800}
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
        {itensStorages.map((itensStorage, index) => {
          return (
            <>
              <Row gutter={5}>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Lote"
                    labelAlign={'left'}
                  >
                    <Input
                      name="lote"
                      placeholder="Nome do lote"
                      value={itensStorage.lote}
                      onChange={(e) => handleInputChange(e, index)}
                      disabled={itensStorage.locked}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="ins"
                    labelAlign={'left'}
                  >
                    <Select
                      showSearch
                      placeholder="Selecione"
                      size="large"
                      value={itensStorage.insName}
                      disabled={itensStorage.locked}
                      onChange={(e) => handleINSChange(e, index)}
                    >
                      {ins.map((option) => {
                        return (
                          <>
                            <Option
                              key={option.id}
                              value={[
                                option.id,
                                option.ins,
                                option.description,
                              ]}
                            >
                              {option.ins} - {option.description}
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
                    label="Entrada"
                    labelAlign={'left'}
                  >
                    <Select
                      showSearch
                      placeholder="Selecione"
                      size="large"
                      value={itensStorage.entryName}
                      onChange={(e) => handleEntryChange(e, index)}
                      disabled={itensStorage.locked}
                    >
                      { }
                      {entry.map((option) => {
                        return (
                          <>
                            <Option
                              key={option.id}
                              value={[
                                option.id,
                                option.id_entryitens,
                                option.name,
                                option.quantity,
                              ]}
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
              <Row gutter={5}>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Almoxarifado"
                    labelAlign={'left'}
                  >
                    <Select
                      showSearch
                      placeholder="Selecione"
                      size="large"
                      value={itensStorage.warehouseName}
                      onChange={(e) => {
                        handleWarehouseChange(e, index);
                        itensStorage.positionName = '';
                      }}
                      disabled={itensStorage.locked}
                    >
                      {warehouse.map((option) => {
                        return (
                          <>
                            <Option
                              key={option.id}
                              value={[option.id, option.description]}
                            >
                              {option.description}
                            </Option>
                          </>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Posição"
                    labelAlign={'left'}
                  >
                    <Select
                      showSearch
                      placeholder="Selecione"
                      size="large"
                      value={itensStorage.positionName}
                      onChange={(e) => handlePositionChange(e, index)}
                      disabled={itensStorage.locked}
                    >
                      {position.map((option) => {
                        return (
                          <>
                            <Option
                              key={option.id}
                              value={[option.id, option.positionName]}
                            >
                              {option.positionName}
                            </Option>
                          </>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Quantidade"
                    labelAlign={'left'}
                  >
                    <Input
                      name="amount"
                      type="number"
                      placeholder="Digite a quantidade"
                      value={itensStorage.amount}
                      onChange={(e) => handleInputChange(e, index)}
                      disabled={itensStorage.locked}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Falta armazenar"
                    labelAlign={'left'}
                  >
                    <Input
                      name="amount"
                      placeholder="Digite a quantidade"
                      value={itensStorage.remaining}
                      disabled={true}
                      style={{ width: '85%', marginRight: 10 }}
                      disabled={itensStorage.locked}
                    />
                    {itensStorages.length !== 1 && (
                      <MinusCircleOutlined
                        onClick={() => handleRemoveClick(index)}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {itensStorages.length - 1 === index && (
                <Button
                  key="primary"
                  title="Novo SubProduto"
                  style={{ width: '100%' }}
                  onClick={handleAddClick}
                  hidden={
                    itensStorage.warehouseId && itensStorage.amount
                      ? false
                      : true
                  }
                  disabled={itensStorage.locked}
                >
                  <PlusOutlined />
                </Button>
              )}
            </>
          );
        })}
      </Modal>

      <SearchTable />
    </Layout>
  );
}
