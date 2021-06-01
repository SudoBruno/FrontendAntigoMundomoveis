import React, { useState, useEffect } from 'react';
import { CSVLink, CSVDownload } from 'react-csv';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  FileExcelOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import api from '../../../services/api';
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
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default function ExpeditionInput() {
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
          title: 'Cod. Forn',
          dataIndex: 'code',
          key: 'code',
          ...this.getColumnSearchProps('code'),
        },
        {
          title: 'Produto',
          dataIndex: 'productName',
          key: 'productName',

          ...this.getColumnSearchProps('productName'),
        },
        {
          title: 'Rua',
          dataIndex: 'streetName',
          key: 'streetName',
          ...this.getColumnSearchProps('streetName'),
        },
        {
          title: 'Armazém',
          dataIndex: 'warehouseName',
          key: 'warehouseName',
          ...this.getColumnSearchProps('warehouseName'),
        },

        {
          title: 'Data Armazenado',
          dataIndex: 'input',
          key: 'input',
          ...this.getColumnSearchProps('input'),
        },
        {
          title: 'Cod. Barras',
          dataIndex: 'barCode',
          key: 'barCode',

          ...this.getColumnSearchProps('barCode'),
        },
      ];

      return <Table columns={columns} dataSource={input} />;
    }
  }

  const [refreshKey, setRefreshKey] = useState(0);
  const [input, setInput] = useState([]);
  const [status, setStatus] = useState(false);
  const [load, setLoad] = useState(false);

  const [headers, setHeaders] = useState([
    { label: 'Codigo fornecedor', key: 'code' },
    { label: 'Produto', key: 'productName' },
    { label: 'Rua', key: 'streetName' },
    { label: 'Armazém', key: 'warehouseName' },
    { label: 'Data armazenado', key: 'input' },
    { label: 'Cod. Barras', key: 'barCode' },
    { label: 'Volume', key: 'volume' },
    { label: 'Quantidade de volumes', key: 'volumeQuantity' },
    //{ label: 'MO/Vol', key: 'laborCost' },
    { label: 'SKU', key: 'SKU' },
    { label: 'Cod. cliente', key: 'clientId' },
  ]);
  // const [ready, setReady] = useState(false);
  const [intervalTime, setIntervalTime] = useState([]);
  useEffect(() => {
    api.get('expedition/input', {}).then((response) => {
      setInput(response.data);
    });
  }, [refreshKey]);

  async function Filter(e) {
    e.preventDefault();
    setLoad(true);
    const data = {
      intervalTime: intervalTime,
    };
    const response = await api.post('expedition/input/filter', data);

    setInput(response.data);
    setLoad(false);
  }

  const csvReport = {
    data: input,
    headers: headers,
    filename: `relatorio_entrada_no_estoque${format(
      new Date(),
      'dd-MM-yyyy'
    )}.csv`,
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
            onClick={(e) => Filter(e)}
          />
        </Col>
        <Col span={12} align="end">
          <Button className="buttonGreen">
            {status == false && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setStatus(true);
                }}
              >
                <DownloadOutlined style={{ marginRight: 8 }} />
                Relatório de entrada no estoque
              </div>
            )}
            {status == true && (
              <CSVLink
                {...csvReport}
                separator={';'}
                onClick={() => {
                  setStatus(false);
                }}
              >
                Download
              </CSVLink>
            )}
          </Button>
        </Col>
      </Row>

      <SearchTable />
    </Layout>
  );
}
