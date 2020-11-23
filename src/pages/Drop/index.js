import React, { useState, useEffect } from 'react';

import { Tooltip } from '@material-ui/core/';
import moment from 'moment';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../services/api';
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
  Divider,
  notification,
  Form,
  DatePicker,
  Popconfirm,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

const Option = Select.Option;

export default function Drop() {
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
          dataIndex: 'name',
          key: 'name',

          sorter: (a, b) => this.compareByAlph(a.age, b.age),
          ...this.getColumnSearchProps('name'),
        },
        {
          title: 'Data inicial',
          dataIndex: 'initial_date',
          key: 'initial_date',
          ...this.getColumnSearchProps('initial_date'),
        },
        {
          title: 'Operação',
          dataIndex: 'operacao',
          align: 'center',

          render: (text, record) => {
            return (
              <React.Fragment>
                <EditOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleEdit(record)}
                />
              </React.Fragment>
            );
          },
        },
      ];

      return <Table columns={columns} dataSource={agendaDrop} />;
    }
  }

  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [selectProduct, setSelectProducts] = useState([
    { id: '', amount: '', color: '' },
  ]);

  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [show, setShow] = useState(false);
  const [dateInitial, setDateInitial] = useState(moment());

  const [agendaDrop, setAgendaDrop] = useState([]);
  const [colors, setColors] = useState([]);

  const handleClose = () => {
    setName('');
    setId(0);

    setShow(false);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    api.get('drop ', {}).then((response) => {
      setAgendaDrop(response.data);
    });
  }, [refreshKey]);

  useEffect(() => {
    api.get('color', {}).then((response) => {
      setColors(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('product', {}).then((response) => {
      setProducts(response.data);
    });
  }, []);

  async function handleEdit(e) {
    setId(e.id);
    setName(e.name);

    setDateInitial(e.initial_date);

    const response = await api.get(`drop/${e.id}`);
    if (response.data.length == 0) {
      setSelectProducts([{ id: '', amount: '', color: '' }]);
    } else {
      setSelectProducts(response.data);
    }

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
      selectProduct,
      dateInitial,
    };

    if (name == '' || dateInitial == '') {
      setError('Este campo deve ser preenchido');
      return;
    }

    try {
      if (id === 0) {
        try {
          const response = await api.post('drop', data);
          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Criado com sucesso',
            'A linha foi criado com sucesso'
          );
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'A linha não foi adicionado'
          );
        }
      } else {
        try {
          const response = await api.put('drop', data);

          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Alterado com sucesso',
            'A linha foi alterado com sucesso'
          );

          setId(0);
          setName('');
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao editar',
            'A linha não foi editado'
          );
        }
      }
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao editar',
        'A linha não foi editado'
      );
    }
  }

  async function handleDeleteFunction(id) {
    try {
      const response = await api.delete(`drop/${id}`);
      setAgendaDrop(agendaDrop.filter((agendaDrop) => agendaDrop.id != id));
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'A linha foi deletado com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao deletar',
        'A linha não foi deletado'
      );
    }
  }

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...selectProduct];
    list.splice(index, 1);
    setSelectProducts(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setSelectProducts([...selectProduct, { id: '', amount: '' }]);
  };

  function HandleChangeProduct(e, index) {
    var NewArray = [...selectProduct];
    NewArray[index].name = `${e[2]} - ${e[1]}`;

    NewArray[index].product_id = e[0];

    setSelectProducts(NewArray);
  }

  function HandleChange(e, index) {
    var NewArray = [...selectProduct];

    const { name, value } = e.target;

    NewArray[index][name] = value;
    setSelectProducts(NewArray);
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
        <Col span={24} align="end">
          <Tooltip title="Criar novo Drop" placement="right">
            <Button
              className="buttonGreen"
              style={{ marginRight: 5, marginTop: 3, fontSize: '13px' }}
              onClick={handleShow}
            >
              <PlusOutlined />
              Novo Drop
            </Button>
          </Tooltip>
        </Col>
      </Row>

      <Divider />

      <Modal
        title="Cadastro de Drop"
        visible={show}
        onCancel={handleClose}
        width={800}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleRegister}>
            Salvar
          </Button>,
        ]}
      >
        <Row gutter={5} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Nome drop:"
              labelAlign={'left'}
            >
              <Input
                name="name"
                placeholder="Nome do drop"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Data inicial:"
              labelAlign={'left'}
            >
              <DatePicker
                style={{ height: 40, paddingTop: 8, width: '100%' }}
                format="DD/MM/YYYY"
                defaultValue={moment(dateInitial, 'DD/MM/YYYY')}
                onChange={(date) => setDateInitial(date._d)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {selectProduct.map((product, index) => {
          return (
            <>
              <Row gutter={5}>
                <Col span={16}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Produto:"
                    labelAlign={'left'}
                  >
                    <Select
                      showSearch
                      placeholder="Selecione"
                      size="large"
                      value={product.name}
                      onChange={(e) => HandleChangeProduct(e, index)}

                      // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
                    >
                      {products.map((option) => {
                        return (
                          <>
                            <Option
                              key={option.product_id}
                              value={[option.id, option.reference, option.name]}
                            >
                              {option.name} - {option.reference}
                            </Option>
                          </>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Quantidade:"
                    labelAlign={'left'}
                  >
                    <Input
                      name="amount"
                      placeholder="Digite a quantidade de produto"
                      value={product.amount}
                      onChange={(e) => HandleChange(e, index)}
                      style={{ width: '75%', marginRight: 8 }}
                    />
                    {selectProduct.length !== 1 && (
                      <MinusCircleOutlined
                        onClick={() => handleRemoveClick(index)}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              {selectProduct.length - 1 === index && (
                <Button
                  key="primary"
                  title="Novo item"
                  style={{ width: '100%' }}
                  onClick={handleAddClick}
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
