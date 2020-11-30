import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  FileExcelOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import api from '../../../services/api';
import { Layout, Table, Button, Row, Input, Space, Select, Col } from 'antd';

const Option = Select.Option;

export default function CoverStock() {
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
          dataIndex: 'stockId',
          key: 'stockId',
          ...this.getColumnSearchProps('stockId'),
        },
        {
          title: 'Capa',
          dataIndex: 'name',
          key: 'name',

          ...this.getColumnSearchProps('name'),
        },
        {
          title: 'Quantidade',
          dataIndex: 'quantity',
          key: 'quantity',
          ...this.getColumnSearchProps('quantity'),
        },

        {
          title: 'SubProduto',
          dataIndex: 'subProductId',
          key: 'subProductId',
          ...this.getColumnSearchProps('subProductId'),
        },
      ];

      return <Table columns={columns} dataSource={stock} />;
    }
  }

  const [refreshKey, setRefreshKey] = useState(0);
  const [stock, setStock] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    api.get('cover/stock', {}).then((response) => {
      setStock(response.data);
    });
  }, []);
  async function Stock() {
    setReady(false);
    const response = await api.get('cover/stock');
    setCsvData(response.data);
    setTimeout(
      function () {
        setReady(true);
      }.bind(this),
      500
    );
    setHeaders([
      { key: 'Codigo fornecedor' },
      { key: 'Produto' },
      { key: 'Rua' },
      { key: 'Data armazenado' },
      { key: 'Código de barras' },
    ]);
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
        <Col span={24} align="end">
          {!ready && (
            <Button type="submit" className="buttonGreen" onClick={Stock}>
              <FileExcelOutlined style={{ marginRight: 8 }} />
              Estoque Atual
            </Button>
          )}
          {ready && (
            <Button className="buttonGreen">
              <DownloadOutlined style={{ marginRight: 8 }} />
              <CSVLink data={csvData} style={{ color: '#fff' }} separator={';'}>
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
