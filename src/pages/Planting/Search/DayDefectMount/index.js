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

export default function PlantingDayDefectMount() {
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
          title: 'Dia de produção',
          dataIndex: 'day',
          key: 'day',

          sorter: (a, b) => this.compareByAlph(a.day, b.day),
          ...this.getColumnSearchProps('day'),
        },

        {
          title: 'Operação',
          dataIndex: 'operacao',
          align: 'center',

          render: (text, record) => {
            return (
              <React.Fragment>
                <>
                  {status == false &&
                    data[0] != undefined &&
                    data[0].filter != record.filter && (
                      <DownloadOutlined
                        onClick={() => {
                          handleDownload(record.filter);
                          setStatus(true);
                          setPagination(this.state.pagination);
                        }}
                      />
                    )}
                  {status == true &&
                    data[0] != undefined &&
                    data[0].filter != record.filter && (
                      <DownloadOutlined
                        onClick={() => {
                          handleDownload(record.filter);
                          setStatus(true);
                          setPagination(this.state.pagination);
                        }}
                      />
                    )}

                  {status == true &&
                    data[0] != undefined &&
                    data[0].filter == record.filter && (
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
          dataSource={mountDayDefect}
          onChange={this.handleTableChange}
          pagination={this.state.pagination}
          rowKey="filter"
        />
      );
    }
  }
  const [status, setStatus] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const [mountDayDefect, setMountDayDefect] = useState([{}]);

  useEffect(() => {
    api.get('plating/mount/search/day/defect', {}).then((response) => {
      setMountDayDefect(response.data);
    });
  }, []);

  const handleDownload = async (e) => {
    const response = await api.get(`plating/mount/search/defect/${e}`);
    console.log(response);

    setData(response.data);
  };

  const [data, setData] = useState([{}]);
  const [headers, setHeaders] = useState([
    { label: 'PCP', key: 'pcpName' },
    { label: 'Produto', key: 'productName' },
    { label: 'SubProduto', key: 'subProductName' },
    { label: 'Setor', key: 'sectorName' },
    { label: 'Motivo', key: 'reason' },
    { label: 'Quantidade reprovada', key: 'amountDefect' },
    { label: 'Movimento', key: 'movement' },
    { label: 'Hora da reprova', key: 'hour' },
    { label: 'Dia', key: 'day' },
  ]);

  const csvReport = {
    data: data,
    headers: headers,
    filename: 'relatorioReprovadoChaparia.csv',
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
