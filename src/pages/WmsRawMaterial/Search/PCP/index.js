import React, { useState, useEffect } from 'react';

import {
  Layout,
  Table,
  Button,
  Row,
  Input,
  Space,
  Col,
  Modal,
  Form,
} from 'antd';

import Highlighter from 'react-highlight-words';

import api from '../../../../services/api';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';

export default function ResumeEntry() {
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

          sorter: (a, b) => this.compareByAlph(a.age, b.age),
          ...this.getColumnSearchProps('name'),
        },
        {
          title: 'Data inicial',
          dataIndex: 'initial_date',
          key: 'initial_date',
          ...this.getColumnSearchProps('initial_date'),
        },
        {
          title: 'Operação',
          dataIndex: 'operacao',
          align: 'center',

          render: (text, record) => {
            return (
              <React.Fragment>
                <EyeOutlined
                  style={{ marginLeft: 20 }}
                  onClick={() => handleEdit(record)}
                />
              </React.Fragment>
            );
          },
        },
      ];

      return <Table columns={columns} dataSource={productionLines} />;
    }
  }

  const [productionLines, setProductionLine] = useState([]);
  const [rawMaterial, setRawMaterial] = useState([
    { ins: '', description: '', total: 0, deliver: 0 },
  ]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    api.get('product-plan-control ', {}).then((response) => {
      setProductionLine(response.data);
    });
  }, []);

  async function handleEdit(e) {
    const response = await api.get(`product-plan-control/raw-material/${e.id}`);

    setRawMaterial(response.data);

    handleShow();
  }

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

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
        {/* <Col span={24} align="end">
          <Button type="submit" className="buttonGreen">
            {/* <CSVDownload
              data={stock}
              className="supplyButton"
              target="_blank"
              filename="entrada.csv"
              separator={';'}
            >
              <DownloadOutlined /> Baixar Estoque
            </CSVDownload> 
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
        </Col> */}
      </Row>
      <SearchTable />

      <Modal
        title="Cadastro de Drop"
        visible={show}
        onCancel={handleClose}
        width={800}
        footer={[
          <Button key="back" type="default" onClick={handleClose}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary">
            Salvar
          </Button>,
        ]}
      >
        {rawMaterial.map((item) => {
          return (
            <>
              <Row gutter={5}>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Insumo:"
                    labelAlign={'left'}
                  >
                    <Input
                      name="ins"
                      value={`${item.ins} - ${item.description}`}
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Quantidade Solicitada:"
                    labelAlign={'left'}
                  >
                    <Input name="total" value={item.total} disabled={true} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Quantidade Entregue:"
                    labelAlign={'left'}
                  >
                    <Input
                      name="deliver"
                      value={item.deliver}
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    labelCol={{ span: 23 }}
                    label="Falta entregar:"
                    labelAlign={'left'}
                  >
                    <Input
                      name="rest"
                      value={item.total - item.deliver}
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          );
        })}
        <Row gutter={5} style={{ marginTop: 16 }}>
          <Col span={12}></Col>
        </Row>
      </Modal>
    </Layout>
  );
}
