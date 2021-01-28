import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import api from '../../../../services/api';
import { Layout, Table, Button, Row, Input, Space, Select, Col } from 'antd';

const Option = Select.Option;

export default function CoverOutput() {
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
          dataIndex: 'outputId',
          key: 'outputId',
          ...this.getColumnSearchProps('outputId'),
        },
        {
          title: 'Capa',
          dataIndex: 'coverName',
          key: 'coverName',

          ...this.getColumnSearchProps('coverName'),
        },
        {
          title: 'Quantidade',
          dataIndex: 'quantity',
          key: 'quantity',
          ...this.getColumnSearchProps('quantity'),
        },

        {
          title: 'Almoxarifado',
          dataIndex: 'warehouseName',
          key: 'warehouseName',
          ...this.getColumnSearchProps('warehouseName'),
        },
        {
          title: 'Rua',
          dataIndex: 'streetName',
          key: 'streetName',
          ...this.getColumnSearchProps('streetName'),
        },
        {
          title: 'Funcionário',
          dataIndex: 'employeeName',
          key: 'employeeName',
          ...this.getColumnSearchProps('employeeName'),
        },
        {
          title: 'Removido',
          dataIndex: 'created',
          key: 'created',
          ...this.getColumnSearchProps('created'),
        },
      ];

      return <Table columns={columns} dataSource={outputs} />;
    }
  }

  const [outputs, setOutput] = useState([]);

  const [headers, setHeaders] = useState([
    { label: 'id', key: 'outputId' },
    { label: 'Capa', key: 'coverName' },
    { label: 'Quantidade', key: 'quantity' },
    { label: 'Almoxarifado', key: 'warehouseName' },
    { label: 'Rua', key: 'streetName' },
    { label: 'Funcionário', key: 'employeeName' },
    { label: 'Removido', key: 'created' },
  ]);

  useEffect(() => {
    api.get('cover/output', {}).then((response) => {
      setOutput(response.data);
    });
  }, []);
  const csvReport = {
    data: outputs,
    headers: headers,
    filename: 'ralatorio_saida_no_estoque_de_capas.csv',
  };
  const [status, setStatus] = useState(false);

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
          <Button className="buttonGreen">
            {status == false && (
              <>
                <DownloadOutlined
                  onClick={(e) => {
                    e.preventDefault();
                    setStatus(true);
                  }}
                  style={{ marginRight: 8 }}
                />
                Baixar
              </>
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
