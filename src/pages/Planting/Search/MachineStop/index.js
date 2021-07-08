import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  DownloadOutlined,
  DeleteOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import api from '../../../../services/api';
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

const Option = Select.Option;
const { RangePicker } = DatePicker;

export default function MachineStop() {
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
      });
    };

    handleReset = (clearFilters) => {
      clearFilters();

      this.setState({ searchText: '' });
    };

    render() {
      const columns = [
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id',

          sorter: (a, b) => this.compareByAlph(a.machineName, b.machineName),
          ...this.getColumnSearchProps('machineName'),
        },
        {
          title: 'Maquina',
          dataIndex: 'machineName',
          key: 'machineName',

          sorter: (a, b) => this.compareByAlph(a.machineName, b.machineName),
          ...this.getColumnSearchProps('machineName'),
        },
        {
          title: 'Início da Parada',
          dataIndex: 'start',
          key: 'start',

          sorter: (a, b) => this.compareByAlph(a.machineName, b.machineName),
          ...this.getColumnSearchProps('initiated'),
        },
        {
          title: 'Fim da Parada',
          dataIndex: 'finish',
          key: 'finish',

          sorter: (a, b) => this.compareByAlph(a.machineName, b.machineName),
          ...this.getColumnSearchProps('initiated'),
        },
        {
          title: 'Tempo de Parada',
          dataIndex: 'stopedTime',
          key: 'stopedTime',

          sorter: (a, b) => this.compareByAlph(a.machineName, b.machineName),
          ...this.getColumnSearchProps('stopedTime'),
        },
        {
          title: 'Criação',
          dataIndex: 'createdAt',
          key: 'createdAt',

          sorter: (a, b) => this.compareByAlph(a.machineName, b.machineName),
          ...this.getColumnSearchProps('createdAt'),
        },
      ];

      return (
        <Table
          align="right"
          columns={columns}
          dataSource={stopedMachines}
          rowKey="filter"
        />
      );
    }
  }

  const [stopedMachines, setStopedMachines] = useState([{}]);
  const [intervalTime, setIntervalTime] = useState([]);

  const handleDownload = async (e) => {
    const response = await api.post('machine-stop/report', {
      intervalTime,
    });

    setStopedMachines(response.data);
  };

  const [data, setData] = useState([{}]);
  const [ready, setReady] = useState(false);
  const [load, setLoad] = useState(false);
  const [headers, setHeaders] = useState([
    { label: 'ID da Maquina', key: 'machineID' },
    { label: 'Nome da Maquina', key: 'machineName' },
    { label: 'Início da Parada', key: 'start' },
    { label: 'Fim da Parada ', key: 'finish' },
    { label: 'Tempo Parado', key: 'stopedTime' },
    { label: 'Motivo', key: 'reasonStopMachine' },
    { label: 'Descrição do Motivo', key: 'reasonStop' },
    { label: 'Descrição da Parada', key: 'description' },
    { label: 'Criação', key: 'createdAt' },
  ]);

  const csvReport = {
    data: stopedMachines,
    headers: headers,
    filename: 'relatorioDeParadaDeMaquina.csv',
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
      <Row style={{ marginBottom: 16 }} gutter={5}>
        <Col span={12}>
          <RangePicker
            size="small"
            placeholder={['data inicial', 'data final']}
            onChange={setIntervalTime}
          />
          <SearchOutlined
            style={{
              fontSize: 18,
              color: '#3b4357',
              marginLeft: 8,
            }}
            onClick={(e) => {
              e.preventDefault();
              handleDownload();
            }}
          />
        </Col>
        <Col span={12} align="end">
          <Button className="buttonGreen" loading={load}>
            {ready == false && (
              <div
                onClick={() => {
                  setReady(true);
                }}
              >
                <FileExcelOutlined style={{ marginRight: 8 }} />
                Relatório de Parada
              </div>
            )}

            {ready == true && (
              <>
                <DownloadOutlined />
                <CSVLink
                  {...csvReport}
                  separator={';'}
                  style={{ color: '#fff', marginLeft: 8 }}
                  onClick={() => {
                    setReady(false);
                  }}
                >
                  Baixar
                </CSVLink>
              </>
            )}
          </Button>
        </Col>
      </Row>

      <SearchTable />
    </Layout>
  );
}
