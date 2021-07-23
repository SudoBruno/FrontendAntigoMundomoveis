import {
  SearchOutlined
} from '@ant-design/icons';
import {
  Button, Col, Input, Row, Space, Table
} from 'antd';
import Layout from 'antd/lib/layout/layout';
import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import api from '../../../../services/api';

const { Search } = Input;

export default function PlatingSearchTag() {
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

    handleTableChange = (filters, sorter) => {
      this.setState({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    };

    render() {
      const columns = [
        {
          title: 'Codigo de barras',
          dataIndex: 'bar_code',
          key: 'bar_code',

          sorter: (a, b) => this.compareByAlph(a.bar_code, b.bar_code),
          ...this.getColumnSearchProps('bar_code'),
        },
        {
          title: 'Inicio',
          dataIndex: 'start',
          key: 'start',

          sorter: (a, b) => this.compareByAlph(a.start, b.start),
          ...this.getColumnSearchProps('start'),
        },
        {
          title: 'Fim',
          dataIndex: 'finish',
          key: 'finish',

          sorter: (a, b) => this.compareByAlph(a.finish, b.finish),
          ...this.getColumnSearchProps('finish'),
        },
        {
          title: 'Setor',
          dataIndex: 'sector_name',
          key: 'sector_name',

          sorter: (a, b) => this.compareByAlph(a.sector_name, b.sector_name),
          ...this.getColumnSearchProps('sector_name'),
        },
        {
          title: 'Maquina',
          dataIndex: 'machine_name',
          key: 'machine_name',

          sorter: (a, b) => this.compareByAlph(a.machine_name, b.machine_name),
          ...this.getColumnSearchProps('machine_name'),
        },
        {
          title: 'Proximo setor',
          dataIndex: 'next_sector_name',
          key: 'next_sector_name',

          sorter: (a, b) => this.compareByAlph(a.next_sector_name, b.next_sector_name),
          ...this.getColumnSearchProps('next_sector_name'),
        }

      ];

      return (
        <Table
          dataSource={tagInfos}
          columns={columns}
          rowKey="filter"
        />
      );
    }
  }

  const [tagInfos, setTagInfos] = useState([{}]);

  async function onSearch(e) {
    const response = await api.get(`tag/search/${e}`)
    //746dbc10
    const infos = response.data

    infos.forEach(tagInfo => {

      tagInfo.start = tagInfo.start == null ? '' : format(parseISO(tagInfo.start), 'dd/MM/yyyy HH:mm', ptBR)
      tagInfo.finish = tagInfo.finish == null ? '' : format(parseISO(tagInfo.finish), 'dd/MM/yyyy HH:mm', ptBR)
    })
    setTagInfos(response.data)
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
        <Col span={24} align="center">
          <Search placeholder="Buscar por código" allowClear
            onSearch={onSearch} style={{ width: 200 }} />

        </Col>
      </Row>

      <SearchTable />
    </Layout>
  );
}
