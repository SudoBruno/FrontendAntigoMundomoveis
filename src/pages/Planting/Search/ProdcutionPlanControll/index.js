import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  DownloadOutlined,
  DeleteOutlined,
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

export default function ProductionMount() {
  class SearchTable extends React.Component {
    state = {
      loading: false,
      searchText: '',
      searchedColumn: '',
      pagination: pagination,
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
          title: 'ID PCP',
          dataIndex: 'PCPId',
          key: 'PCPId',

          sorter: (a, b) => this.compareByAlph(a.PCPId, b.PCPId),
          ...this.getColumnSearchProps('PCPId'),
        },
        {
          title: 'Nome PCP',
          dataIndex: 'PCPName',
          key: 'PCPName',

          sorter: (a, b) => this.compareByAlph(a.PCPName, b.PCPName),
          ...this.getColumnSearchProps('PCPName'),
        },
        {
          title: 'Data criação do pcp',
          dataIndex: 'PCPCreated',
          key: 'PCPCreated',

          sorter: (a, b) => this.compareByAlph(a.PCPCreated, b.PCPCreated),
          ...this.getColumnSearchProps('PCPCreated'),
        },

        {
          title: 'Operação',
          dataIndex: 'operacao',
          align: 'center',

          render: (text, record) => {
            return (
              <React.Fragment>
                <>
                  {status == false && (
                    <DownloadOutlined
                      onClick={() => {
                        handleDownload(record);
                        setStatus(true);
                        setPagination(this.state.pagination);
                      }}
                    />
                  )}

                  {status == true && (
                    <CSVLink
                      {...csvReport}
                      style={{ color: '#000' }}
                      separator={';'}
                      onClick={() => {
                        setStatus(false);
                        setData([{}]);
                      }}
                    >
                      Download
                    </CSVLink>
                  )}
                </>
              </React.Fragment>
            );
          },
        },
      ];

      return (
        <Table
          columns={columns}
          dataSource={mountDayProduction}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          rowKey="filter"
        />
      );
    }
  }
  const [status, setStatus] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const [mountDayProduction, setMountDayProduction] = useState([{}]);

  useEffect(() => {
    api.get('plating/mount/search/production/pcp', {}).then((response) => {
      setMountDayProduction(response.data);
    });
  }, []);

  const handleDownload = async (e) => {
    const response = await api.get(
      `plating/mount/search/production/pcp/${e.PCPId}`
    );

    setData(response.data);
    setStatus(true);
  };

  const [data, setData] = useState([{}]);
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
    data: data,
    headers: headers,
    filename: 'relatorioProduzidoPorPCPChaparia.csv',
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
      <Divider />

      <SearchTable />
    </Layout>
  );
}
