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
  Menu,
  Dropdown,
  Tooltip,
  Checkbox,
} from 'antd';

import Highlighter from 'react-highlight-words';
import { SearchOutlined, UploadOutlined, RetweetOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import './styles.css';

import api from '../../../services/api';

const Option = Select.Option;
export default function CallList() {
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
        <SearchOutlined style={{ callList: filtered ? '#1890ff' : undefined }} />
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

          sorter: (a, b) => this.compareByAlph(a.name, b.name),
          ...this.getColumnSearchProps('name'),
        },
        {
          title: 'Hora de entrada:',
          dataIndex: 'entryTime',
          key: 'entryTime',
          sorter: (a, b) => this.compareByAlph(a.entryTime, b.entryTime),
          ...this.getColumnSearchProps('entryTime'),
        },
        {
          title: 'Presente:',
          dataIndex: 'presence',
          key: 'presence',
          sorter: (a, b) => this.compareByAlph(a.presence, b.presence),
          ...this.getColumnSearchProps('presence'),
        },
      ];

      return <Table columns={columns} dataSource={callList} />;
    }
  }

  const [employee, setEmployee] = useState([]);
  const [area, setArea] = useState(0);
  const [areaName, setAreaName] = useState('');
  const [transferAreas, setTransferAreas] = useState([]);
  const [transferAreaName, setTransferAreaName] = useState([]);
  const [transferAreaId, setTransferAreaId] = useState('');

  const [areas, setAreas] = useState([]);
  const [callListId, setCallListId] = useState([]);
  const [employeeName, setEmployeeName] = useState([]);
  const [callList, setCallList] = useState([
    {
      name: '',
      area: '',
      entryTime: '',
      areaId: 0,
      employeeId: 0,
    },
  ]);

  useEffect(() => {
    api.get('call-list', {}).then((response) => {
      if (response.data.length > 0) {
        setCallList(response.data);
      }
    });
  }, []);

  useEffect(() => {
    api.get('department', {}).then((response) => {
      setAreas(response.data);
    });
  }, []);
  useEffect(() => {
    api.get('department', {}).then((response) => {
      setTransferAreas(response.data);
    });
  }, []);


  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  const [show, setShow] = useState(false);
  const [showReplacement, setShowReplacement] = useState(false);

  const isPresent = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(
        `call-list/presence/${callList[refreshKey].id}`
      );

      if (refreshKey >= callList.length - 1) {
        openNotificationWithIcon(
          'success',
          'Chamada Finalizada',
          'Chamada finalizada'
        );
        setRefreshKey(0);
        setShow(false);
      } else {
        setRefreshKey((refreshKey) => refreshKey + 1);
      }
    } catch (error) {
      openNotificationWithIcon('error', 'ERRO', 'Erro na chamada');
    }
  };

  const fault = async (e) => {
    try {
      const response = await api.put(
        `call-list/absence/${callList[refreshKey].id}`
      );

      if (refreshKey >= callList.length - 1) {
        openNotificationWithIcon(
          'success',
          'Chamada Finalizada',
          'Chamada finalizada'
        );
        setRefreshKey(0);
        setShow(false);
      } else {
        setRefreshKey((refreshKey) => refreshKey + 1);
      }
    } catch (error) {
      openNotificationWithIcon('error', 'ERRO', 'Erro na chamada');
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();

    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = async function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: 'binary' });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setEmployee(dataParse);
    };
    reader.readAsBinaryString(f);
  };

  const Send = async () => {
    try {
      openNotificationWithIcon(
        'success',
        'Sucesso',
        'Arquivo enviado com sucesso'
      );
      const response = await api.post('/call/employee/xlsx', employee);
    } catch (error) {
      openNotificationWithIcon('error', 'ERRO', 'Erro ao enviar');
    }
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  const handleClose = () => {
    setShow(false);
    setShowReplacement(false);
    setEmployeeName('');
  };

  const handleShow = () => setShow(true);
  const handleShowReplacement = () => setShowReplacement(true)

  const alterCallList = async (e) => {
    const response = await api.get(`/call-list/${e}`);

    if (response.data.length > 0) {
      setCallList(response.data);
    } else {
      openNotificationWithIcon('error', 'ERRO', 'Funcionários nao encontrados');
    }
  };

  async function startCallList(e) {
    e.preventDefault();

    setShow(true);
  }

  async function handleTranserEmployee(e) {
    e.preventDefault();

    const data = {
      callListId: callListId,
      area: area,
      transferAreaId: transferAreaId
    }

    if (!transferAreaId || !callListId) {
      openNotificationWithIcon('error', 'Erro na Transferência', 'Nenhum campo deve ser Vazio');
    }

    if (transferAreaId && employeeName) {
      try {
        const response = await api.put('/call/employee-transfer/', data);
        openNotificationWithIcon(
          'success',
          'Sucesso',
          'Transferência Concluida'
        );
        handleClose();
      } catch (error) {
        openNotificationWithIcon('error', 'Erro na Transferência', 'Nenhum campo deve ser Vazio');
        console.log(error);
      }
    }

    console.log(data);
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
      <div className="call-list-buttons">
        <label for="employeeList" className="input-file">
          Selecionar um arquivo &#187;
        </label>
        <input
          type="file"
          id="employeeList"
          onChange={(e) => handleUpload(e)}
        />

        <button className="btn-enviar" onClick={Send}>
          Enviar
        </button>
      </div>
      <Row>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 23 }}
            label="Selecione o Departamento"
            labelAlign={'left'}
            style={{ marginTop: 20 }}
            className="departament"
          >
            <Select
              showSearch
              placeholder="Selecione"
              size="large"
              value={areaName}
              onChange={(e) => {
                alterCallList(e[0]);
                setArea(e[0]);
                setAreaName(e[1]);
              }}
            >
              {areas.map((option) => {
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
        <Col> <Button
          type="primary"
          icon={<RetweetOutlined />}
          size={30}
          style={{ marginLeft: 10, marginBottom: 0 }}
          onClick={handleShowReplacement}
        >
          Troca de Colaborador
        </Button>
          <Col
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'left',
              marginTop: 0,
            }}>
            <button className="btn-iniciar-chamada" onClick={(e) => startCallList(e)}>
              Iniciar Chamada
          </button>
          </Col>

        </Col>
        <Col
          span={12}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            marginTop: 20,
          }}
        >


          <Modal
            visible={showReplacement}
            width={700}
            title={'Troca de Colaborador'}
            onCancel={handleClose}
            footer={[
              <Button key="back" type="default" onClick={handleClose}>
                {' '}
                Cancelar
              </Button>,
              <Button key="submit" type="primary" onClick={handleTranserEmployee}>
                {' '}
                Salvar
              </Button>,
            ]}
          >
            <Row gutter={5}>
              <Col span={13}>
                <Form.Item
                  labelCol={{ span: 23 }}
                  label="Funcionario"
                  labelAlign={'left'}
                >
                  <Select
                    showSearch
                    placeholder="Selecione"
                    size="large"
                    value={employeeName}
                    onChange={(e) => {
                      setCallListId(e[0]);
                      setEmployeeName(e[1]);
                    }}
                  >
                    {callList.map((option) => {
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

            <Row>
              <Col span={10}>
                <Form.Item
                  labelCol={{ span: 23 }}
                  label="Setor De Remanejamento"
                  labelAlign={'left'}
                >
                  <Select
                    showSearch
                    placeholder="Selecione"
                    size="large"
                    value={transferAreaName}
                    onChange={(e) => {
                      setTransferAreaId(e[0]);
                      setTransferAreaName(e[1])
                    }}
                  >
                    {transferAreas.map((option) => {
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

            <Row>
              <Col span={10}>
                <Form.Item
                  hidden
                  labelCol={{ span: 23 }}
                  label="Setor De Remanejamento"
                  labelAlign={'left'}
                >
                  <Select

                    showSearch
                    placeholder="Selecione"
                    size="large"
                    value={callList[refreshKey].area}
                  >
                    {areas.map((option) => {
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


          </Modal>

        </Col>
      </Row>
      <Modal visible={show} width={800} title={'Chamada'}>
        <Row gutter={5}>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Funcionario"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={callList[refreshKey].name}
                disabled
              >
                {callList.map((option) => {
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
          <Col span={10}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Setor"
              labelAlign={'left'}
            >
              <Select
                showSearch
                placeholder="Selecione"
                size="large"
                value={callList[refreshKey].area}
              >
                {areas.map((option) => {
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
          <Col span={6}>
            <Form.Item
              labelCol={{ span: 23 }}
              label="Horário de entrada:"
              labelAlign={'left'}
            >
              <Input
                name="entryTime"
                // onChange={(e) => setCPF(e.target.value)}
                value={callList[refreshKey].entryTime}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={5}>
          <Col span={12} className="callListButtons">
            <Button
              className="presenceButton"
              onClick={(e) => {
                isPresent(e);
              }}
            >
              Presente
            </Button>
          </Col>
          <Col span={12} className="callListButtons">
            <Button
              className="absenceButton"
              onClick={(e) => {
                fault();
              }}
            >
              Faltou
            </Button>
          </Col>
        </Row>

      </Modal>
      <SearchTable />
    </Layout>
  );
  // return (
  //   <>
  //     <div className="call-list-buttons">

  //       <label for='employeeList' className="input-file">Selecionar um arquivo &#187;</label>
  //       <input type="file" id='employeeList' onChange={(e) => handleUpload(e)} />

  //       <button className="btn-enviar" onClick={Send}>Enviar</button>

  //     </div>

  //   </>

  // );
}
