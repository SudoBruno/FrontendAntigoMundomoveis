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
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Option = Select.Option;
const { RangePicker } = DatePicker;

export default function PlantingDayProductionMount() {
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
          title: 'PCP',
          dataIndex: 'pcpName',
          key: 'pcpName',

          sorter: (a, b) => this.compareByAlph(a.pcpName, b.pcpName),
          ...this.getColumnSearchProps('pcpName'),
        },
        {
          title: 'Nome do produto',
          dataIndex: 'productName',
          key: 'productName',

          sorter: (a, b) => this.compareByAlph(a.productName, b.productName),
          ...this.getColumnSearchProps('productName'),
        },
        {
          title: 'Nome do SubProduto',
          dataIndex: 'subProductName',
          key: 'subProductName',

          sorter: (a, b) =>
            this.compareByAlph(a.subProductName, b.subProductName),
          ...this.getColumnSearchProps('subProductName'),
        },
        {
          title: 'Setor',
          dataIndex: 'sectorName',
          key: 'sectorName',

          sorter: (a, b) => this.compareByAlph(a.sectorName, b.sectorName),
          ...this.getColumnSearchProps('sectorName'),
        },
        {
          title: 'Inicio',
          dataIndex: 'start',
          key: 'start',

          sorter: (a, b) => this.compareByAlph(a.start, b.start),
          ...this.getColumnSearchProps('start'),
        },
        {
          title: 'Quantidade iniciada',
          dataIndex: 'amountInput',
          key: 'amountInput',

          sorter: (a, b) => this.compareByAlph(a.amountInput, b.amountInput),
          ...this.getColumnSearchProps('amountInput'),
        },
        {
          title: 'Fim',
          dataIndex: 'finish',
          key: 'finish',

          sorter: (a, b) => this.compareByAlph(a.finish, b.finish),
          ...this.getColumnSearchProps('finish'),
        },
        {
          title: 'Quantidade finalizada',
          dataIndex: 'amountOutput',
          key: 'amountOutput',

          sorter: (a, b) => this.compareByAlph(a.amountOutput, b.amountOutput),
          ...this.getColumnSearchProps('amountOutput'),
        },
      ];

      return (
        <Table
          columns={columns}
          dataSource={mountDayProduction}
          rowKey="filter"
        />
      );
    }
  }

  const [mountDayProduction, setMountDayProduction] = useState([{}]);
  const [intervalTime, setIntervalTime] = useState([]);

  useEffect(() => {
    api.get('plating/mount/search/day/production', {}).then((response) => {
      setMountDayProduction(response.data);
    });
  }, []);

  const handleDownload = async (e) => {
    const response = await api.post('plating/mount/search/production/day', {
      intervalTime,
    });

    setMountDayProduction(response.data);
  };

  const [data, setData] = useState([{}]);
  const [ready, setReady] = useState(false);
  const [load, setLoad] = useState(false);
  const [headers, setHeaders] = useState([
    { label: 'Código de barras', key: 'barCode' },
    { label: 'PCP', key: 'pcpName' },
    { label: 'Produto', key: 'productName' },
    { label: 'SubProduto', key: 'subProductName' },
    { label: 'Setor', key: 'sectorName' },
    { label: 'Hora Iniciado', key: 'start' },
    { label: 'Quantidade Iniciado', key: 'amountInput' },
    { label: 'Hora Finalizado', key: 'finish' },
    { label: 'Quantidade Finalizado', key: 'amountOutput' },
  ]);

  const csvReport = {
    data: mountDayProduction,
    headers: headers,
    filename: 'relatorioProduzidoPorHoraChaparia.csv',
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
                Relatório de produção
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
