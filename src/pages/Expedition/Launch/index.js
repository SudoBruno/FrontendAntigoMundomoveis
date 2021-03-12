import React, { useState, useEffect } from 'react';
import {
  BarcodeOutlined,
  UndoOutlined,
  ToolOutlined,
  SearchOutlined,
  FileExcelOutlined,
  CheckOutlined,
  DownloadOutlined,
  UploadOutlined,
  SwapOutlined,
  RedoOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import BarcodeReader from 'react-barcode-reader';
import { Route, Link, Redirect } from 'react-router-dom';
import './style.css';

import {
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
} from 'antd';

import api from '../../../services/api';
import Highlighter from 'react-highlight-words';

const Option = Select.Option;

export default function ExpeditionLaunch() {
  class SearchTable extends React.Component {
    state = {
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

    handleTableChange = (filters, sorter) => {
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,

        ...filters,
      });
    };

    render() {
      const columns = [
        {
          title: 'Produto',
          dataIndex: 'product',
        },
        {
          title: 'Cor',
          dataIndex: 'color',
        },
        {
          title: 'Rua',
          dataIndex: 'street',
        },
        {
          title: 'Estoque',
          dataIndex: 'warehouse',
        },
      ];

      return (
        <Table columns={columns} dataSource={launched} pagination={false} />
      );
    }
  }

  const [modalConfigure, setModalConfigure] = useState({
    title: '',
    url: '',
    hidden: true,
    span: 12,
  });

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setLaunched([]);
    setAmount(0);
  };
  const handleInput = () => {
    let modal = {
      title: 'Armazenagem de produtos finalizados',
      url: 'input',
      hidden: false,
      span: 12,
    };
    setModalConfigure(modal);
    setShow(true);
  };

  const handleInputReversal = () => {
    let modal = {
      title: 'Armazenagem de produtos finalizados',
      url: 'input/reversal',
      hidden: true,
      span: 24,
    };
    setModalConfigure(modal);
    setShow(true);
  };

  const handleOutputReversal = () => {
    let modal = {
      title: 'Armazenagem de produtos finalizados',
      url: 'output/reversal',
      hidden: true,
      span: 24,
    };
    setModalConfigure(modal);
    setShow(true);
  };
  const handleLaunch = () => {
    let modal = {
      title: 'Lançamento de produtos na expedição',
      url: 'launch',
      hidden: true,
      span: 24,
    };
    setModalConfigure(modal);
    setShow(true);
  };
  const handleOutput = () => {
    let modal = {
      title: 'Saida de produtos finalizados',
      url: 'output',
      hidden: true,
      span: 12,
    };
    setModalConfigure(modal);
    setShow(true);
  };
  const handleStock = () => {
    let modal = {
      title: 'Alterar endereço',
      url: 'stock',
      hidden: false,
      span: 12,
    };
    setModalConfigure(modal);
    setShow(true);
  };

  const [street, setStreet] = useState([]);
  const [warehouse, setWarehouse] = useState([]);

  const [street_id, setStreetId] = useState(0);
  const [street_name, setStreetName] = useState('');
  const [warehouse_id, setWarehouseId] = useState('');

  const [code, setCode] = useState('');
  const [launched, setLaunched] = useState([]);
  const [expeditionInfo, setExpeditionInfo] = useState([]);
  const [amount, setAmount] = useState(0);
  const [drops, setDrops] = useState([]);
  const [drop, setDrop] = useState(1);

  useEffect(() => {
    api.get('drop-today', {}).then((response) => {
      setDrops(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('/expedition/warehouse', {}).then((response) => {
      setWarehouse(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('/expedition/info', {}).then((response) => {
      setExpeditionInfo(response.data);
    });
  }, [amount]);

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }
  function ButtonClick(e) {
    e.preventDefault();
    let data = {
      code,
      warehouse_id,
      street_id,
      drop,
    };
    LaunchCode(data);
  }
  async function AlterWarehouse(e) {
    setWarehouseId(e);

    const response = await api.get(`expedition/street/${e}`);
    setStreet(response.data);
  }
  async function LaunchCode(data) {
    try {
      const response = await api.post(`expedition/${modalConfigure.url}`, data);

      openNotificationWithIcon(
        'success',
        'Lançado com sucesso',
        'Código lançado com sucesso'
      );
      setLaunched([...launched, response.data]);

      setAmount((amount) => amount + 1);
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao lançar código',
        error.response.data.message
      );
    }
  }

  async function EditBarCode(e) {
    let data = {
      code: e,
      warehouse_id,
      street_id,
      drop,
    };

    if (modalConfigure.url === '') {
      if (warehouse_id !== '') {
        if (street_id !== '') {
          LaunchCode(data);
        } else {
          openNotificationWithIcon(
            'error',
            'Funcionário não selecionado',
            'Nenhum funcionário selecionado'
          );
        }
      } else {
        openNotificationWithIcon(
          'error',
          'Funcionário não selecionado',
          'Nenhum funcionário selecionado'
        );
      }
    } else {
      LaunchCode(data);
    }
  }

  function handleLogout(e) {
    localStorage.clear();

    return <Redirect to="/" />;
  }

  return (
    <>
      <div className="container-expedition">
        <div className="launch-buttons">
          <button
            type="submit"
            className="expedition-input"
            onClick={handleInput}
          >
            <DownloadOutlined style={{ marginRight: 8 }} />
            Entrada
          </button>
          <button
            type="submit"
            className="expedition-input"
            onClick={handleInputReversal}
            style={{ background: '#ea2c2c' }}
          >
            <RedoOutlined style={{ marginRight: 8 }} /> Estorno entrada
          </button>

          <button
            type="submit"
            className="expedition-stock"
            onClick={handleStock}
          >
            <SwapOutlined style={{ marginRight: 8 }} />
            Troca
          </button>
          <button
            type="submit"
            className="expedition-output"
            onClick={handleOutput}
          >
            <UploadOutlined rotate={180} style={{ marginRight: 8 }} />
            Saida
          </button>
          <button
            type="submit"
            className="expedition-input"
            onClick={handleOutputReversal}
            style={{ background: '#ea2c2c' }}
          >
            <RedoOutlined style={{ marginRight: 8 }} />
            Estorno Saida
          </button>
          <button
            type="submit"
            className="lancamento-agrupado"
            onClick={handleLaunch}
          >
            <BarcodeOutlined style={{ marginRight: 8 }} />
            Lançar código
          </button>
        </div>
        <div className="expedition-info">
          <h1>Entradas hoje: {expeditionInfo.input}</h1>
          <h1>Estoque atual: {expeditionInfo.stock}</h1>
          <h1>Saídas hoje: {expeditionInfo.output}</h1>
        </div>
      </div>
      <button className="expedition-logout">
        <Link to="/" onClick={handleLogout} className="">
          <ExportOutlined style={{ marginRight: 8 }} color={'#fff'} />
          Sair
        </Link>
      </button>
      <Modal
        title={modalConfigure.title}
        visible={show}
        onCancel={handleClose}
        width={750}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            Fechar
          </Button>,
        ]}
      >
        <Row gutter={5}>
          <Col span={12} hidden={modalConfigure.hidden}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Almoxarifado:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={warehouse_id}
                onChange={async (e) => AlterWarehouse(e)}

                // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
              >
                {warehouse.map((option) => {
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
          <Col span={12} hidden={modalConfigure.hidden}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Posição:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={street_name}
                onChange={(e) => {
                  setStreetId(e[0]);
                  setStreetName(e[1]);
                }}

                // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
              >
                {street.map((option) => {
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
          <Col span={modalConfigure.span}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Digite o código (apenas numero):"
              labelAlign={'left'}
            >
              <Input
                name="amount"
                placeholder="Digite o código"
                type={'text'}
                // value={product.amount}
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Item>
          </Col>

          {modalConfigure.url == 'output' && (
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Drop:"
                labelAlign={'left'}
              >
                <Select
                  showSearch
                  placeholder="Selecione"
                  size="large"
                  value={drop}
                  onChange={(e) => setDrop(e)}

                  // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
                >
                  {drops.map((option) => {
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
          )}
        </Row>
        {code != '' && (
          <button className="lancar" onClick={ButtonClick}>
            <CheckOutlined />
          </button>
        )}

        <Divider />
        {show == true && <BarcodeReader onScan={EditBarCode} />}
        <h1>{amount}</h1>
        <SearchTable />
      </Modal>
    </>
  );
}
