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
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
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
  const [areas, setAreas] = useState([]);
  const [callList, setCallList] = useState([
    {
      name: '',
      area: '',
      entryTime: '',
      areaId: 0,
      employeeId: 0,
    },
  ]);

  // useEffect(() => {
  //   api.get('call-list', {}).then((response) => {
  //     if (response.data.length > 0) {

  //       setCallList(response.data);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    api.get('department', {}).then((response) => {
      setAreas(response.data);
    });
  }, []);

  function openNotificationWithIcon(type, message, description) {
    notification[type]({
      message: message,
      description: description,
    });
  }

  const [show, setShow] = useState(false);

  const isPresent = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(
        `call-list/presence/${callList[refreshKey].id}`
      );
      console.log(refreshKey, callList.length - 1);
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
      console.log(refreshKey, callList.length - 1);
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
  };

  const handleShow = () => setShow(true);

  const alterCallList = async () => {
    const response = await api.get(`/call-list/${area}`);
    console.log('response', response.data);
    if (response.data.length > 0) {
      setCallList(response.data);
    } else {
      openNotificationWithIcon('error', 'ERRO', 'Fucionarios nao encontrados');
    }
  };

  async function startCallList(e) {
    e.preventDefault();

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
            style={{ marginLeft: 90, marginTop: 20 }}
          >
            <Select
              showSearch
              placeholder="Selecione"
              size="large"
              value={areaName}
              onChange={(e) => {
                alterCallList();
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
        <Col
          span={12}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            marginTop: 20,
          }}
        >
          <button className="btn-enviar" onClick={(e) => startCallList(e)}>
            Iniciar Chamada
          </button>
        </Col>
      </Row>
      <Modal visible={show} width={800} title={'Chamada'}>
        {console.log('aa', callList)}
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
                // onChange={(e) => {
                //   console.log(e);
                //   setArea(e[0]);
                //   setAreaName(e[1]);
                // }}
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
              label="Horario de entrada:"
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
