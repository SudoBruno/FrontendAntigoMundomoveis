import React, { useState, useEffect } from 'react';
import {
  BarcodeOutlined,
  UndoOutlined,
  ToolOutlined,
  SearchOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import GaugeChart from '../../components/index';
import BarcodeReader from 'react-barcode-reader';

import logo from '../../assets/logo.png';
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

import api from '../../services/api';
import Highlighter from 'react-highlight-words';

const Option = Select.Option;
const chartStyle = {
  height: 250,
  width: 400,
  margin: 0,
};
export default function LaunchProduction() {
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
          title: 'Código',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: 'PCP',
          dataIndex: 'pcp',
        },
        {
          title: 'Produto',
          dataIndex: 'product',
        },
        {
          title: 'Cor',
          dataIndex: 'color',
        },
      ];

      return (
        <Table columns={columns} dataSource={launched} pagination={false} />
      );
    }
  }

  const [defects, setDefects] = useState([]);
  const [defectName, setDefectName] = useState('');
  const [defectId, setDefectId] = useState(0);
  const [defectDescription, setDefectDescription] = useState('')

  const [modalConfigure, setModalConfigure] = useState({
    title: '',
    url: '',
    hiddenSelectEmployee: true,
    span: 12,
    hiddenSelectDefect: true
  });
  const [barCodes, setBarCodes] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setEmployeeId('');
    setEmployeeName('');
    setLaunched([]);
    setAmount(0);
  };
  const handleShow = () => {
    let modal = {
      title: 'Lançamento de Produção',
      url: '',
      hiddenSelectEmployee: false,
      span: 12,
      hiddenSelectDefect: true
    };
    setModalConfigure(modal);
    setShow(true);
  };

  const handleGrouped = () => {
    let modal = {
      title: 'Lançamento Agrupado',
      url: '',
      hiddenSelectEmployee: false,
      span: 12,
      hiddenSelectDefect: true
    };
    setModalConfigure(modal);
    setShow(true);
  };
  const handleDefect = () => {
    let modal = { title: 'Defeito', url: 'defect', hiddenSelectEmployee: true, span: 12, hiddenSelectDefect: false };
    setModalConfigure(modal);
    setShow(true);
  };
  const handleReversal = () => {
    let modal = { title: 'Estorno', url: 'reversal', hiddenSelectEmployee: true, span: 24, hiddenSelectDefect: true };
    setModalConfigure(modal);
    setShow(true);
  };

  const [employee, setEmployee] = useState([]);
  const [employee_id, setEmployeeId] = useState('');
  const [employee_name, setEmployeeName] = useState('');
  const [code, setCode] = useState('');
  const [launched, setLaunched] = useState([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    api.get('employee', {}).then((response) => {
      setEmployee(response.data);
    });
    api.get('defect', {}).then((response) => {
      setDefects(response.data);
    });
  }, []);

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }
  function ButtonClick(e) {
    e.preventDefault();

    const data = {
      code,
      employee_id,
      bar_codes: barCodes,
      defectId,
      defectDescription
    };

    LaunchCode(data);
  }
  async function LaunchCode(data) {
    try {
      const response = await api.post(`bar-code/${modalConfigure.url}`, data);
      setAmount((amount) => amount + 1);

      if (modalConfigure.title == 'Lançamento Agrupado') {
        setEmployeeId('');
        setEmployeeName('');
      }
      openNotificationWithIcon(
        'success',
        'Lançado com sucesso',
        'Código lançado com sucesso'
      );
      setLaunched([...launched, response.data.launch]);
      const barCodesResponse =
        response.data.bar_codes === undefined ? [] : response.data.bar_codes;
      setBarCodes(barCodesResponse);

    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao lançar código',
        error.response.data.message
      );
    }
  }

  async function EditBarCode(e) {
    const data = {
      code: e,
      employee_id,
      bar_codes: barCodes,
      defectId,
      defectDescription
    };

    if (modalConfigure.url === '') {
      if (employee_id !== '') {
        LaunchCode(data);
      } else {
        const response = await api.get(`launch/production/employee/${e}`);
        setEmployeeName(response.data.name);
        setEmployeeId(response.data.id);
      }
    } else {
      LaunchCode(data);
    }
  }
  const [production, setProduction] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    api.get('production', {}).then((response) => {
      setProduction(response.data);
    });
  }, [userId]);

  return (
    <>
      <div className="container">
        <img src={logo} alt="logo" />
        <br />

        <button type="submit" className="lancamento" onClick={handleShow}>
          <BarcodeOutlined />
        </button>
        <button
          type="submit"
          className="lancamento-agrupado"
          onClick={handleGrouped}
        >
          <BarcodeOutlined />
        </button>
        <button type="submit" className="defeito" onClick={handleDefect}>
          <ToolOutlined />
        </button>
        <button type="submit" className="estorno" onClick={handleReversal}>
          <UndoOutlined />
        </button>
        <div className="profile-container">
          <ul>
            {production.map((productionLine) => (
              <li key={productionLine.id}>
                <GaugeChart
                  style={chartStyle}
                  id={'gauge-chart' + productionLine.id}
                  nrOfLevels={0}
                  arcsLength={[0.3, 0.5, 0.2]}
                  colors={['#EA4228', '#F5CD19', '#5BE12C']}
                  percent={productionLine.percent}
                  hideText
                  arcWidth={0.1}
                  marginInPercent={0.15}
                  arcPadding={0.0}
                />
                <p className="LineName">
                  {productionLine.linha}: {productionLine.total}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
          <Col span={12} hidden={modalConfigure.hiddenSelectEmployee}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Funcionário:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={employee_name}
                onChange={(e) => {
                  setEmployeeId(e[0]);
                  setEmployeeName(e[1]);
                }}

              // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
              >
                {employee.map((option) => {
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
          <Col span={12} hidden={modalConfigure.hiddenSelectDefect}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="defeito:"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={defectName}
                onChange={(e) => {

                  setDefectId(e[0]);
                  setDefectName(e[1]);
                }}

              // getPopupContainer={() => document.getElementById("colCadastroLinhasDeProducao")}
              >
                {defects.map((option) => {
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
          <Col span={modalConfigure.span} hidden={modalConfigure.hiddenSelectDefect}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Descreva o defeito (Opcional):"
              labelAlign={'left'}
            >
              <Input
                name="defectDescription"
                placeholder="Descreva o defeito (Opcional)"
                type={'text'}
                // value={product.amount}
                onChange={(e) => setDefectDescription(e.target.value)}
              />
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
        </Row>
        {code != '' && (
          <button className="lancar" onClick={ButtonClick}>
            <CheckOutlined />
          </button>
        )}

        <Divider />
        {show && <BarcodeReader onScan={EditBarCode} onError={EditBarCode} />}
        <h1>{amount}</h1>
        <SearchTable />
      </Modal>
    </>
  );
}
