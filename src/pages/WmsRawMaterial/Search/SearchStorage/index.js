import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { Layout, Table, Button, Row, Input, Space, Col } from 'antd';

import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  DownloadOutlined,
  BarcodeOutlined,
} from '@ant-design/icons';
import api from '../../../../services/api';

import './style.css';
import { Link } from 'react-router-dom';

export default function ResumeEntry() {
  class SearchTable extends React.Component {
    state = {
      pagination: {
        current: 1,
        pageSize: 200,
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
            placeholder={`Pesquisar ${dataIndex}`}
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

          sorter: (a, b) => this.compareByAlph(a.id, b.id),
          ...this.getColumnSearchProps('id'),
        },
        {
          title: 'INS',
          dataIndex: 'ins',
          key: 'ins',

          sorter: (a, b) => this.compareByAlph(a.ins, b.ins),
          ...this.getColumnSearchProps('ins'),
        },
        {
          title: 'Insumo',
          dataIndex: 'description',
          key: 'description',

          sorter: (a, b) => this.compareByAlph(a.description, b.description),
          ...this.getColumnSearchProps('description'),
        },
        {
          title: 'Un.med',
          dataIndex: 'unmeasure',
          key: 'unmeasure',

          sorter: (a, b) => this.compareByAlph(a.unmeasure, b.unmeasure),
          ...this.getColumnSearchProps('unmeasure'),
        },
        {
          title: 'Almoxarifado',
          dataIndex: 'warehouse',
          key: 'warehouse',

          sorter: (a, b) => this.compareByAlph(a.warehouse, b.warehouse),
          ...this.getColumnSearchProps('warehouse'),
        },
        {
          title: 'Posição',
          dataIndex: 'position',
          key: 'position',
          sorter: (a, b) => this.compareByAlph(a.position, b.position),
          ...this.getColumnSearchProps('position'),
        },
        {
          title: 'Lote',
          dataIndex: 'lote',
          key: 'lote',
          sorter: (a, b) => this.compareByAlph(a.lote, b.lote),
          ...this.getColumnSearchProps('lote'),
        },
        {
          title: 'Quantidade',
          dataIndex: 'quantity',
          key: 'quantity',
          sorter: (a, b) => this.compareByAlph(a.quantity, b.quantity),
          ...this.getColumnSearchProps('quantity'),
        },
        {
          title: 'Operação',
          colSpan: 2,
          dataIndex: 'operacao',
          align: 'center',

          render: (text, record) => {
            return (
              <React.Fragment>
                <Link
                  to={`/stock/barcode/${record.id}`}
                  target="_blank"
                  style={{ color: 'rgb(0,0,0,0.65' }}
                >
                  <BarcodeOutlined style={{ marginLeft: 20 }} />
                </Link>
              </React.Fragment>
            );
          },
        },
      ];

      return <Table columns={columns} dataSource={rawMaterials} />;
    }
  }

  const [rawMaterials, setRawMaterials] = useState([]);

  const [stock, setStock] = useState([]);

  useEffect(() => {
    api.get('/wmsrm/operation/search/storage', {}).then((response) => {
      setRawMaterials(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('/wmsrm/operation/search/storage').then((response) => {
      let arr = [];
      response.data.map((item) => {
        arr.push({
          criado_em: item.created_at,
          posicao: item.position,
          almoxarifado: item.warehouse,
          ins: item.ins,
          insumo: item.description,
          unidade: item.unmeasure,
          lote: item.lote,
          quantidade: item.quantity,
        });
      });
      setStock(arr);
    });
  }, []);

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
          <Button type="submit" className="buttonGreen">
            {/* <CSVDownload
              data={stock}
              className="supplyButton"
              target="_blank"
              filename="entrada.csv"
              separator={';'}
            >
              <DownloadOutlined /> Baixar Estoque
            </CSVDownload> */}
            <DownloadOutlined style={{ marginRight: 8 }} />
            <CSVLink
              data={stock}
              filename="estoque_almoxarifado.csv"
              style={{ color: '#fff' }}
              separator={';'}
            >
              Download
            </CSVLink>
          </Button>
        </Col>
      </Row>
      <SearchTable />
    </Layout>
  );
}
