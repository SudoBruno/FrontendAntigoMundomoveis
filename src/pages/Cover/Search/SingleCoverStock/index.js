import React, { useState, useEffect } from 'react';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import api from '../../../../services/api';
import {
  Layout,
  Table,
  Button,
  Row,
  Input,
  Space,
  Select,
  Col,
  Form,
} from 'antd';

const Option = Select.Option;

export default function SingleCoverStock() {
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
      ];

      return <Table columns={columns} dataSource={stock} />;
    }
  }

  const [stock, setStock] = useState([]);

  const [headers, setHeaders] = useState([
    { label: 'id', key: 'stockId' },
    { label: 'Capa', key: 'coverName' },
    { label: 'Quantidade', key: 'quantity' },
    { label: 'Almoxarifado', key: 'warehouseName' },
    { label: 'Rua', key: 'streetName' },
  ]);
  const [covers, setCovers] = useState([]);
  const [totalCover, setTotalCover] = useState(0);

  const [coverName, setCoverName] = useState('');
  const [coverId, setCoverId] = useState(0);

  useEffect(() => {
    api.get('cover/stock', {}).then((response) => {
      setStock(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('sub-product/cover', {}).then((response) => {
      setCovers(response.data);
    });
  }, []);

  const findCover = async (e) => {
    const response = await api.get(`cover/stock/${e}`);

    setStock(response.data.stock);
    setTotalCover(response.data.total);
  };

  function HandleChangeCover(e) {
    setCoverName(e[1]);
    setCoverId(e[0]);

    findCover(e[0]);
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
      <Row gutter={5}>
        <Col span={22}>
          <Form.Item
            labelCol={{ span: 23 }}
            style={{ maxWidth: '570px' }}
            label="Capa:"
            labelAlign={'left'}
          >
            <Select
              showSearch
              placeholder="Selecione"
              size="large"
              value={coverName}
              onChange={(e) => HandleChangeCover(e)}
            >
              {covers.map((option) => {
                return (
                  <>
                    <Option key={option.id} value={[option.id, option.name]}>
                      {option.name}
                    </Option>
                  </>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col style={{ marginTop: '1%', fontSize: '20px' }}>
          <h1>
            Total: <h1 style={{ marginTop: '2%' }}>{totalCover}</h1>
          </h1>
        </Col>
      </Row>

      <SearchTable />
    </Layout>
  );
}
