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
  DatePicker,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { CSVLink, CSVDownload } from 'react-csv';
import { Tooltip } from '@material-ui/core/';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../../services/api';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
// import './style.css'

const Option = Select.Option;

export default function Employee() {
  class SearchTable extends React.Component {
    state = {
      pagination: pagination,
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
                  onClick={() => {
                    handleEdit(record);
                    setPagination(this.state.pagination);
                  }}
                />
                {/* onClick={() => handleEdit(record)} */}
                <Popconfirm
                  onConfirm={() => handleDeleteFunction(record.id)}
                  title="Confirmar remo????o?"
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

      return (
        <Table columns={columns}
          dataSource={employees}
          onChange={this.handleTableChange}
          pagination={this.state.pagination} />
      );
    }
  }

  const [employees, setEmployees] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [cpf, setCPF] = useState('');
  const [PIS, setPIS] = useState('');

  const [CTPS, setCTPS] = useState('');
  const [salary, setSalary] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [UF, setUF] = useState('');
  const [CEP, setCEP] = useState('');
  const [number, setNumber] = useState('');
  const [resignation, setResignation] = useState('');
  const [reasonResignation, setReasonResignation] = useState('');
  const [phone, setPhone] = useState('');

  const [sector, setSector] = useState('');
  const [sectorName, setSectorName] = useState('');
  const [sectors, setSectors] = useState([]);
  const [area, setArea] = useState('');
  const [areaName, setAreaName] = useState('');

  const [areas, setAreas] = useState([]);
  const [factoryFunctionId, setFactoryFunctionId] = useState('');
  const [factoryFunctionName, setFactoryFunctionName] = useState('');
  const [factoryFunctions, setFactoryFunctions] = useState([]);

  const [company, setCompany] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companys, setCompanys] = useState([]);

  const [shifts, setShifts] = useState([]);
  const [shiftId, setShiftId] = useState(0);
  const [shiftName, setShiftName] = useState('');

  const [admission, setAdmission] = useState(moment());

  const [secullumId, setSecullumId] = useState('');
  const [situation, setSituation] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const data = {
    admission,
    company,
    area,
    sector,
    factoryFunctionId,
    name,
    cpf,
    id,
    PIS,
    CTPS,
    salary,
    address,
    neighborhood,
    city,
    UF,
    CEP,
    number,
    resignation,
    reasonResignation,
    phone,
    shiftId,
    secullumId,
    situation,
  };
  useEffect(() => {
    api.get('employee', {}).then((response) => {
      setEmployees(response.data);
    });
  }, [refreshKey]);
  useEffect(() => {
    api.get('company', {}).then((response) => {
      setCompanys(response.data);
    });
  }, []);
  useEffect(() => {
    api.get('function', {}).then((response) => {
      setFactoryFunctions(response.data);
    });
  }, []);
  useEffect(() => {
    api.get('sector', {}).then((response) => {
      setSectors(response.data);
    });
  }, []);
  useEffect(() => {
    api.get('department', {}).then((response) => {
      setAreas(response.data);
    });
  }, []);
  useEffect(() => {
    api.get('shift', {}).then((response) => {
      setShifts(response.data);
    });
  }, []);

  async function handleEdit(e) {
    setId(e.id);
    setName(e.name);
    const response = await api.get(`employee/${e.id}`);
    setCPF(response.data.cpf);
    setPIS(response.data.PIS);
    setCTPS(response.data.CTPS);
    setSalary(response.data.salary);
    setAddress(response.data.address);
    setNeighborhood(response.data.neighborhood);
    setCity(response.data.city);
    setUF(response.data.UF);
    setCEP(response.data.CEP);
    setNumber(response.data.number);
    setResignation(response.data.resignation);
    setReasonResignation(response.data.reason_resignation);
    setPhone(response.data.phone);
    setAdmission(response.data.admission);
    setSector(response.data.factory_sector_id);
    setSectorName(response.data.sectorName);
    setArea(response.data.factory_area_id);
    setAreaName(response.data.areaName);
    setFactoryFunctionId(response.data.factory_function_id);
    setFactoryFunctionName(response.data.factoryFunctionName);
    setCompany(response.data.company_id);
    setCompanyName(response.data.companyName);
    setShiftId(response.data.shiftId);
    setShiftName(response.data.shiftName);
    setSecullumId(response.data.secullum_id);
    setSituation(response.data.situation);
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

    try {
      if (id === 0) {
        try {
          const response = await api.post('employee', data);
          handleClose();
          setCPF('');
          setPIS('');
          setCTPS('');
          setSalary('');
          setAddress('');
          setNeighborhood('');
          setCity('');
          setUF('');
          setCEP('');
          setNumber('');
          setResignation('');
          setReasonResignation('');
          setPhone('');
          setAdmission(moment());
          setShiftId(0);
          setShiftName('');
          setSecullumId('');
          setSituation('');

          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Criado com sucesso',
            'O funcion??rio foi adicionado com sucesso'
          );
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao adicionar',
            'O funcion??rio n??o foi adicionado'
          );
        }
      } else {
        try {
          const response = await api.put('employee', data);

          handleClose();
          setRefreshKey((refreshKey) => refreshKey + 1);
          openNotificationWithIcon(
            'success',
            'Alterado com sucesso',
            'O funcion??rio foi alterado com sucesso'
          );
          setId(0);
          setName('');
          setCPF('');
          setPIS('');
          setCTPS('');
          setSalary('');
          setAddress('');
          setNeighborhood('');
          setCity('');
          setUF('');
          setCEP('');
          setNumber('');
          setResignation('');
          setReasonResignation('');
          setPhone('');
          setAdmission(moment());
          setShiftId(0);
          setShiftName('');
          setSecullumId('');
          setSituation('');
        } catch (error) {
          openNotificationWithIcon(
            'error',
            'Erro ao editar',
            'O funcion??rio n??o foi editado'
          );
        }
      }
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao editar',
        'O funcion??rio n??o foi editado'
      );
    }
  }

  async function handleDeleteFunction(id) {
    try {
      const response = await api.delete(`employee/${id}`);
      setRefreshKey((refreshKey) => refreshKey + 1);
      openNotificationWithIcon(
        'success',
        'Deletado com sucesso',
        'O funcion??rio foi deletado com sucesso'
      );
    } catch (error) {
      openNotificationWithIcon(
        'error',
        'Erro ao deletar',
        'O funcion??rio n??o foi deletado'
      );
    }
  }

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setId(0);
    setName('');
    setCPF('');
    setPIS('');
    setCTPS('');
    setSalary('');
    setAddress('');
    setNeighborhood('');
    setCity('');
    setUF('');
    setCEP('');
    setNumber('');
    setResignation('');
    setReasonResignation('');
    setPhone('');
    setCompanyName('');
    setSectorName('');
    setFactoryFunctionName('');
    setAreaName('');
    setAdmission(moment());
    setShiftId(0);
    setShiftName('');
    setSecullumId('');
    setSituation('');

    setShow(false);
  };

  async function handleShow() {
    setShow(true);
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
      <Row style={{ marginBottom: 16 }} gutter={5} justify="end">
        <Col>
          <Button className="buttonGreen">
            <DownloadOutlined style={{ marginRight: 8 }} />
            <CSVLink data={employees} style={{ color: '#fff' }} separator={';'}>
              Download
            </CSVLink>
          </Button>
        </Col>
        <Col>
          <Tooltip title="Cadastrar funcion??rio" placement="right">
            <Button
              className="buttonGreen"
              icon={<PlusOutlined />}
              style={{ marginRight: 5, fontSize: '14px' }}
              onClick={handleShow}
            >
              Novo funcion??rio
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Modal
        title="Cadastro de funcion??rio"
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
        <>
          <Row gutter={5}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Nome do funcion??rio:"
                labelAlign={'left'}
                style={{ backgroundColor: 'white' }}
              >
                <Input
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                {name == '' && <span style={{ color: 'red' }}>{error}</span>}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="CPF:"
                labelAlign={'left'}
              >
                <Input
                  name="cpf"
                  onChange={(e) => setCPF(e.target.value)}
                  value={cpf}
                />
                {name == '' && <span style={{ color: 'red' }}>{error}</span>}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={5}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Data de admiss??o:"
                labelAlign={'left'}
              >
                {moment(admission, 'DD/MM/YYYY').isValid() &&
                  <DatePicker
                    style={{ height: 40, paddingTop: 8, width: '100%' }}
                    format="DD/MM/YYYY"
                    value={moment(admission, 'DD/MM/YYYY')}
                    onChange={(date) => {
                      if (date == '' || date == null) {
                        setAdmission('');
                      } else {
                        setAdmission(date._d);
                      }
                    }}

                  />}
                {!moment(admission, 'DD/MM/YYYY').isValid() && (
                  <DatePicker
                    style={{ height: 40, paddingTop: 8, width: '100%' }}
                    format="DD/MM/YYYY"
                    onChange={(date) => {
                      if (date == '' || date == null) {
                        setAdmission('');
                      } else {
                        setAdmission(date._d);
                      }
                    }}
                  />
                )}




              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Setor"
                labelAlign={'left'}
              >
                <Select
                  showSearch
                  placeholder="Selecione"
                  size="large"
                  value={sectorName}
                  onChange={(e) => {
                    setSector(e[0]);
                    setSectorName(e[1]);
                  }}
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
                label="Departamento"
                labelAlign={'left'}
              >
                <Select
                  showSearch
                  placeholder="Selecione"
                  size="large"
                  value={areaName}
                  onChange={(e) => {
                    setArea(e[0]);
                    setAreaName(e[1]);
                  }}
                >
                  {areas.map((option) => {
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
          </Row>
          <Row gutter={5}>
            <Col span={7}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Fun????o"
                labelAlign={'left'}
              >
                <Select
                  showSearch
                  placeholder="Selecione"
                  size="large"
                  value={factoryFunctionName}
                  onChange={(e) => {
                    setFactoryFunctionId(e[0]);
                    setFactoryFunctionName(e[1]);
                  }}
                >
                  {factoryFunctions.map((option) => {
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
            <Col span={13}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Empresa"
                labelAlign={'left'}
              >
                <Select
                  showSearch
                  placeholder="Selecione"
                  size="large"
                  value={companyName}
                  onChange={(e) => {
                    setCompany(e[0]);
                    setCompanyName(e[1]);
                  }}
                >
                  {companys.map((option) => {
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
            <Col span={4}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Turno"
                labelAlign={'left'}
              >
                <Select
                  showSearch
                  placeholder="Selecione"
                  size="large"
                  value={shiftName}
                  onChange={(e) => {
                    setShiftId(e[0]);
                    setShiftName(e[1]);
                  }}
                >
                  {shifts.map((option) => {
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
          </Row>
          <Row gutter={5}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="PIS:"
                labelAlign={'left'}
              >
                <Input
                  name="PIS"
                  onChange={(e) => setPIS(e.target.value)}
                  value={PIS}
                />
                {name == '' && <span style={{ color: 'red' }}>{error}</span>}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="CTPS:"
                labelAlign={'left'}
              >
                <Input
                  name="CTPS"
                  onChange={(e) => setCTPS(e.target.value)}
                  value={CTPS}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Salario:"
                labelAlign={'left'}
              >
                <Input
                  name="salary"
                  onChange={(e) => setSalary(e.target.value)}
                  value={salary}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row gutter={5}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Endere??o:"
                labelAlign={'left'}
              >
                <Input
                  name="address"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                />
                {name == '' && <span style={{ color: 'red' }}>{error}</span>}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Bairro:"
                labelAlign={'left'}
              >
                <Input
                  name="neighborhood"
                  onChange={(e) => setNeighborhood(e.target.value)}
                  value={neighborhood}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Numero da casa:"
                labelAlign={'left'}
              >
                <Input
                  name="number"
                  onChange={(e) => setNumber(e.target.value)}
                  value={number}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={5}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Cidade:"
                labelAlign={'left'}
              >
                <Input
                  name="cit"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                />
              </Form.Item>


              <Form.Item
                labelCol={{ span: 23 }}
                label="ID Secullum"
                labelAlign={'left'}
              >
                <Input
                  name="secullum"
                  onChange={(e) => setSecullumId(e.target.value)}
                  value={secullumId}
                />
              </Form.Item>


            </Col>

            <Col span={2}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="UF:"
                labelAlign={'left'}
              >
                <Input
                  name="uf"
                  maxLength={2}
                  onChange={(e) => setUF(e.target.value)}
                  value={UF}
                />
              </Form.Item>

            </Col>

            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="CEP:"
                labelAlign={'left'}
              >
                <Input
                  name="cep"
                  onChange={(e) => setCEP(e.target.value)}
                  value={CEP}
                />
                {name == '' && <span style={{ color: 'red' }}>{error}</span>}
              </Form.Item>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Situa????o"
                labelAlign={'left'}
              >
                <TextArea
                  rows={3}
                  onChange={(e) => setSituation(e.target.value)}
                  value={situation}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Numero de telefone:"
                labelAlign={'left'}
              >
                <Input
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />
                {name == '' && <span style={{ color: 'red' }}>{error}</span>}
              </Form.Item>


            </Col>

          </Row>
          <Divider />
          <Row style={{ justifyContent: 'space-around' }}>
            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Data demiss??o:"
                labelAlign={'left'}
              >
                {moment(resignation, 'DD/MM/YYYY').isValid() && (
                  <DatePicker
                    style={{ height: 40, paddingTop: 8, width: '100%' }}
                    format="DD/MM/YYYY"
                    defaultValue={moment(resignation, 'DD/MM/YYYY')}
                    onChange={(date) => {
                      if (date == '' || date == null) {
                        setResignation('');
                      } else {
                        setResignation(date._d);
                      }
                    }}
                  />
                )}

                {!moment(resignation, 'DD/MM/YYYY').isValid() && (
                  <DatePicker
                    style={{ height: 40, paddingTop: 8, width: '100%' }}
                    format="DD/MM/YYYY"
                    onChange={(date) => {
                      if (date == '' || date == null) {
                        setResignation('');
                      } else {
                        setResignation(date._d);
                      }
                    }}
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                labelCol={{ span: 23 }}
                label="Motivo demiss??o:"
                labelAlign={'left'}
              >
                <TextArea
                  rows={3}
                  onChange={(e) => setReasonResignation(e.target.value)}
                  value={reasonResignation}
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      </Modal>

      <SearchTable />
    </Layout>
  );
}
