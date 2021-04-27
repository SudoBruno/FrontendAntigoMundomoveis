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
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

import api from '../../../../services/api';

const { Option } = Select;

export default function Entry() {
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
          title: 'Descrição',
          dataIndex: 'name',
          key: 'name',

          sorter: (a, b) => this.compareByAlph(a.name, b.name),
          ...this.getColumnSearchProps('name'),
        },
        {
          title: 'Usuário',
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
                />
                {/* <Popconfirm
                  onConfirm={() => handleDeleteFunction(record.id)}
                  title="Confirmar remoção?"
                >
                  <a href="#" style={{ marginLeft: 20 }}>
                    <DeleteOutlined style={{ color: '#ff0000' }} />
                  </a>
                </Popconfirm> */}
              </React.Fragment>
            );
          },
        },
      ];

      return <Table columns={columns} dataSource={entry} />;
    }
  }
  //#region States and variables

  //Get userName and id that is logged in system
  const user = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');

  const [entry, setEntry] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [id, setId] = useState(0);
  const [description, setDescription] = useState('');
  const [fiscalNumber, setFiscalNumber] = useState('');
  const [id_user, setIdUser] = useState(userId + ' - ' + user);
  const [rawMaterials, setRawMaterials] = useState([
    {
      id: 0,
      id_rawmaterial: '',
      quantity: '',
      gradeValues: '',
      ins: '',
      coefficient: '',
      gradeValues: '',
      un_measure: '',
      description: '',
      errorRawMaterial: '',
      errorQuantity: '',
    },
  ]);

  const [locked_entry, setLockedEntry] = useState(false); //Disabled or Enable mode

  const [errorDescription, setErrorDescription] = useState('');
  const [errorFiscalNumber, setErrorFiscalNumber] = useState('');

  const [dropRawMaterial, setDropRawMaterial] = useState([]);

  const [show, setShow] = useState(false);

  //#endregion

  //#region Effects
  useEffect(() => {
    api.get('/wmsrm/operation/entry', {}).then((response) => {
      setEntry(response.data);
    });
  }, [refreshKey]);

  useEffect(() => {
    api.get('/wmsrm/register/rawmaterial-active', {}).then((response) => {
      setDropRawMaterial(response.data);
    });
  }, []);

  //#endregion

  //#region Methods
  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  const handleClose = () => {
    setId(0);
    setDescription('');
    setFiscalNumber('');
    setErrorDescription('');
    setRawMaterials([
      {
        id: 0,
        id_rawmaterial: '',
        quantity: '',
        price: '',
        ins: '',
        coefficient: '',
        gradeValues: '',
        un_measure: '',
        description: '',
        errorRawMaterial: '',
        errorQuantity: '',
        unitaryValue: '',
      },
    ]);

    setShow(false);
    setLockedEntry(false);
  };

  const handleShow = () => setShow(true);

  const HandleChangeRawMaterial = (value, index) => {
    var NewArray = [...rawMaterials];

    NewArray[index].id_rawmaterial = value[0];
    NewArray[index].coefficient = value[1];
    NewArray[index].ins = value[2];
    NewArray[index].description = value[3];
    NewArray[index].un_measure = value[4];
    NewArray[index].nameRawMaterial = `${value[2]} / ${value[3]} (${value[4]})`;
    NewArray[index].errorRawMaterial = '';

    setRawMaterials(NewArray);
  };

  const HandleChangeQuantity = (value, index) => {
    var NewArray = [...rawMaterials];

    NewArray[index].quantity = value;
    NewArray[index].gradeValues =
      NewArray[index].unitaryValue *
      NewArray[index].coefficient *
      parseFloat(value.replace(',', '.'));
    NewArray[index].errorQuantity = '';

    setRawMaterials(NewArray);
  };

  const HandleChangePrice = (value, index) => {
    var NewArray = [...rawMaterials];

    NewArray[index].unitaryValue = value;
    NewArray[index].gradeValues =
      value *
      NewArray[index].coefficient *
      parseFloat(NewArray[index].quantity);

    setRawMaterials(NewArray);
  };

  const HandleChangeGradeValue = (value, index) => {
    var NewArray = [...rawMaterials];

    NewArray[index].unitaryValue = value;
    NewArray[index].gradeValues =
      value *
      NewArray[index].coefficient *
      parseFloat(NewArray[index].quantity);
    setRawMaterials(NewArray);
  };

  const handleRemoveClick = (index) => {
    const list = [...rawMaterials];
    list.splice(index, 1);
    setRawMaterials(list);
  };

  const handleAddClick = () => {
    setRawMaterials([
      ...rawMaterials,
      {
        id_rawmaterial: '',

        errorRawMaterial: '',
        errorQuantity: '',
      },
    ]);
  };

  ////#endregion

  //#region CRUD - Methods

  async function handleEdit(e) {
    setId(e.id);
    setDescription(e.name);
    setFiscalNumber(e.fiscalNumber);
    setIdUser(e.user_id + ' - ' + e.user);
    setLockedEntry(e.closed_entry); //Close entry

    const resp = await api.get(`/wmsrm/operation/entry-itens/${e.id}`);

    setRawMaterials(resp.data);

    handleShow();
  }

  async function handleRegister(e) {
    e.preventDefault();
    const idUserLogged = id_user.split('-')[0];

    const data = {
      id,
      description,
      fiscalNumber,
      id_user: idUserLogged,
      entries: rawMaterials,
    };

    //Validations init

    let countErrors = 0;

    if (description === '') {
      setErrorDescription('Este campo deve ser preenchido');
    }

    if (fiscalNumber === '') {
      setErrorFiscalNumber('Este campo deve ser preenchido');
    }

    let NewArray = [...rawMaterials];

    rawMaterials.map((item, index) => {
      if (item.id_rawmaterial === '' || item.id_rawmaterial.length === 0) {
        countErrors++;
        NewArray[index].errorRawMaterial = 'Este valor deve ser preenchido';
      }

      if (
        parseFloat(item.quantity) === 0.0 ||
        item.quantity === '' ||
        item.quantity.length === 0
      ) {
        countErrors++;
        NewArray[index].errorQuantity = 'Qtd obrigatória';
      }
    });
    setRawMaterials(NewArray);

    //End of Validations

    if (countErrors === 0) {
      try {
        if (id === 0) {
          try {
            await api.post('/wmsrm/operation/entry', data);
            setRefreshKey((refreshKey) => refreshKey + 1);
            openNotificationWithIcon(
              'success',
              'Criado com sucesso',
              'a entrada foi criada com sucesso'
            );
            handleClose();
          } catch (error) {
            openNotificationWithIcon(
              'error',
              'Erro ao adicionar',
              'a entrada não foi adicionada'
            );
          }
        } else {
          try {
            await api.put(`/wmsrm/operation/entry/edit/`, data);

            setRefreshKey((refreshKey) => refreshKey + 1);
            openNotificationWithIcon(
              'success',
              'Alterado com sucesso',
              'A entrada foi alterada com sucesso'
            );

            setId(0);
            setDescription('');
            setErrorDescription('');

            handleClose();
          } catch (error) {
            openNotificationWithIcon(
              'error',
              'Erro ao editar',
              'A entrada não foi editada'
            );
          }
        }
      } catch (error) {
        openNotificationWithIcon(
          'error',
          'Erro ao editar',
          'A entrada não foi editada'
        );
      }
    }
  }

  async function handleDeleteFunction(id) {
    try {
      await api.delete(`/wmsrm/operation/entry/${id}`);
      setEntry(entry.filter((entry) => entry.id !== id));
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'A entrada foi excluída com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao excluir',
        'A entrada não foi excluída'
      );
    }
  }
  //#endregion

  //#region Modal
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
          <Tooltip title="Cadastrar Nova Entrada de Insumos" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginRight: 5, marginTop: 3, fontSize: '14px' }}
              onClick={handleShow}
            >
              Nova entrada
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Modal
        title="Entrada de Insumos"
        visible={show}
        width={800}
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
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Nome da Entrada:"
              labelAlign={'left'}
              required
            >
              {}
              <Input
                disabled={locked_entry}
                name="description"
                placeholder="Descreva a entrada"
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrorDescription('');
                }}
                value={description}
              />
              <span style={{ color: 'red' }}>{errorDescription}</span>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Número da nota:"
              labelAlign={'left'}
              required
            >
              <Input
                disabled={locked_entry}
                name="fiscalNumber"
                placeholder="Digite o número da nota fiscal"
                onChange={(e) => {
                  setFiscalNumber(e.target.value);
                  setErrorFiscalNumber('');
                }}
                value={fiscalNumber}
              />
              <span style={{ color: 'red' }}>{errorFiscalNumber}</span>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Usuário:"
              labelAlign={'left'}
              required
            >
              <Input disabled={true} name="code" value={id_user} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {rawMaterials.map((selectRawMaterial, index) => {
          return (
            <>
              <Row gutter={24}>
                <Col span={20}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Insumo:"
                    labelAlign={'left'}
                    required
                  >
                    <Select
                      disabled={locked_entry}
                      showSearch
                      placeholder="Selecione o insumo"
                      size="large"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={(e) => HandleChangeRawMaterial(e, index)}
                      value={
                        selectRawMaterial.ins +
                        ' / ' +
                        selectRawMaterial.description +
                        ' (' +
                        selectRawMaterial.un_measure +
                        ')'
                      }
                    >
                      {dropRawMaterial.map((option) => {
                        return (
                          <>
                            <Option
                              key={option.id}
                              value={[
                                option.id,
                                option.coefficient,
                                option.ins,
                                option.description,
                                option.un_measure,
                              ]}
                            >
                              {option.ins +
                                ' / ' +
                                option.description +
                                ' (' +
                                option.un_measure +
                                ')'}
                            </Option>
                          </>
                        );
                      })}
                      ;
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Quantidade:"
                    labelAlign={'left'}
                    required
                  >
                    <Input
                      name="quantity"
                      type="number"
                      max="999999999"
                      disabled={locked_entry}
                      step="0.001"
                      value={selectRawMaterial.quantity}
                      onChange={(e) =>
                        HandleChangeQuantity(e.target.value, index)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Valor unitário do insumo"
                    labelAlign={'left'}
                    required
                  >
                    <Input
                      disabled={locked_entry}
                      name="price"
                      type="number"
                      min="0"
                      max="999999999"
                      step="0.01"
                      value={selectRawMaterial.unitaryValue}
                      onChange={(e) => {
                        HandleChangePrice(e.target.value, index);
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Valor Total (R$)"
                    labelAlign={'left'}
                  >
                    <Input
                      disabled={locked_entry}
                      name="price"
                      type="number"
                      min="0"
                      max="999999999"
                      step="0.01"
                      disabled
                      value={selectRawMaterial.gradeValues}
                      style={{ width: '80%', marginRight: '5%' }}
                    />

                    {rawMaterials.length !== 1 && (
                      <MinusCircleOutlined
                        onClick={() => handleRemoveClick(index)}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  {rawMaterials.length - 1 === index && (
                    <Button
                      disabled={locked_entry}
                      key="primary"
                      title="Novo insumo"
                      style={{ width: '100%' }}
                      onClick={handleAddClick}
                    >
                      <PlusOutlined />
                      Adicionar insumo
                    </Button>
                  )}
                </Col>
              </Row>
            </>
          );
        })}

        <Divider />
      </Modal>

      <SearchTable />
    </Layout>
  );
  //#endregion
}
