import React, { useState, useEffect } from 'react';
import { BarcodeOutlined } from '@ant-design/icons';
import { Tooltip } from '@material-ui/core/';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
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
import { PlusOutlined, MinusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import confirm from 'antd/lib/modal/confirm';

const Option = Select.Option;

export default function PCP() {
  class SearchTable extends React.Component {
    state = {
      loading: false,
      searchText: '',
      searchedColumn: '',
      pagination: pagination,
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
            onPressEnter={() => {
              this.handleSearch(selectedKeys, confirm, dataIndex);
            }}
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
        pagination: pagination,
      });
    };

    handleReset = (clearFilters) => {
      clearFilters();

      this.setState({ searchText: '', pagination: pagination });
    };

    handleTableChange = (pagination, filters, sorter) => {
      this.setState({
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
          title: 'Data inicial',
          dataIndex: 'initial_date',
          key: 'initial_date',
          sorter: (a, b) => this.compareByAlph(a.initial_date, b.initial_date),
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
                  onClick={() => { handleEdit(record); setIsEdit(true) }}
                />
                <Link
                  to={`/pcp/${record.id}`}
                  style={{ color: 'rgb(0,0,0,0.65', marginRight: 20 }}
                  target="_blank"
                >
                  <BarcodeOutlined style={{ marginLeft: 20 }} />
                </Link>
                <>
                  {status == false &&
                    data[0] != undefined &&
                    data[0].pcpId != record.id && (
                      <DownloadOutlined
                        onClick={() => {
                          handleDownload(record);
                          setStatus(true);
                          setPagination(this.state.pagination);
                        }}
                      />
                    )}
                  {status == true &&
                    data[0] != undefined &&
                    data[0].pcpId != record.id && (
                      <DownloadOutlined
                        onClick={() => {
                          handleDownload(record);
                          setStatus(true);
                          setPagination(this.state.pagination);
                        }}
                      />
                    )}

                  {status == true &&
                    data[0] != undefined &&
                    data[0].pcpId == record.id && (
                      <CSVLink
                        {...csvReport}
                        style={{ color: '#000' }}
                        separator={';'}
                        onClick={() => {
                          setStatus(false);
                          setData([{}]);
                        }}
                      >
                        Download
                      </CSVLink>
                    )}
                </>
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

      return (
        <Table
          columns={columns}
          dataSource={productionPlanControl}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          rowKey="id"
        />
      );
    }
  }
  const [status, setStatus] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [selectProduct, setSelectProducts] = useState([
    { id: '', amount: '', color: '' },
  ]);
  const [productionLines, setProductionLine] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [show, setShow] = useState(false);
  const [dateFinal, setDateFinal] = useState('');
  const [dateInitial, setDateInitial] = useState('');
  const [productionLineId, setProductionLineId] = useState(1);
  const [productionLineName, setProductionLineName] = useState('');
  const [productionPlanControl, setProductionPlanControl] = useState([]);
  const [colors, setColors] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const handleDownload = async (e) => {
    const response = await api.get(`production/product-plan-control/${e.id}`);
    setData(response.data);
  };

  const [data, setData] = useState([{}]);
  const [headers, setHeaders] = useState([
    { label: 'Linha de produção', key: 'line' },
    { label: 'Produto', key: 'product' },
    { label: 'color', key: 'color' },
    { label: 'Cod de barras', key: 'barCode' },
    { label: 'Cod. Interno', key: 'code' },
    { label: 'Setor', key: 'factorySector' },
    { label: 'PCP', key: 'pcpName' },
    { label: 'Data lançamento', key: 'release' },
    { label: 'Funcionário', key: 'employeeName' },
  ]);

  const csvReport = {
    data: data,
    headers: headers,
    filename: 'relatorioDeNaoProduzidos.csv',
  };

  const handleClose = () => {
    setName('');
    setId(0);

    setDateFinal('');
    setDateInitial('');
    setSelectProducts([{ id: '', amount: '', color: '' }]);
    setProductionLineId(1);
    setProductionLineName('');
    setShow(false);
  };
  const handleShow = () => { setShow(true) };

  useEffect(() => {
    api.get('product-plan-control ', {}).then((response) => {
      setProductionPlanControl(response.data);
    });
  }, [refreshKey]);

  useEffect(() => {
    api.get('production-line', {}).then((response) => {
      setProductionLine(response.data);
    });
  }, []);

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

    const response = await api.get(`/production-plan-control/${e.id}`);
    setDateInitial(response.data[0].initialDate);
    setDateFinal(response.data[0].finalDate);
    setProductionLineId(response.data[0].productionLineId)
    setProductionLineName(response.data[0].productionLineName);

    setSelectProducts(response.data);


    setIsEdit(true);

    handleShow();
  }

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  async function handleDeleteFunction(id) {
    try {
      const response = await api.delete(`product-plan-control/${id}`);
      setProductionPlanControl(
        productionPlanControl.filter((item) => item.id != id)
      );
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'A PCP foi deletado com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao deletar',
        'A PCP não foi deletado'
      );
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setIsEdit(false);
    if (dateFinal < dateInitial) {
      openNotificationWithIcon(
        'error',
        'Erro nas datas',
        'Data final menor que a data inicial '
      );
      return;
    }
    const data = {
      id,
      name,
      selectProduct: selectProduct,
      dateFinal,
      dateInitial,
      selectProductionLine: productionLineId,
    };

    if (
      name == '' ||
      dateFinal == '' ||
      dateInitial == '' ||
      productionLineId == 0
    ) {
      setError('Este campo deve ser preenchido');
      return;
    }

    try {
      if (id === 0) {
        try {
          const response = await api.post('product-plan-control', data);
          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Criado com sucesso',
            'A PCP foi criado com sucesso'
          );
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'A PCP não foi adicionado'
          );
        }
      } else {
        try {
          const response = await api.put('/production-plan-control', data);
          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Alterado com sucesso',
            'A PCP foi alterado com sucesso'
          );

          setId(0);
          setName('');
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao editar',
            'A PCP não foi editado'
          );
        }
      }
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao editar',
        'A PCP não foi editado'
      );
    }
  }

  useEffect(() => {
    api.get('production-line', {}).then((response) => {
      setProductionLine(response.data);
    });
  }, [refreshKey]);

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

  function HandleChangeColor(e, index) {
    var NewArray = [...selectProduct];

    NewArray[index].color = e;
    setSelectProducts(NewArray);
  }

  function HandleChange(e, index) {
    var NewArray = [...selectProduct];

    if (typeof e[0] == 'number') {
      NewArray[index].id = e[0];
      NewArray[index].name = e[1];
      setSelectProducts(NewArray);
      return;
    }
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
          <Tooltip title="Criar novo PCP" placement="right">
            <Button
              className="buttonGreen"
              style={{ marginRight: 5, marginTop: 3, fontSize: '13px' }}
              onClick={() => { handleShow(); setIsEdit(false) }}
            >
              <PlusOutlined />
              Novo PCP
            </Button>
          </Tooltip>
        </Col>
      </Row>

      <Divider />

      <Modal
        title="Cadastro de PCP"
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
        <label>
          {' '}
          Nome do PCP:
          <input
            placeholder="Informe o nome do PCP"
            style={{ marginBottom: 0 }}
            name="name"
            value={name}
            maxLength={18}
            onChange={(e) => setName(e.target.value)}
          />
          <span style={{ color: 'red', marginBottom: 10 }}>{error}</span>
        </label>

        <Row gutter={5} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Data inicial:"
              labelAlign={'left'}
            >
              <DatePicker
                style={{ height: 40, paddingTop: 8, width: '100%' }}
                format="DD/MM/YYYY"
                onChange={(date) => setDateInitial(date._d)}
                value={dateInitial !== '' ? moment(dateInitial) : ''}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Data Final:"
              labelAlign={'left'}
            >
              <DatePicker
                style={{ height: 40, paddingTop: 8, width: '100%' }}
                format="DD/MM/YYYY"
                onChange={(date) => setDateFinal(date._d)}
                value={dateFinal !== '' ? moment(dateFinal) : ''}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={5}>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Linha de produção:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={productionLineName}
                onChange={(e) => {
                  setProductionLineId(e[0]);
                  setProductionLineName(e[1]);
                }}

              // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
              >
                {productionLines.map((option) => {
                  return (
                    <>
                      <Option key={option.id} value={[option.id, option.name]}>
                        {option.name}
                      </Option>
                    </>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {selectProduct.map((product, index) => {
          return (
            <>
              <Row gutter={5} hidden={isEdit == true ? true : false}>
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
                      onChange={(e) => HandleChange(e, index)}

                    // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
                    >
                      {products.map((option) => {
                        return (
                          <>
                            <Option
                              key={option.id}
                              value={[option.id, option.name]}
                            >
                              {option.name}
                            </Option>
                          </>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col span={8}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Cor:"
                    labelAlign={'left'}
                  >
                    <Select
                      showSearch
                      placeholder="Selecione"
                      size="large"
                      value={product.color}
                      onChange={(e) => HandleChangeColor(e, index)}

                      // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
                    >
                      {colors.map((option) => {
                        return (
                          <>
                            <Option key={option.id} value={option.id}>
                              {option.name}
                            </Option>
                          </>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col> */}

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
                  title="Nova Linha"
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
