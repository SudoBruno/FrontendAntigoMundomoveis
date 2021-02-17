import React, { useState, useEffect } from 'react';
import { CSVLink, CSVDownload } from 'react-csv';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  FileExcelOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import api from '../../services/api';
import {
  Layout,
  Table,
  Button,
  Row,
  Input,
  Space,
  Select,
  Col,
  DatePicker,
} from 'antd';
import { format } from 'date-fns';
const { RangePicker } = DatePicker;
const Option = Select.Option;

export default function ProductionReport() {
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
          title: 'Código Fornecedor',
          dataIndex: 'reference',
          key: 'reference',

          ...this.getColumnSearchProps('reference'),
        },
        {
          title: 'Código de barras',
          dataIndex: 'barCode',
          key: 'barCode',

          ...this.getColumnSearchProps('barCode'),
        },
        {
          title: 'Produto',
          dataIndex: 'productName',
          key: 'productName',

          ...this.getColumnSearchProps('productName'),
        },
        {
          title: 'Cor',
          dataIndex: 'colorName',
          key: 'colorName',

          sorter: (a, b) => this.compareByAlph(a.colorName, b.colorName),
          ...this.getColumnSearchProps('colorName'),
        },
        {
          title: 'Data Lançamento',
          dataIndex: 'release',
          key: 'release',
          ...this.getColumnSearchProps('release'),
        },
        {
          title: 'Linha',
          dataIndex: 'lineName',
          key: 'lineName',
          ...this.getColumnSearchProps('lineName'),
        },
        {
          title: 'Funcionário',
          dataIndex: 'employeeName',
          key: 'employeeName',
          ...this.getColumnSearchProps('employeeName'),
        },
      ];

      return <Table columns={columns} dataSource={production} />;
    }
  }

  const [refreshKey, setRefreshKey] = useState(0);
  const [production, setProduction] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([
    { label: 'Linha', key: 'lineName' },
    { label: 'Produto', key: 'productName' },
    { label: 'Cor', key: 'colorName' },
    { label: 'Lançamento', key: 'release' },
    { label: 'Nome do funcionário', key: 'employeeName' },
    { label: 'Cod. de barras', key: 'barCode' },
    { label: 'Cod. interno', key: 'reference' },
    { label: 'Nome do setor', key: 'factorySectorName' },
    { label: 'PCP', key: 'pcpName' },
    { label: 'Volume', key: 'volume' },
    { label: 'Pontos', key: 'points' },
  ]);
  const [ready, setReady] = useState(false);
  const [intervalTime, setIntervalTime] = useState([]);
  useEffect(() => {
    api.get('production/item', {}).then((response) => {
      setProduction(response.data);
    });
  }, [refreshKey]);

  async function Filter() {
    const data = {
      intervalTime: intervalTime,
    };
    const response = await api.post('production/item', data);

    setProduction(response.data);
  }
  async function Production() {
    setReady(false);
    const data = {
      intervalTime: intervalTime,
    };
    let response = [];
    console.log('1');
    if (intervalTime.length == 0) {
      response = await api.get('production/item');
      setReady(true);
      setCsvData(response.data);
    } else {
      response = await api.post('production/item', data);
      setReady(true);
      setCsvData(response.data);
      console.log('2');
    }
    console.log('3');
  }
  const csvReport = {
    data: csvData,
    headers: headers,
    filename: `relatorioDeProdução${format(new Date(), 'dd-MM-yyyy')}.csv`,
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
      <Row style={{ marginBottom: 16 }}>
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
            onClick={Filter}
          />
        </Col>
        <Col span={12} align="end">
          {!ready && (
            <Button type="submit" className="buttonGreen" onClick={Production}>
              <FileExcelOutlined style={{ marginRight: 8 }} />
              Relatório de produção
            </Button>
          )}
          {ready && (
            <Button className="buttonGreen">
              <DownloadOutlined style={{ marginRight: 8 }} />
              <CSVLink
                {...csvReport}
                style={{ color: '#fff' }}
                separator={';'}
                onClick={setReady(false)}
              >
                Download
              </CSVLink>
            </Button>
          )}
        </Col>
      </Row>

      <SearchTable />
    </Layout>
  );
}
