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
} from '@ant-design/icons';

import { Tooltip } from '@material-ui/core/';
import BarcodeReader from 'react-barcode-reader';
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
          title: 'Quantidade',
          dataIndex: 'quantity',
          key: 'quantity',

          sorter: (a, b) => this.compareByAlph(a.quantity, b.quantity),
          ...this.getColumnSearchProps('quantity'),
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
              </React.Fragment>
            );
          },
        },
      ];

      return <Table columns={columns} dataSource={exits} />;
    }
  }

  const [refreshKey, setRefreshKey] = useState(0);

  const [id, setId] = useState(0);
  const [name, setName] = useState('');

  const [ins, setIns] = useState([]);
  const [exits, setExits] = useState([]);
  const [lote, setLote] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [position, setPosition] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [pcp, setPCP] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    api.get('wmsrm/operation/search/storage/ins', {}).then((response) => {
      setIns(response.data);
    });
  }, [refreshKey]);

  useEffect(() => {
    api.get('wmsrm/operation/exit', {}).then((response) => {
      setExits(response.data);
    });
  }, [refreshKey]);

  async function EditBarCode(e, index) {
    let barcode = e.replace(/-/g, '');
    let response;
    const list = [...itensExit];
    try {
      response = await api.get(`wmsrm/operation/exit/barcode/${barcode}`);
      list[index].ins = response.data.exit[0].id_rawmaterial;
      list[index].lote = response.data.exit[0].id;
      list[index].warehouse = response.data.exit[0].id_warehouse;
      list[index].position = response.data.exit[0].id_position;

      list[
        index
      ].ins_name = `${response.data.exit[0].ins} - ${response.data.exit[0].description}`;

      setWarehouse(response.data.warehouse);
      try {
        list[index].remaining = response.data.position[0].quantity;
      } catch (error) {
        setRemaining(0);
        openNotificationWithIcon(
          'error',
          'Quantidade inexistente',
          'Quantidade nao existe'
        );
      }

      setPosition(response.data.position);
      setLote(response.data.lote);

      setItensExit(list);
    } catch (error) {
      openNotificationWithIcon('error', 'Erro ao adicionar', 'Código invalido');
    }
  }

  async function handleEdit(e) {
    setId(e.id);
    setName(e.name);
    let response;
    response = await api.get(`wmsrm/operation/exit/${e.id}`);
    setItensExit(response.data);

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

    itensExit.map((item) => {
      if (
        item.quantity === '' ||
        item.quantity === undefined ||
        item.quantity < 0
      ) {
        openNotificationWithIcon(
          'error',
          'Erro ao adicionar',
          'Essa quantidade não é valida'
        );
        return;
      }

      if (item.ins === '' || item.ins === undefined) {
        openNotificationWithIcon(
          'error',
          'Erro ao adicionar',
          'INS não selecionado'
        );
        return;
      }

      if (item.position === '' || item.position === undefined) {
        openNotificationWithIcon(
          'error',
          'Erro ao adicionar',
          'Posição nao selecionada'
        );
        return;
      }
      if (item.warehouse === '' || item.warehouse === undefined) {
        openNotificationWithIcon(
          'error',
          'Erro ao adicionar',
          'Almoxarifado não selecionado'
        );
        return;
      }
    });
    const data = {
      id,
      storages: itensExit,
      description: pcp,
      id_user: userId,
    };

    try {
      if (id === 0) {
        try {
          setLoading(true);
          const response = await api.post('wmsrm/operation/exit', data);
          setLoading(false);
          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Saída feita com sucesso',
            'A Saída foi realizado com sucesso'
          );
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'A Saída não foi realizado'
          );
        }
      } else {
        // try {
        //   const response = await api.put('sub-product', data);
        //   handleClose();
        //   setRefreshKey((refreshKey) => refreshKey + 1);
        //   openNotificationWithIcon(
        //     'success',
        //     'Alterado com sucesso',
        //     'O subproduto foi alterado com sucesso'
        //   );
        //   setId(0);
        //   setName('');
        // } catch (error) {
        //   openNotificationWithIcon(
        //     'error',
        //     'Erro ao editar',
        //     'O subproduto não foi editado'
        //   );
        // }
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
    setItensExit([{}]);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const [itensExit, setItensExit] = useState([{}]);

  // handle input change
  const handleINSChange = async (e, index) => {
    const list = [...itensExit];
    list[index] = {};

    list[index].ins_name = `${e[0]} - ${e[1]}`;
    list[index].ins = e[2];
    setLote([]);
    const response = await api.get(`wmsrm/stock/lote/${e[2]}`);
    console.log(`wmsrm/stock/lote/${e[2]}`, response.data);
    setLote(response.data);
    setWarehouse([]);
    setPosition([]);

    setItensExit(list);
  };

  const handleLoteChange = async (e, index) => {
    const list = [...itensExit];
    list[index].lote = e;
    console.log(e);

    list[index].warehouse = '';
    list[index].position = '';

    setPosition([]);
    const response = await api.get(
      `wmsrm/stock/warehouse?ins=${list[index].ins}&lote=${e}`
    );
    setWarehouse(response.data);

    setItensExit(list);
  };

  const handleWarehouseChange = async (e, index) => {
    const list = [...itensExit];
    list[index].warehouse = e;

    list[index].position = '';

    const response = await api.get(
      `wmsrm/stock/position?ins=${list[index].ins}&lote=${list[index].lote}&warehouse=${e}`
    );

    setPosition(response.data);

    setItensExit(list);
  };
  const handlePositionChange = async (e, index) => {
    const list = [...itensExit];
    list[index].position = e;
    try {
      const response = await api.get(
        `wmsrm/stock/quantity?ins=${list[index].ins}&lote=${list[index].lote}&warehouse=${list[index].warehouse}&position=${e}`
      );

      console.log(response.data);
      list[index].remaining = response.data.quantity;

      list.map((item) => {
        if (
          item.lote === list[index].lote &&
          item.ins === list[index].ins &&
          item.quantity !== undefined &&
          item.warehouse == list[index].warehouse &&
          item.position == list[index].position
        ) {
          list[index].remaining = list[index].remaining - item.quantity;
        }
      });
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao adicionar',
        'Essa quantidade não é valida'
      );
    }

    setItensExit(list);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...itensExit];
    if (name === 'quantity') {
      if (parseFloat(value) < 0) {
        setRefreshKey((refreshKey) => refreshKey + 1);
        openNotificationWithIcon(
          'error',
          'Valor incorreto',
          'O valor a ser armazenado é menor ou igual a zero'
        );
        list[index][name] = 0;
        setItensExit(list);
        return;
      }
      if (parseFloat(value) > list[index].remaining) {
        setRefreshKey((refreshKey) => refreshKey + 1);
        openNotificationWithIcon(
          'error',
          'Valor maior que o existente',
          'O valor a ser armazenado é maior que o existente'
        );

        list[index][name] = 0;
        setItensExit(list);
        return;
      }
    }

    list[index][name] = value;
    setItensExit(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...itensExit];
    list.splice(index, 1);
    setItensExit(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setItensExit([...itensExit, {}]);
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
          <Tooltip title="Nova Saida" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
              onClick={handleShow}
            >
              Nova Saida
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Modal
        title="Nova Saida"
        visible={show}
        width={800}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            {' '}
            Cancelar
          </Button>,
          <Button
            key="submit"
            loading={loading}
            type="primary"
            onClick={handleRegister}
          >
            {' '}
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Nome do PCP"
              labelAlign={'left'}
            >
              <Input
                name="pcp"
                placeholder="Nome do PCP"
                onChange={(e) => setPCP(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        {itensExit.map((itensStorage, index) => {
          return (
            <>
              <Row gutter={5}>
                <Col span={12}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="ins"
                    labelAlign={'left'}
                  >
                    <Select
                      showSearch
                      placeholder="Selecione"
                      size="large"
                      value={itensStorage.ins_name}
                      onChange={(e) => handleINSChange(e, index)}
                    >
                      {ins.map((option) => {
                        return (
                          <>
                            <Option
                              key={option.id}
                              value={[option.ins, option.ins_name, option.id]}
                            >
                              {option.ins} - {option.ins_name}
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
                    label="Lote"
                    labelAlign={'left'}
                  >
                    <Select
                      showSearch
                      placeholder="Selecione"
                      size="large"
                      value={itensStorage.lote}
                      onChange={(e) => handleLoteChange(e, index)}
                    >
                      {lote.map((option) => {
                        return (
                          <>
                            <Option key={option.id} value={option.id}>
                              {option.lote}
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
                      value={itensStorage.warehouse}
                      onChange={(e) => handleWarehouseChange(e, index)}
                    >
                      {warehouse.map((option) => {
                        return (
                          <>
                            <Option key={option.id} value={option.id}>
                              {option.warehouse}
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
                      value={itensStorage.position}
                      onChange={(e) => handlePositionChange(e, index)}
                    >
                      {position.map((option) => {
                        return (
                          <>
                            <Option key={option.id} value={option.id}>
                              {option.position}
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
                      name="quantity"
                      type="number"
                      min="0.0000"
                      placeholder="Digite a quantidade"
                      value={itensStorage.quantity}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Falta Sair"
                    labelAlign={'left'}
                  >
                    <Input
                      name="amount"
                      value={itensStorage.remaining}
                      disabled={true}
                      style={{ width: '85%', marginRight: 10 }}
                    />
                    {itensExit.length !== 1 && (
                      <MinusCircleOutlined
                        onClick={() => handleRemoveClick(index)}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {itensExit.length - 1 === index && (
                <Button
                  key="primary"
                  title="Novo SubProduto"
                  style={{ width: '100%' }}
                  onClick={handleAddClick}
                >
                  <PlusOutlined />
                </Button>
              )}
              <BarcodeReader onScan={(e) => EditBarCode(e, index)} />
            </>
          );
        })}
      </Modal>

      <SearchTable />
    </Layout>
  );
}
