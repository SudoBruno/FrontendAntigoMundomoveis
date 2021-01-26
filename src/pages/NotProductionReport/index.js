import React, { useState, useEffect } from 'react';
import { CSVDownload, CSVLink } from 'react-csv';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  FileExcelOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import api from '../../services/api';
import { Layout, Table, Button, Row, Input, Space, Select, Col } from 'antd';

const Option = Select.Option;

export default function ExpeditionDrop() {
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

          ...this.getColumnSearchProps('name'),
        },
        // {
        //   title: 'Dia do Drop',
        //   dataIndex: 'initial_date',
        //   key: 'initial_date',
        //   ...this.getColumnSearchProps('initial_date'),
        // },
        {
          title: 'Operação',
          colSpan: 2,
          dataIndex: 'operacao',
          align: 'center',

          render: (text, record) => {
            return (
              <React.Fragment>
                {status == false && (
                  <DownloadOutlined
                    onClick={() => {
                      handleDownload(record);
                      setStatus(true);
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
                    }}
                  >
                    Download
                  </CSVLink>
                )}
              </React.Fragment>
            );
          },
        },
      ];

      return <Table columns={columns} dataSource={productionPlanControl} />;
    }
  }
  const [status, setStatus] = useState(false);
  const [productionPlanControl, setProductionPlanControl] = useState([{}]);
  const [data, setData] = useState([{}]);
  const [headers, setHeaders] = useState([
    { label: 'Linha de produção', key: 'line' },
    { label: 'Produto', key: 'product' },
    { label: 'color', key: 'color' },
    { label: 'Cod de barras', key: 'barCode' },
    { label: 'Cod. Interno', key: 'code' },
    { label: 'Setor', key: 'factorySector' },
    { label: 'PCP', key: 'pcpName' },
  ]);
  useEffect(() => {
    api.get('product-plan-control', {}).then((response) => {
      setProductionPlanControl(response.data);
    });
  }, []);

  const handleDownload = async (e) => {
    const response = await api.get(
      `/not/production/product-plan-control/${e.id}`
    );

    setData(response.data);
  };

  const csvReport = {
    data: data,
    headers: headers,
    filename: 'relatorioDeNaoProduzidos.csv',
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
      <SearchTable />
    </Layout>
  );
}
