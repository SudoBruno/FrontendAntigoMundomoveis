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
  Divider,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  CopyOutlined,
} from '@ant-design/icons';

import { Tooltip } from '@material-ui/core/';
import { CSVLink, CSVDownload } from 'react-csv';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../services/api';

// import './style.css'

const Option = Select.Option;

export default function Product() {
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
                <CopyOutlined
                  style={{ cursor: 'pointer', marginLeft: 20 }}
                  onClick={() => handleDuplicate(record)}
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

      return <Table columns={columns} dataSource={product} />;
    }
  }

  const [product, setProduct] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [reference, setReference] = useState('');
  const [laborCost, setLaborCost] = useState(0);
  const [materialCost, setMaterialCost] = useState(0);
  const [volume, setVolume] = useState(1);
  const [sectors, setSectors] = useState([]);
  const [newClient, setNewClient] = useState('');
  const [arrayINS, setINS] = useState([]);
  const [selectINS, setSelectINS] = useState([]);
  const [color, setColor] = useState([]);
  const [colors, setColors] = useState([]);


  const [clientCode, setClientCode] = useState('');

  const [selectProductsSectors, setSelectProductsSectors] = useState([
    { subproduct: '', sector: '', points: '', order: '' },
  ]);
  const [csvData, setCsvData] = useState([]);
  const [input, setInput] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [ready, setReady] = useState(false);

  const data = {
    id: id,
    name: name,
    reference: reference,
    labor_cost: laborCost,
    material_cost: materialCost,
    volume_quantity: volume,
    selectProductsSectors,
    client_id: newClient,
    selectINS,
    color_id: color,
    client_code: clientCode,
  };

  useEffect(() => {
    api.get('product', {}).then((response) => {
      setProduct(response.data);
    });
  }, [refreshKey]);

  useEffect(() => {
    api.get('color', {}).then((response) => {
      setColors(response.data);
    });
  }, []);

  async function handleDuplicate(e) {
    setId(0);
    setName(e.name);
    let response = await api.get(`product/${e.id}`);

    setReference(response.data.reference);

    setLaborCost(response.data.labor_cost);
    setMaterialCost(response.data.material_cost);
    setNewClient(response.data.client_id);
    setColor(response.data.color_id);
    setVolume(response.data.volume_quantity);
    setClientCode(response.data.client_code);

    response = await api.get(`product-sector/${e.id}`);
    if (response.data.length > 0) {
      setSelectProductsSectors(response.data);
    } else {
      setSelectProductsSectors([
        { subproduct: '', sector: '', points: '', order: '' },
      ]);
    }

    response = await api.get(`product-ins/${e.id}`);
    setSelectINS(response.data);

    handleShow();
  }



  async function InputReport() {
    setReady(false);

    const response = await api.get('/product-report');

    setCsvData(response.data);
    setTimeout(
      function () {
        setReady(true);
      }.bind(this),
      500
    );
    setHeaders([
      { label: 'NOME', key: 'productName' },
      { label: 'SETOR', key: 'sectorName' },
      { label: 'PONTUAÇÃO', key: 'points' },
    ]);
  }

  const csvReport = {
    data: csvData,
    headers: headers,
    filename: 'relatórioDeProduto.csv',
  };

  async function handleEdit(e) {
    setId(e.id);
    setName(e.name);
    let response = await api.get(`product/${e.id}`);

    setReference(response.data.reference);

    setLaborCost(response.data.labor_cost);
    setMaterialCost(response.data.material_cost);
    setNewClient(response.data.client_id);
    setColor(response.data.color_id);
    setVolume(response.data.volume_quantity);
    setClientCode(response.data.client_code);

    response = await api.get(`product-sector/${e.id}`);
    if (response.data.length > 0) {
      setSelectProductsSectors(response.data);
    } else {
      setSelectProductsSectors([
        { subproduct: '', sector: '', points: '', order: '' },
      ]);
    }

    response = await api.get(`product-ins/${e.id}`);
    setSelectINS(response.data);

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

    if (data.name == '') {
      setError('Este campo deve ser preenchido');
      return;
    }

    try {
      if (id === 0) {
        try {
          const response = await api.post('product', data);
          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          setLoading(false);
          openNotificationWithIcon(
            'success',
            'Criado com sucesso',
            'O produto foi criado com sucesso'
          );
        } catch (error) {
          setLoading(false);
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'O produto não foi adicionado'
          );
        }
      } else {
        try {
          const response = await api.put('product', data);

          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Alterado com sucesso',
            'O produto foi alterado com sucesso'
          );
          setId(0);
          setName('');
          setLoading(false);
        } catch (error) {
          setLoading(false);
          openNotificationWithIcon(
            'error',
            'Erro ao editar',
            'O produto não foi editado'
          );
        }
      }
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao editar',
        'O produto não foi editado'
      );
    }
  }

  async function handleDeleteFunction(id) {
    try {
      const response = await api.delete(`product/${id}`);
      setRefreshKey((refreshKey) => refreshKey + 1);
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'O produto foi deletado com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao deletar',
        'O produto não foi deletado'
      );
    }
  }

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setName('');
    setId(0);
    setSelectINS([]);
    setSelectProductsSectors([{ subproduct: '', sector: '', points: '' }]);
    setVolume(1);
    setNewClient('');
    setReference('');
    setLaborCost(0);
    setMaterialCost(0);
    setClientCode('');

    setShow(false);
  };

  useEffect(() => {
    api.get('sub-product', {}).then((response) => {
      setSubProduct(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('sector', {}).then((response) => {
      setSectors(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('wmsrm/register/rawmaterial', {}).then((response) => {
      setINS(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('client', {}).then((response) => {
      setClient(response.data);
    });
  }, []);


  const [subProduct, setSubProduct] = useState([]);
  const [client, setClient] = useState([]);

  async function handleShow() {
    setShow(true);
  }

  const handleRemoveClick = (index) => {
    const list = [...selectProductsSectors];
    list.splice(index, 1);
    setSelectProductsSectors(list);
  };

  // handle click event of the Add button
  const handleAddClick = (e, index) => {
    e.preventDefault();
    var position = 0;
    if (index > 0) {
      position = index - 1;
    } else {
      position = 0;
    }

    setSelectProductsSectors([
      ...selectProductsSectors,
      {
        subproductName: selectProductsSectors[position].subproductName,
        subproduct: selectProductsSectors[position].subproduct,
        sector: '',
        points: '',
        amount: selectProductsSectors[position].amount,
        order: '',
      },
    ]);
  };

  function HandleChange(e, index) {
    var NewArray = [...selectProductsSectors];

    var { name, value } = e.target;

    NewArray[index][name] = value;

    setSelectProductsSectors(NewArray);
  }

  function HandleChangeSector(value, index) {
    var NewArray = [...selectProductsSectors];
    NewArray[index].sectorId = value[0];
    NewArray[index].sectorName = value[1];
    setSelectProductsSectors(NewArray);
  }

  function HandleChangeSubProduct(value, index) {
    var NewArray = [...selectProductsSectors];

    NewArray[index].subproduct = value[0];

    NewArray[index].subproductName = value[1];

    setSelectProductsSectors(NewArray);
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

          {!ready && (
            <Button type="submit" className="buttonGreen" onClick={InputReport}>
              <FileExcelOutlined style={{ marginRight: 8 }} />
              Relatório de Produtos
            </Button>
          )}
          {ready && (
            <Button className="buttonGreen">
              <DownloadOutlined style={{ marginRight: 8 }} />
              <CSVLink
                {...csvReport}
                data={csvData}
                style={{ color: '#fff' }}
                separator={';'}
              >
                Download
              </CSVLink>
            </Button>
          )}

          <Tooltip title="Criar novo Produto" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginLeft: 10, marginRight: 5, marginTop: 3, fontSize: '14px' }}
              onClick={handleShow}
            >
              Novo produto
            </Button>

          </Tooltip>
        </Col>
      </Row>
      <Modal
        title="Cadastro de Produto"
        visible={show}
        width={800}
        onCancel={handleClose}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            {' '}
            Cancelar
          </Button>,
          <Button
            loading={loading}
            key="submit"
            type="primary"
            onClick={handleRegister}
          >
            {' '}
            Salvar
          </Button>,
        ]}
      >
        <>
          <Row gutter={5}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Nome do produto:"
                labelAlign={'left'}
              >
                <Input
                  name="name"
                  placeholder="Ex: Lubeck, Living..."
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                {name == '' && <span style={{ color: 'red' }}>{error}</span>}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Quantidade de volume:"
                labelAlign={'left'}
              >
                <Input
                  name="volume_quantity"
                  placeholder="Ex: 1, 2..."
                  onChange={(e) => setVolume(e.target.value)}
                  value={volume}
                />
                {volume == '' && <span style={{ color: 'red' }}>{error}</span>}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Nome do cliente"
                labelAlign={'left'}
              >
                <Select
                  showSearch
                  placeholder="Selecione"
                  size="large"
                  value={newClient}
                  onChange={(e) => setNewClient(e)}
                >
                  {client.map((option) => {
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
            </Col>
          </Row>
          <Row gutter={5}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Referência:"
                labelAlign={'left'}
              >
                <Input
                  name="reference"
                  placeholder="Nosso codigo interno"
                  onChange={(e) => setReference(e.target.value)}
                  value={reference}
                />{' '}
                {reference == '' && (
                  <span style={{ color: 'red' }}>{error}</span>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Cod. Cliente (SKU):"
                labelAlign={'left'}
              >
                <Input
                  name="client_code"
                  placeholder="Código do cliente"
                  onChange={(e) => setClientCode(e.target.value)}
                  value={clientCode}
                />{' '}
                {reference == '' && (
                  <span style={{ color: 'red' }}>{error}</span>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Cor:"
                labelAlign={'left'}
              >
                <Select
                  showSearch
                  placeholder="Selecione"
                  size="large"
                  value={color}
                  onChange={(e) => setColor(e)}

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
            </Col>
          </Row>
          <Row gutter={5}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Valor mão de obra:"
                labelAlign={'left'}
              >
                <Input
                  name="labor_cost"
                  placeholder="Valor passado pelo gerente de produção"
                  onChange={(e) => setLaborCost(e.target.value)}
                  value={laborCost}
                />{' '}
                {laborCost == '' && (
                  <span style={{ color: 'red' }}>{error}</span>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Valor materia prima:"
                labelAlign={'left'}
              >
                <Input
                  name="material_cost"
                  placeholder="Valor passado pelo desenvolvimento"
                  onChange={(e) => setMaterialCost(e.target.value)}
                  value={materialCost}
                />
                {materialCost == '' && (
                  <span style={{ color: 'red' }}>{error}</span>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Divider />

          {selectProductsSectors.map((selectProductSector, index) => {
            return (
              <>
                <Row gutter={5}>
                  <Col span={14}>
                    <Form.Item
                      labelCol={{ span: 23 }}
                      label="Subproduto"
                      labelAlign={'left'}
                    >
                      <Select
                        showSearch
                        placeholder="Selecione"
                        size="large"
                        value={selectProductSector.subproductName}
                        onChange={(e) => HandleChangeSubProduct(e, index)}
                      >
                        {subProduct.map((option) => {
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
                  <Col span={10}>
                    <Form.Item
                      labelCol={{ span: 23 }}
                      label="Setor:"
                      labelAlign={'left'}
                    >
                      <Select
                        showSearch
                        placeholder="Selecione um valor"
                        size="large"
                        onChange={(e) => HandleChangeSector(e, index)}
                        value={selectProductSector.sectorName}
                      >
                        {sectors.map((option) => {
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
                  <Col span={8}>
                    <Form.Item
                      labelCol={{ span: 23 }}
                      label="quantidade:"
                      labelAlign={'left'}
                    >
                      <Input
                        name="amount"
                        value={selectProductSector.amount}
                        onChange={(e) => HandleChange(e, index)}
                        // style={{ width: '80%', marginRight: 8 }}
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      labelCol={{ span: 23 }}
                      label="order:"
                      labelAlign={'left'}
                    >
                      <Input
                        name="order"
                        value={selectProductSector.order}
                        onChange={(e) => HandleChange(e, index)}
                        // style={{ width: '80%', marginRight: 8 }}
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      labelCol={{ span: 23 }}
                      label="Pontos:"
                      labelAlign={'left'}
                    >
                      <Input
                        name="points"
                        placeholder="Pontos"
                        value={selectProductSector.points}
                        onChange={(e) => HandleChange(e, index)}
                        style={{ width: '80%', marginRight: 8 }}
                      />
                      {selectProductsSectors.length !== 1 && (
                        <MinusCircleOutlined
                          onClick={() => handleRemoveClick(index)}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                {selectProductsSectors.length - 1 === index && (
                  <Button
                    key="primary"
                    title="Nova Linha"
                    style={{ width: '100%' }}
                    onClick={(e) => handleAddClick(e, index)}
                  >
                    <PlusOutlined />
                    Subproduto
                  </Button>
                )}
                <Divider />
              </>
            );
          })}
        </>
      </Modal>

      <SearchTable />
    </Layout>
  );
}
